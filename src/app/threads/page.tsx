import { Metadata } from 'next';
import { ThreadsPage } from '@/components/threads/ThreadsPage';

export const metadata: Metadata = {
  title: 'Crowd Thread - Sports Community Discussions',
  description: 'Join the sports community discussions. Share your thoughts, ask questions, and engage with fellow sports fans.',
};

export default function Threads() {
  return <ThreadsPage />;
}