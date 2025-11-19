'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <div className="text-6xl md:text-7xl font-bold text-red-500 mb-4">
              Oops!
            </div>
            <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>
            <p className="text-sm text-gray-500">
              Error ID: {error.digest || 'Unknown'}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </motion.div>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 p-6 bg-white rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What happened?
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• The page encountered an unexpected error</p>
              <p>• This might be a temporary issue</p>
              <p>• Our development team has been notified</p>
              <p>• Try refreshing the page or going back</p>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-8 p-6 bg-blue-50 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Still having issues?
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              If the problem persists, please contact our support team.
            </p>
            <div className="text-xs text-blue-600">
              <p>• Check your internet connection</p>
              <p>• Clear your browser cache</p>
              <p>• Try using a different browser</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
