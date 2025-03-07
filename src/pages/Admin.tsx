import { Building2, FileText, Layout, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

interface Content {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export default function Admin() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState<Page[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
      return;
    }

    fetchData();
  }, [role, navigate]);

  const fetchData = async () => {
    try {
      const [pagesResponse, contentResponse] = await Promise.all([
        supabase.from('pages').select('*').order('created_at', { ascending: false }),
        supabase.from('content').select('*').order('updated_at', { ascending: false })
      ]);

      if (pagesResponse.error) throw pagesResponse.error;
      if (contentResponse.error) throw contentResponse.error;

      setPages(pagesResponse.data || []);
      setContent(contentResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-8">
            <Building2 className="h-8 w-8 text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'pages'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Manage Pages
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Layout className="h-5 w-5 mr-2" />
              Edit Content
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
          </div>

          {activeTab === 'pages' && (
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Pages</h2>
              <div className="space-y-4">
                {pages.map((page) => (
                  <div key={page.id} className="border border-gray-700 rounded p-4">
                    <h3 className="font-medium text-white">{page.title}</h3>
                    <p className="text-sm text-gray-400">Slug: {page.slug}</p>
                    <div className="mt-2 space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </div>
                ))}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Add New Page
                </button>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Content</h2>
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={item.id} className="border border-gray-700 rounded p-4">
                    <h3 className="font-medium text-white">{item.key}</h3>
                    <p className="text-sm text-gray-400">{item.value}</p>
                    <div className="mt-2">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                    </div>
                  </div>
                ))}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Add New Content
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
              <p className="text-gray-400">Settings page coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 