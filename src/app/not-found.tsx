'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div>
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-green-500 mb-4">
              404
            </div>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500">
              Don't worry, our team is working hard to bring you all the features you need!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>

          {/* Available Pages */}
          <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link
                href="/"
                className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/cricket"
                className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
              >
                Cricket
              </Link>
              <Link
                href="/football"
                className="p-3 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title="Coming Soon"
              >
                Football
              </Link>
              <Link
                href="/stats"
                className="p-3 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title="Coming Soon"
              >
                Stats
              </Link>
              <Link
                href="/news"
                className="p-3 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title="Coming Soon"
              >
                News
              </Link>
              <Link
                href="/threads"
                className="p-3 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                title="Coming Soon"
              >
                Crowd Thread
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">
                Need Help?
              </h3>
            </div>
            <p className="text-blue-700 text-sm mb-4">
              If you're looking for a specific page that should exist, please let us know!
            </p>
            <div className="text-xs text-blue-600">
              <p>• Cricket page is fully functional</p>
              <p>• Other pages are coming soon</p>
              <p>• Check back regularly for updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
