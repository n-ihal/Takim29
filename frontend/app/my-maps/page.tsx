'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Network, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  Share2, 
  Plus,
  FolderKanban,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';

interface MindMapItem {
  id: string;
  title: string;
  updatedAt: string;
  nodeCount: number;
  category: string;
  color: string;
}

const DEFAULT_COLORS = [
  'from-purple-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-pink-500 to-rose-600',
];

export default function MyMapsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [maps, setMaps] = useState<MindMapItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pop-up Modal durumları
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMapTitle, setNewMapTitle] = useState('');
  const [newMapCategory, setNewMapCategory] = useState('MEETINGS');
  const [creating, setCreating] = useState(false);

  // 1. Zihin Haritalarını Çekme
  const fetchMaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8000/api/maps');
      if (!res.ok) throw new Error('Backend ile iletişim kurulamadı.');

      const rawData = await res.json();
      const mappedData: MindMapItem[] = rawData.map((item: any, index: number) => ({
        id: String(item.id),
        title: item.title || 'Untitled Map',
        category: item.category || 'General',
        nodeCount: item.nodes_count ?? item.nodeCount ?? 0,
        updatedAt: item.updated_at || item.updatedAt || 'Recently',
        color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
      }));

      setMaps(mappedData);
    } catch (err: any) {
      console.error('Fetch mind maps error:', err);
      setError('Zihin haritaları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  // 2. Modal Üzerinden Yeni Harita Oluşturma
  const handleCreateNewMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapTitle.trim()) return;

    try {
      setCreating(true);
      const res = await fetch('http://localhost:8000/api/maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newMapTitle.trim(),
          category: newMapCategory,
          nodes_data: { nodes: [{ id: '1', label: 'Main Concept' }] }
        }),
      });

      if (!res.ok) throw new Error('Harita oluşturulamadı.');

      // Modal formunu sıfırla ve kapat
      setNewMapTitle('');
      setNewMapCategory('MEETINGS');
      setIsModalOpen(false);

      // Harita listesini yenile
      await fetchMaps();
    } catch (err) {
      console.error('Create map error:', err);
      alert('Yeni harita oluşturulurken bir hata oluştu.');
    } finally {
      setCreating(false);
    }
  };

  // 3. Silme İşlemi
  const handleDelete = async (id: string) => {
    if (!confirm('Bu zihin haritasını silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/maps/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMaps((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert('Silme işlemi gerçekleştirilemedi.');
      }
    } catch (err) {
      console.error('Delete mind map error:', err);
      alert('Silme sırasında bir hata oluştu.');
    }
  };

  const filteredMaps = maps.filter((map) =>
    map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white relative">
      {/* Üst Başlık ve Arama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f2438]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Mind Maps</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, manage, and edit all your AI-generated mind maps in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Arama Kutusu */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mind maps..." 
              className="bg-[#121622] border border-[#1f2438] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 w-64 placeholder-slate-500"
            />
          </div>

          {/* New Map Butonu (Modalı Açar) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Map</span>
          </button>
        </div>
      </div>

      {/* Yükleniyor Durumu */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-xs">Zihin haritaları yükleniyor...</p>
        </div>
      )}

      {/* Hata Durumu */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Liste */}
      {!loading && !error && (
        filteredMaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaps.map((map) => (
              <div 
                key={map.id}
                className="group rounded-2xl bg-[#121622] border border-[#1f2438] hover:border-indigo-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className={`h-28 rounded-xl bg-gradient-to-tr ${map.color} p-4 flex flex-col justify-between relative overflow-hidden mb-4 shadow-md`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10">
                        {map.category}
                      </span>
                      <Sparkles className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="relative z-10 flex items-center gap-1.5 text-white/90 text-[11px] font-mono">
                      <Network className="w-3.5 h-3.5" />
                      <span>{map.nodeCount} Nodes</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition line-clamp-1 mb-1">
                    {map.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated {map.updatedAt}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1f2438] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-[#1a2035] text-slate-400 hover:text-slate-200 transition" title="Share Map">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(map.id)}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition" 
                      title="Delete Map"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link 
                    href={`/map/${map.id}`} 
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>Open Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-slate-500 bg-[#121622] rounded-2xl border border-[#1f2438]">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No mind maps found matching your search.</p>
          </div>
        )
      )}

      {/* ================= NEW MAP POP-UP MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121622] border border-[#1f2438] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            
            {/* Modal Kapat Butonu */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1f2438] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Create New Mind Map</h2>
            <p className="text-xs text-slate-400 mb-6">Enter details to initialize a new AI mind map.</p>

            <form onSubmit={handleCreateNewMap} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Map Title
                </label>
                <input 
                  type="text" 
                  required
                  value={newMapTitle}
                  onChange={(e) => setNewMapTitle(e.target.value)}
                  placeholder="e.g. AI Traffic Architecture" 
                  className="w-full bg-[#0d1017] border border-[#1f2438] text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <select 
                  value={newMapCategory}
                  onChange={(e) => setNewMapCategory(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#1f2438] text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="MEETINGS">MEETINGS</option>
                  <option value="AI RESEARCH">AI RESEARCH</option>
                  <option value="SCRUM">SCRUM</option>
                  <option value="UX RESEARCH">UX RESEARCH</option>
                  <option value="GENERAL">GENERAL</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f2438]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1f2438] rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{creating ? 'Creating...' : 'Create Map'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}