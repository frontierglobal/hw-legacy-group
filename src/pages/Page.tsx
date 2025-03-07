import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPage(data);
    } catch (error: any) {
      setError(error.message);
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

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-red-400">Page not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Building2 className="h-8 w-8 text-blue-400 mr-2" />
              <h1 className="text-3xl font-bold text-white">{page.title}</h1>
            </div>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      </div>
    </div>
  );
} 