'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Network, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  Share2, 
  Plus,
  FolderKanban
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

const INITIAL_MAPS: MindMapItem[] = [
  {
    id: 'map-01',
    title: 'Weekly Team Synch',
    updatedAt: '2 hours ago',
    nodeCount: 9,
    category: 'Meetings',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'map-02',
    title: 'LLM Traffic Estimation Architecture',
    updatedAt: 'Yesterday',
    nodeCount: 14,
    category: 'AI Research',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'map-03',
    title: 'Vocalyze Sprint 3 Product Backlog',
    updatedAt: '3 days ago',
    nodeCount: 11,
    category: 'Scrum',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'map-04',
    title: 'User Interview Insights & Feedback',
    updatedAt: 'Jan 12, 2026',
    nodeCount: 8,
    category: 'UX Research',
    color: 'from-pink-500 to-rose-600',
  },
];

export default function MyMapsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [maps, setMaps] = useState<MindMapItem[]>(INITIAL_MAPS);

  const filteredMaps = maps.filter((map) =>
    map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setMaps(maps.filter((m) => m.id !== id));
  };

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white">
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

          <Link 
            href="/" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Map</span>
          </Link>
        </div>
      </div>

      {/* Grid Liste */}
      {filteredMaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaps.map((map) => (
            <div 
              key={map.id}
              className="group rounded-2xl bg-[#121622] border border-[#1f2438] hover:border-indigo-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div>
                {/* Kart Görsel/Header Alanı */}
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

                {/* Başlık */}
                <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition line-clamp-1 mb-1">
                  {map.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Updated {map.updatedAt}</span>
                </div>
              </div>

              {/* Aksiyon Butonları */}
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
                  href="/" 
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
      )}
    </div>
  );
}