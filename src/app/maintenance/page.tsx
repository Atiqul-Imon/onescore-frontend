'use client';

import { Wrench, Clock, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div>
          {/* Maintenance Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-12 h-12 text-yellow-500" />
            </div>
            <div className="text-6xl md:text-7xl font-bold text-yellow-500 mb-4">
              Maintenance
            </div>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>

          {/* Maintenance Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We're Updating Our Platform
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              We're currently performing maintenance to bring you an even better experience.
            </p>
            <p className="text-sm text-gray-500">
              This usually takes just a few minutes. Thank you for your patience!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Check Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Maintenance Info */}
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                What's Happening?
              </h3>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• We're updating our database with the latest sports data</p>
              <p>• Improving our live score system</p>
              <p>• Adding new features and pages</p>
              <p>• Optimizing performance for better experience</p>
            </div>
          </div>

          {/* Expected Time */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Expected Completion
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              We expect to be back online within the next 5-10 minutes.
            </p>
            <div className="text-xs text-blue-600">
              <p>• Live scores will be updated</p>
              <p>• New pages will be available</p>
              <p>• Performance improvements will be active</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-xs text-gray-500">
            <p>If you continue to see this page after 15 minutes, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
