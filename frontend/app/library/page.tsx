'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileAudio, 
  Filter, 
  Clock, 
  Download, 
  Trash2, 
  PlayCircle,
  FolderOpen,
  Loader2,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  size: string;
  category: string;
  tags: string[];
  filePath?: string;
  transcript?: string;
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ses Oynatıcı / Modal Durumu
  const [activeAudio, setActiveAudio] = useState<LibraryItem | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(false);

  // 1. Kütüphane Listesini Çekme
  const fetchLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8000/api/library');
      if (!res.ok) throw new Error('Backend ile iletişim kurulamadı.');

      const rawData = await res.json();
      
      const mappedData: LibraryItem[] = rawData.map((item: any) => ({
        id: String(item.id),
        title: item.title || 'Untitled Recording',
        date: item.created_at 
          ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : (item.date || 'Jan 18, 2026'),
        duration: item.duration || '00:00',
        size: item.size || '0.0 MB',
        category: item.category || 'General',
        tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
        filePath: item.file_path,
        transcript: item.transcript
      }));

      setItems(mappedData);
    } catch (err: any) {
      console.error('Fetch library error:', err);
      setError('Kütüphane öğeleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // 2. Oynatma İşlemi (Modal Açar + Transkript Çeker)
  const handlePlay = async (item: LibraryItem) => {
    setActiveAudio(item);
    setTranscript(item.transcript || null);

    // Eğer bileşende yoksa API'den transkripti çek
    if (!item.transcript) {
      try {
        setLoadingTranscript(true);
        const res = await fetch(`http://localhost:8000/api/library/${item.id}/transcript`);
        if (res.ok) {
          const data = await res.json();
          setTranscript(data.transcript || 'Bu kayıt için transkript bulunamadı.');
        }
      } catch (err) {
        console.error('Fetch transcript error:', err);
        setTranscript('Transkript yüklenirken hata oluştu.');
      } finally {
        setLoadingTranscript(false);
      }
    }
  };

  // 3. İndirme İşlemi
  const handleDownload = (audioId: string) => {
    window.open(`http://localhost:8000/api/library/${audioId}/download`, '_blank');
  };

  // 4. Silme İşlemi
  const handleDelete = async (audioId: string) => {
    if (!confirm('Bu kaydı ve ilişkili dosyayı silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/library/${audioId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== audioId));
        if (activeAudio?.id === audioId) setActiveAudio(null);
      } else {
        alert('Silme işlemi gerçekleştirilemedi.');
      }
    } catch (err) {
      console.error('Delete audio item error:', err);
      alert('Silme sırasında bir hata oluştu.');
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white relative">
      {/* Üst Başlık & Arama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f2438]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audio & Map Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, listen to, and manage your archived audio recordings and generated transcripts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library or tags..." 
              className="bg-[#121622] border border-[#1f2438] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 w-64 placeholder-slate-500"
            />
          </div>

          <button className="flex items-center gap-2 bg-[#121622] hover:bg-[#1a2035] border border-[#1f2438] text-slate-300 text-xs px-3.5 py-2 rounded-xl transition">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Yükleniyor / Hata Durumları */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-xs">Ses kayıtları yükleniyor...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Kayıtlar Listesi */}
      {!loading && !error && (
        <div className="bg-[#121622] border border-[#1f2438] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#1f2438] bg-[#090b10]/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Items ({filteredItems.length})</span>
          </div>

          <div className="divide-y divide-[#1f2438]">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-[#161a28] transition flex items-center justify-between gap-4 group"
                >
                  {/* Sol Taraf: İkon ve Bilgi */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition shrink-0">
                      <FileAudio className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-indigo-400 transition">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {item.duration}
                        </span>
                        <span>•</span>
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{item.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sağ Taraf: Etiketler ve Aksiyonlar */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden lg:flex items-center gap-1.5">
                      {item.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2.5 py-0.5 rounded-md bg-[#090b10] border border-[#1f2438] text-[10px] font-medium text-purple-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* OYNAT BUTONU (Modal Açıp Çalar) */}
                      <button 
                        onClick={() => handlePlay(item)}
                        className="p-2 rounded-xl bg-[#1a2035] hover:bg-indigo-600 text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5 px-3" 
                        title="Play Audio"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Play</span>
                      </button>

                      {/* İNDİR BUTONU */}
                      <button 
                        onClick={() => handleDownload(item.id)}
                        className="p-2 rounded-xl bg-[#1a2035] hover:bg-[#252b45] text-slate-300 transition active:scale-95" 
                        title="Download Audio"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* SİL BUTONU */}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl bg-[#1a2035] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No items found in your library.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= AUDIO PLAYER & TRANSCRIPT MODAL ================= */}
      {activeAudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121622] border border-[#1f2438] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col gap-5">
            
            {/* Kapat Butonu */}
            <button 
              onClick={() => setActiveAudio(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1f2438] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Başlık */}
            <div className="flex items-start gap-3 pr-8">
              <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <FileAudio className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{activeAudio.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeAudio.date} • {activeAudio.duration}</p>
              </div>
            </div>

            {/* Dahili HTML5 Ses Oyuncusu */}
            <div className="bg-[#090b10] border border-[#1f2438] p-4 rounded-xl">
              <audio 
                controls 
                autoPlay
                className="w-full focus:outline-none"
                src={`http://localhost:8000/api/library/${activeAudio.id}/download`}
              >
                Tarayıcınız ses oynatıcısını desteklemiyor.
              </audio>
            </div>

            {/* Transkript Alanı */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Transcript</span>
              </div>
              
              <div className="bg-[#0d1017] border border-[#1f2438] rounded-xl p-4 text-xs text-slate-300 max-h-60 overflow-y-auto leading-relaxed">
                {loadingTranscript ? (
                  <div className="flex items-center gap-2 text-slate-500 py-4 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>Transkript yükleniyor...</span>
                  </div>
                ) : (
                  transcript || 'Transkript bulunamadı.'
                )}
              </div>
            </div>

            {/* Alt Aksiyon */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1f2438]">
              <span className="text-[11px] text-slate-500 font-mono">ID: {activeAudio.id}</span>
              <button 
                onClick={() => handleDownload(activeAudio.id)}
                className="flex items-center gap-2 bg-[#1a2035] hover:bg-[#252b45] text-slate-200 text-xs px-3.5 py-2 rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP3</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}