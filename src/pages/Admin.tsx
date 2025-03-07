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
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState<Page[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [newPage, setNewPage] = useState({ title: '', slug: '', content: '' });
  const [newContent, setNewContent] = useState({ key: '', value: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Admin component mounted');
    console.log('Current user:', user);
    console.log('Current role:', role);

    if (role !== 'admin') {
      console.log('User is not admin, redirecting...');
      navigate('/');
      return;
    }

    console.log('User is admin, fetching data...');
    fetchData();
  }, [role, navigate, user]);

  const fetchData = async () => {
    try {
      console.log('Fetching data for user:', user?.id);
      const [pagesResponse, contentResponse] = await Promise.all([
        supabase.from('pages').select('*').order('created_at', { ascending: false }),
        supabase.from('content').select('*').order('updated_at', { ascending: false })
      ]);

      console.log('Pages response:', pagesResponse);
      console.log('Content response:', contentResponse);

      if (pagesResponse.error) {
        console.error('Error fetching pages:', pagesResponse.error);
        throw pagesResponse.error;
      }
      if (contentResponse.error) {
        console.error('Error fetching content:', contentResponse.error);
        throw contentResponse.error;
      }

      setPages(pagesResponse.data || []);
      setContent(contentResponse.data || []);
      setError(null);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageEdit = async (page: Page) => {
    try {
      console.log('Updating page:', page);
      const { data, error } = await supabase
        .from('pages')
        .update({ title: page.title, content: page.content })
        .eq('id', page.id)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Error updating page:', error);
        throw error;
      }
      console.log('Page updated successfully');
      setEditingPage(null);
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Error in handlePageEdit:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating the page');
    }
  };

  const handlePageDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      console.log('Deleting page:', pageId);
      const { data, error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId)
        .select();

      console.log('Delete response:', { data, error });

      if (error) {
        console.error('Error deleting page:', error);
        throw error;
      }
      console.log('Page deleted successfully');
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Error in handlePageDelete:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while deleting the page');
    }
  };

  const handleContentEdit = async (content: Content) => {
    try {
      console.log('Updating content:', content);
      const { data, error } = await supabase
        .from('content')
        .update({ value: content.value })
        .eq('id', content.id)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Error updating content:', error);
        throw error;
      }
      console.log('Content updated successfully');
      setEditingContent(null);
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Error in handleContentEdit:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating the content');
    }
  };

  const handleAddPage = async () => {
    try {
      console.log('Adding new page:', newPage);
      const { data, error } = await supabase
        .from('pages')
        .insert([newPage])
        .select();

      console.log('Insert response:', { data, error });

      if (error) {
        console.error('Error adding page:', error);
        throw error;
      }
      console.log('Page added successfully');
      setNewPage({ title: '', slug: '', content: '' });
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Error in handleAddPage:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while adding the page');
    }
  };

  const handleAddContent = async () => {
    try {
      console.log('Adding new content:', newContent);
      const { data, error } = await supabase
        .from('content')
        .insert([newContent])
        .select();

      console.log('Insert response:', { data, error });

      if (error) {
        console.error('Error adding content:', error);
        throw error;
      }
      console.log('Content added successfully');
      setNewContent({ key: '', value: '' });
      fetchData();
      setError(null);
    } catch (error) {
      console.error('Error in handleAddContent:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while adding the content');
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

          {error && (
            <div className="mb-4 p-4 bg-red-900 text-white rounded-md">
              {error}
            </div>
          )}

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
                    {editingPage?.id === page.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingPage.title}
                          onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          placeholder="Page Title"
                        />
                        <textarea
                          value={editingPage.content}
                          onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          placeholder="Page Content"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePageEdit(editingPage)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPage(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-white">{page.title}</h3>
                        <p className="text-sm text-gray-400">Slug: {page.slug}</p>
                        <div className="mt-2 space-x-2">
                          <button
                            onClick={() => setEditingPage(page)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePageDelete(page.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="border border-gray-700 rounded p-4">
                  <h3 className="font-medium text-white mb-2">Add New Page</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newPage.title}
                      onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      placeholder="Page Title"
                    />
                    <input
                      type="text"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      placeholder="Page Slug"
                    />
                    <textarea
                      value={newPage.content}
                      onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      placeholder="Page Content"
                    />
                    <button
                      onClick={handleAddPage}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Content</h2>
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={item.id} className="border border-gray-700 rounded p-4">
                    {editingContent?.id === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingContent.key}
                          disabled
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                        <textarea
                          value={editingContent.value}
                          onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleContentEdit(editingContent)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingContent(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-white">{item.key}</h3>
                        <p className="text-sm text-gray-400">{item.value}</p>
                        <div className="mt-2">
                          <button
                            onClick={() => setEditingContent(item)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="border border-gray-700 rounded p-4">
                  <h3 className="font-medium text-white mb-2">Add New Content</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newContent.key}
                      onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      placeholder="Content Key"
                    />
                    <textarea
                      value={newContent.value}
                      onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      placeholder="Content Value"
                    />
                    <button
                      onClick={handleAddContent}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add Content
                    </button>
                  </div>
                </div>
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