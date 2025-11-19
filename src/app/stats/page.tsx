import { BarChart3, TrendingUp, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div>
          {/* Coming Soon Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-12 h-12 text-purple-500" />
            </div>
            <div className="text-6xl md:text-7xl font-bold text-purple-500 mb-4">
              Stats
            </div>
            <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Coming Soon Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Statistics Coming Soon
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              We're building comprehensive player and team statistics.
            </p>
            <p className="text-sm text-gray-500">
              Premium quality, accurate database - free for all users!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Player</div>
              <div className="text-sm text-gray-500">Stats</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Team</div>
              <div className="text-sm text-gray-500">Records</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">League</div>
              <div className="text-sm text-gray-500">Tables</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <BarChart3 className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500">& Insights</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/cricket"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Check Cricket
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Progress Info */}
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Coming?
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Player statistics and records</p>
              <p>• Team performance analytics</p>
              <p>• League standings and tables</p>
              <p>• Historical data and trends</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-xs text-gray-500">
            <p>Premium quality statistics - completely free for all users!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
