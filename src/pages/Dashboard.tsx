import { Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Building2 className="h-8 w-8 text-blue-400 mr-2" />
              <h1 className="text-2xl font-bold text-white">
                Welcome, {user?.email}
              </h1>
            </div>
            <p className="text-gray-400">
              This is your personal dashboard. More features coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 