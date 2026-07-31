'use client';

import React, { useState } from 'react';
import { 
  Search, 
  FileAudio, 
  Filter, 
  Clock, 
  Tag, 
  MoreVertical, 
  Download, 
  Trash2, 
  PlayCircle,
  FolderOpen
} from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  size: string;
  category: string;
  tags: string[];
}

const INITIAL_LIBRARY: LibraryItem[] = [
  {
    id: 'rec-01',
    title: 'Weekly Team Synch - Sprint Planning',
    date: 'Jan 18, 2026',
    duration: '1h 05m',
    size: '48.2 MB',
    category: 'Meetings',
    tags: ['Scrum', 'Sprint 3', 'Vocalyze'],
  },
  {
    id: 'rec-02',
    title: 'User Feedback & Usability Interview #4',
    date: 'Jan 15, 2026',
    duration: '34m 12s',
    size: '22.8 MB',
    category: 'Interviews',
    tags: ['UX', 'Feedback', 'Testing'],
  },
  {
    id: 'rec-03',
    title: 'LLM Inference Optimization Brainstorming',
    date: 'Jan 10, 2026',
    duration: '45m 00s',
    size: '31.5 MB',
    category: 'Research',
    tags: ['AI', 'LLM', 'Architecture'],
  },
  {
    id: 'rec-04',
    title: 'Product Roadmap & Q1 Goals',
    date: 'Jan 05, 2026',
    duration: '52m 18s',
    size: '39.0 MB',
    category: 'Strategy',
    tags: ['Roadmap', 'Management'],
  },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<LibraryItem[]>(INITIAL_LIBRARY);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white">
      {/* Üst Başlık & Arama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f2438]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audio & Map Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, listen to, and manage your archived audio recordings and generated transcripts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Arama Çubuğu */}
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

      {/* Kayıtlar Listesi */}
      <div className="bg-[#121622] border border-[#1f2438] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1f2438] bg-[#090b10]/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Total Items ({filteredItems.length})</span>
          <span className="text-[10px] text-slate-500 font-mono">Storage Used: 141.5 MB</span>
        </div>

        <div className="divide-y divide-[#1f2438]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="p-4 hover:bg-[#161a28] transition flex items-center justify-between gap-4 group"
              >
                {/* Sol Sol: İkon ve Bilgi */}
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
                  {/* Etiketler */}
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

                  {/* Butonlar */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-[#1a2035] hover:bg-indigo-600 text-slate-300 hover:text-white transition active:scale-95" title="Play Recording">
                      <PlayCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-[#1a2035] hover:bg-[#252b45] text-slate-300 transition active:scale-95" title="Download Audio">
                      <Download className="w-4 h-4" />
                    </button>
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
    </div>
  );
}