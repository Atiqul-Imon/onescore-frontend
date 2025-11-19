import { Activity, Trophy, Users, TrendingUp } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin">
                <Activity className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-4">
              Loading...
            </div>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>

          {/* Loading Message */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Getting Sports Data
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Fetching the latest cricket and football updates...
            </p>
            <p className="text-sm text-gray-500">
              This might take a few seconds
            </p>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500">Live Matches</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-500">Active Series</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>

          {/* Loading Progress */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500">
              Loading sports data and live scores...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
