'use client';

import { toPng } from "html-to-image";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Download, 
  FileImage, 
  Code, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { getProjects, createProject, ProjectDTO } from '../src/services/api';

// Proje Ekleme & Bağlantı Test Bileşeni
function ProjectsTestSection() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProjects()
      .then((res) => {
        console.log("Projeler:", res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hata:", err);
        setLoading(false);
      });
  }, []);

  const handleCreate = async () => {
    const newProject: ProjectDTO = {
      name: 'Vocalyze Sprint 3',
      description: 'TSX üzerinden eklendi',
      status: 'Active',
    };

    const res = await createProject(newProject);
    console.log('Oluşturulan Proje:', res);
  };

  return (
    <div className="p-4 bg-[#181d2f] rounded-xl border border-indigo-500/30 mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-xs font-semibold text-slate-200">API Bağlantı Testi</h3>
        <p className="text-[11px] text-slate-400">
          {loading ? 'Projeler yükleniyor...' : 'FastAPI bağlantısı aktif!'}
        </p>
      </div>
      <button 
        onClick={handleCreate}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
      >
        + API Proje Ekle
      </button>
    </div>
  );
}

// Mock Data (Zihin Haritası Düğümleri)
const MOCK_MIND_MAP = {
  id: 'project-vocalyze-01',
  title: 'Weekly Team Synch',
  nodes: [
    { id: 'root', label: 'Weekly Team Synch', type: 'root', color: '#8b5cf6' },
    
    // Ana Başlıklar
    { id: 'n1', label: 'Feature Updates', type: 'main', color: '#6366f1' },
    { id: 'n2', label: 'Market Research', type: 'main', color: '#3b82f6' },
    { id: 'n3', label: 'User Feedback', type: 'main', color: '#ec4899' },
    { id: 'n4', label: 'Resource Allocation', type: 'main', color: '#10b981' },

    // Alt Başlıklar
    { id: 'n1-1', label: 'Node Layouts', type: 'sub', color: '#a855f7', parentId: 'n1' },
    { id: 'n1-2', label: 'JSON Export', type: 'sub', color: '#a855f7', parentId: 'n1' },
    { id: 'n2-1', label: 'Competitor Analysis', type: 'sub', color: '#06b6d4', parentId: 'n2' },
    { id: 'n3-1', label: 'Bug Reports', type: 'sub', color: '#f43f5e', parentId: 'n3' },
  ]
};

