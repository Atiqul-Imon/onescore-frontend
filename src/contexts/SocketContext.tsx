'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '@/hooks/redux';
import { updateMatch } from '@/store/slices/cricketSlice';
import { updateMatch as updateFootballMatch } from '@/store/slices/footballSlice';
import { addContent } from '@/store/slices/contentSlice';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  transport: string | null;
  joinMatch: (matchId: string) => void;
  leaveMatch: (matchId: string) => void;
  subscribeToTeam: (teamId: string) => void;
  unsubscribeFromTeam: (teamId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isDev = process.env.NODE_ENV !== 'production';
  const devLog = (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  };
  const devWarn = (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  };

  useEffect(() => {
    // Determine WebSocket URL - use wss:// for production, ws:// for development
    let wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    
    if (!wsUrl) {
      // Auto-detect protocol based on environment
      if (typeof window !== 'undefined') {
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        if (isProduction) {
          // Production: use wss:// (secure WebSocket)
          wsUrl = apiUrl.replace('https://', 'wss://').replace('http://', 'wss://');
        } else {
          // Development: use ws://
          wsUrl = apiUrl.replace('https://', 'ws://').replace('http://', 'ws://');
        }
      } else {
        // Server-side: default to development
        wsUrl = 'ws://localhost:5000';
      }
    }
    
    // Only connect if we have a valid URL and it's not the production URL in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && wsUrl?.includes('scorenews.net')) {
      devWarn('Skipping WebSocket connection - production URL detected in development');
      setSocket(null);
      return;
    }
    
    if (!wsUrl) {
      devWarn('WebSocket URL not available, skipping connection');
      setSocket(null);
      return;
    }
    
    // Connect to /live namespace (matches backend WebSocketGateway namespace)
    // Updated: WebSocket connection for real-time match updates
    const socketUrl = `${wsUrl}/live`;
    
    console.log('[SocketContext] Connecting to WebSocket:', {
      url: socketUrl,
      wsUrl,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      env: process.env.NODE_ENV,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    });
    
    const newSocket = io(socketUrl, {
      transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
      timeout: 20000,
      forceNew: true,
      reconnection: true, // Enable reconnection for better reliability
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      autoConnect: true, // Auto-connect when socket is created
      upgrade: true, // Allow transport upgrade
    });

    newSocket.on('connect', () => {
      const currentTransport = newSocket.io.engine?.transport?.name || 'unknown';
      devLog('Socket connected:', {
        id: newSocket.id,
        transport: currentTransport,
        url: socketUrl,
      });
      setIsConnected(true);
      setTransport(currentTransport);
    });

    newSocket.on('disconnect', (reason) => {
      devLog('Socket disconnected:', reason);
      setIsConnected(false);
      setTransport(null);
    });

    let connectionAttempts = 0;
    const maxConnectionAttempts = 3;

    newSocket.on('connect_error', (error) => {
      connectionAttempts++;
      // Only log connection errors if we've tried multiple times and still not connected
      // Socket.IO will automatically retry with polling if websocket fails
      if (connectionAttempts >= maxConnectionAttempts && !isConnected) {
        devWarn('Socket connection attempts failed, will continue retrying:', error.message);
      } else {
        // Silently retry - Socket.IO handles fallback automatically
        devLog('Socket connection attempt, retrying...');
      }
    });

    // Track transport changes after connection
    const setupTransportMonitoring = () => {
      if (newSocket.io.engine) {
        newSocket.io.engine.on('upgrade', () => {
          const currentTransport = newSocket.io.engine.transport.name;
          devLog('Socket transport upgraded to:', currentTransport);
          setTransport(currentTransport);
          connectionAttempts = 0; // Reset on successful upgrade
        });

        newSocket.io.engine.on('upgradeError', (error: Error) => {
          // This is not a critical error - polling will work fine
          // Only log in development to avoid console noise in production
          devLog('Socket upgrade failed, using polling (this is normal):', error.message);
          // Keep current transport (polling)
        });
      }
    };

    // Set up transport monitoring when connected
    newSocket.on('connect', () => {
      setupTransportMonitoring();
    });

    // Match updates (from subscribe:match)
    newSocket.on('match-update', (data) => {
      devLog('Match update received:', data);
      
      // Update cricket match if it's a cricket match
      if (data.format && ['test', 'odi', 't20i', 't20', 'first-class', 'list-a'].includes(data.format)) {
        dispatch(updateMatch(data));
      }
      
      // Update football match if it's a football match
      if (data.league) {
        dispatch(updateFootballMatch(data));
      }
    });

    // Live score updates (legacy support)
    newSocket.on('liveScoreUpdate', (data) => {
      devLog('Live score update received:', data);
      
      // Update cricket match if it's a cricket match
      if (data.format && ['test', 'odi', 't20i', 't20', 'first-class', 'list-a'].includes(data.format)) {
        dispatch(updateMatch(data));
      }
      
      // Update football match if it's a football match
      if (data.league) {
        dispatch(updateFootballMatch(data));
      }
    });

    // Match events
    newSocket.on('matchStarted', (data) => {
      devLog('Match started:', data);
      toast.success(`${data.teams?.home?.name} vs ${data.teams?.away?.name} has started!`);
    });

    newSocket.on('matchEnded', (data) => {
      devLog('Match ended:', data);
      toast.success(`${data.teams?.home?.name} vs ${data.teams?.away?.name} has ended!`);
    });

    newSocket.on('goalScored', (data) => {
      devLog('Goal scored:', data);
      toast.success(`Goal! ${data.player} scored for ${data.team}`);
    });

    newSocket.on('wicketFallen', (data) => {
      devLog('Wicket fallen:', data);
      toast.success(`Wicket! ${data.player} is out`);
    });

    // Content updates
    newSocket.on('newContent', (data) => {
      devLog('New content:', data);
      dispatch(addContent(data));
      toast.success('New content available!');
    });

    // Notifications
    newSocket.on('notification', (data) => {
      devLog('Notification received:', data);
      
      switch (data.type) {
        case 'success':
          toast.success(data.message);
          break;
        case 'error':
          toast.error(data.message);
          break;
        case 'info':
          toast(data.message, { icon: 'ℹ️' });
          break;
        case 'warning':
          toast(data.message, { icon: '⚠️' });
          break;
        default:
          toast(data.message);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [dispatch]);

  const joinMatch = (matchId: string) => {
    if (socket && isConnected) {
      socket.emit('joinMatch', matchId);
      devLog(`Joined match: ${matchId}`);
    }
  };

  const leaveMatch = (matchId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveMatch', matchId);
      devLog(`Left match: ${matchId}`);
    }
  };

  const subscribeToTeam = (teamId: string) => {
    if (socket && isConnected) {
      socket.emit('subscribeToTeam', teamId);
      devLog(`Subscribed to team: ${teamId}`);
    }
  };

  const unsubscribeFromTeam = (teamId: string) => {
    if (socket && isConnected) {
      socket.emit('unsubscribeFromTeam', teamId);
      devLog(`Unsubscribed from team: ${teamId}`);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    transport,
    joinMatch,
    leaveMatch,
    subscribeToTeam,
    unsubscribeFromTeam,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
