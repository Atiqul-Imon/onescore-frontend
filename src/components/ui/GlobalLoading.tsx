'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface GlobalLoadingProps {
  message?: string;
  showStats?: boolean;
}

export function GlobalLoading({ 
  message = "Loading...", 
  showStats = true 
}: GlobalLoadingProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Loading Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Activity className="w-8 h-8 text-green-500" />
          </motion.div>

          {/* Loading Message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Please wait while we fetch the latest data...
          </p>

          {/* Loading Progress */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Stats (if enabled) */}
          {showStats && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">12</div>
                <div className="text-xs text-gray-500">Live</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">8</div>
                <div className="text-xs text-gray-500">Series</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">24</div>
                <div className="text-xs text-gray-500">Upcoming</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