// TEK ANA BİLEŞEN (EXPORT DEFAULT)
export default function Home() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const mindMapRef = useRef<HTMLDivElement>(null);

  // Dynamic Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Hazır');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simülasyon
  const startAnalysisSimulated = () => {
    setIsProcessing(true);
    setUploadProgress(15);
    setCurrentStepText('Ses dosyası yükleniyor...');

    setTimeout(() => {
      setUploadProgress(50);
      setCurrentStepText('STT: Metne dönüştürülüyor...');
    }, 1200);

    setTimeout(() => {
      setUploadProgress(85);
      setCurrentStepText('AI: Zihin haritası oluşturuluyor...');
    }, 2800);

    setTimeout(() => {
      setUploadProgress(100);
      setCurrentStepText('Zihin Haritası Hazır!');
      setIsProcessing(false);
    }, 4000);
  };

  // Zoom Kontrolleri
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.5));

  // Export Fonksiyonları
  const exportAsJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MOCK_MIND_MAP, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${MOCK_MIND_MAP.id}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setIsExportOpen(false);
    } catch (err) {
      console.error('JSON export hatası:', err);
    }
  };

  const exportAsPNG = async () => {
    if (!mindMapRef.current) return;

    try {
      const dataUrl = await toPng(mindMapRef.current);

      const link = document.createElement("a");
      link.download = "mindmap.png";
      link.href = dataUrl;
      link.click();

      setIsExportOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* SOL PANEL */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        
        {/* API Bağlantı Test Bileşeni */}
        <ProjectsTestSection />

        <div className="p-5 rounded-2xl bg-[#121622] border border-[#1f2438] shadow-xl">
          <h2 className="text-sm font-semibold mb-4 text-slate-200">Start New Analysis</h2>
          
          <div 
            onClick={!isProcessing ? startAnalysisSimulated : undefined}
            className={`border-2 border-dashed ${isProcessing ? 'border-pink-500/50 bg-pink-500/5' : 'border-indigo-500/30 hover:border-indigo-500/60 bg-[#181d2f]/50 hover:bg-[#181d2f]'} rounded-xl p-6 transition cursor-pointer flex flex-col items-center justify-center text-center group block`}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-indigo-500/20">
              <Mic className={`w-5 h-5 ${isProcessing ? 'animate-pulse text-pink-400' : 'text-indigo-400'}`} />
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">
              {isProcessing ? 'Processing Audio...' : 'Upload MP3/WAV Recording'}
            </p>
            <p className="text-[10px] text-slate-500">Click to start analysis simulation</p>
          </div>

          {/* Dynamic Progress */}
          <div className="mt-5">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium truncate pr-2">{currentStepText}</span>
              <span className="text-indigo-400 font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#090b10] h-2 rounded-full overflow-hidden p-0.5 border border-[#1f2438]">
              <div 
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 rounded-2xl bg-[#121622] border border-[#1f2438] flex flex-col">
          <h2 className="text-sm font-semibold mb-4 text-slate-200">Recent Projects</h2>
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-[#1a2035] border border-indigo-500/40 cursor-pointer shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-100">{MOCK_MIND_MAP.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">Jan 18, 2026 • 1h 05m</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ PANEL (ZİHİN HARİTASI TUVALİ) */}
      <div className="col-span-12 lg:col-span-9 bg-[#121622] border border-[#1f2438] rounded-2xl p-5 flex flex-col relative overflow-hidden shadow-2xl min-h-[650px]">
        
        {/* ToolBar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f2438] z-20 antialiased selection:bg-indigo-500 selection:text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-slate-200">Interactive Mind Map</h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Zoom In/Out */}
            <div className="flex items-center bg-[#090b10] border border-[#1f2438] rounded-xl p-1 text-xs text-slate-400">
              <button onClick={handleZoomIn} title="Zoom In" className="p-1.5 hover:bg-[#1a2035] hover:text-white rounded-lg transition active:scale-95">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-medium text-[11px] font-mono select-none">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={handleZoomOut} title="Zoom Out" className="p-1.5 hover:bg-[#1a2035] hover:text-white rounded-lg transition active:scale-95">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset Zoom */}
            <button onClick={() => setZoomLevel(1)} className="flex items-center gap-1.5 bg-[#090b10] border border-[#1f2438] hover:bg-[#1a2035] text-slate-400 text-xs px-3 py-1.5 rounded-xl transition">
              <Move className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Nodes..." 
                className="bg-[#090b10] border border-[#1f2438] text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500 w-36 lg:w-44 placeholder-slate-500"
              />
            </div>

            {/* Export Dropdown */}
            <div className="relative z-30">
              <button 
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#1a2035] border border-[#252b45] rounded-xl shadow-2xl z-50 p-1.5 text-xs text-slate-300 antialiased selection:bg-indigo-500 selection:text-white">
                  <button onClick={exportAsPNG} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-lg transition text-left">
                    <FileImage className="w-3.5 h-3.5 text-cyan-400" /> PNG Format
                  </button>
                  <button onClick={exportAsJSON} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-lg transition text-left">
                    <Code className="w-3.5 h-3.5 text-amber-400" /> JSON Format
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HTML & CSS MIND MAP CANVAS */}
        <div ref={mindMapRef} className="flex-1 bg-[#090b10] rounded-xl mt-4 relative overflow-hidden flex items-center justify-center border border-[#161a28] p-8">
          <div className="absolute inset-0 bg-[radial-gradient(#1f2438_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

          {/* Scale Edilen İçerik Grubu */}
          <div 
            className="relative transition-transform duration-300 ease-out origin-center flex flex-col items-center gap-10"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* 1. Root Node */}
            {MOCK_MIND_MAP.nodes.filter(n => n.type === 'root').map((rootNode) => {
              const isHighlighted = searchQuery && rootNode.label.toLowerCase().includes(searchQuery.toLowerCase());
              return (
                <div 
                  key={rootNode.id}
                  className={`px-6 py-3 rounded-2xl bg-[#121622] border-2 shadow-2xl text-center backdrop-blur-md transition-all ${
                    isHighlighted ? 'border-pink-500 ring-4 ring-pink-500/30 scale-110' : 'border-purple-500/80'
                  }`}
                >
                  <p className="text-sm font-bold text-white tracking-wide">{rootNode.label}</p>
                  <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Root Topic</span>
                </div>
              );
            })}

            {/* 2. Main Nodes Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {MOCK_MIND_MAP.nodes.filter(n => n.type === 'main').map((mainNode) => {
                const isHighlighted = searchQuery && mainNode.label.toLowerCase().includes(searchQuery.toLowerCase());
                const subNodes = MOCK_MIND_MAP.nodes.filter(n => n.parentId === mainNode.id);

                return (
                  <div key={mainNode.id} className="flex flex-col items-center gap-3">
                    {/* Main Node Box */}
                    <div 
                      className={`px-4 py-2.5 rounded-xl bg-[#161a28] border transition-all text-center ${
                        isHighlighted ? 'border-pink-500 bg-pink-500/20 ring-4 ring-pink-500/30 scale-105' : 'border-indigo-500/50'
                      }`}
                      style={{ borderColor: isHighlighted ? '#ec4899' : mainNode.color }}
                    >
                      <p className="text-xs font-semibold text-slate-100">{mainNode.label}</p>
                    </div>

                    {/* Sub Nodes */}
                    {subNodes.length > 0 && (
                      <div className="flex flex-col gap-2 border-t border-dashed border-slate-700/60 pt-2 w-full items-center">
                        {subNodes.map((sub) => {
                          const isSubHighlighted = searchQuery && sub.label.toLowerCase().includes(searchQuery.toLowerCase());
                          return (
                            <div 
                              key={sub.id}
                              className={`px-3 py-1 rounded-lg bg-[#0d0f17] border text-[10px] font-medium transition-all ${
                                isSubHighlighted ? 'border-pink-500 text-pink-300 ring-2 ring-pink-500/30' : 'border-slate-800 text-slate-400'
                              }`}
                            >
                              {sub.label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Sağ Alt Bilgilendirme */}
          <div className="absolute bottom-4 right-4 bg-[#121622]/90 border border-[#1f2438] p-2 rounded-xl backdrop-blur-md shadow-xl flex flex-col items-end gap-1 pointer-events-none">
            <span className="text-[10px] text-slate-400 font-mono">Nodes: {MOCK_MIND_MAP.nodes.length}</span>
            <span className="text-[10px] text-indigo-400 font-mono">Zoom: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}