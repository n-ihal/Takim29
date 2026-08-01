'use client';

import { toPng } from "html-to-image";
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Mic, Search, Download, FileImage, Code, CheckCircle2, Sparkles, Upload, ListTodo, FileText, User, Calendar, Play
} from 'lucide-react';
import { getProjects, createProject, processAudio } from '../src/services/api';

// --- REACT FLOW IMPORTS ---
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// --- ÖZEL DÜĞÜM (NODE) TASARIMLARI (Component Dışında Tanımlandı) ---
const RootNode = ({ data }: any) => (
  <div className="px-6 py-3 rounded-2xl bg-[#121622] border-2 border-purple-500/80 shadow-2xl text-center focus-within:border-pink-500 transition-colors min-w-[200px]">
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500 border-none" />
    <input 
      defaultValue={data.label} 
      onChange={data.onChange}
      className="text-sm font-bold text-white tracking-wide bg-transparent text-center outline-none w-full" 
    />
    <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block mt-1">Root Topic</span>
  </div>
);

const MainNode = ({ data }: any) => (
  <div className="px-4 py-2.5 rounded-xl bg-[#161a28] border border-indigo-500/50 shadow-lg text-center min-w-[150px] focus-within:border-pink-500 transition-colors">
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-indigo-500 border-none" />
    <input 
      defaultValue={data.label} 
      onChange={data.onChange}
      className="text-xs font-semibold text-slate-100 bg-transparent text-center outline-none w-full" 
    />
    <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-indigo-500 border-none" />
  </div>
);

const SubNode = ({ data }: any) => (
  <div className="px-3 py-1.5 rounded-lg bg-[#0d0f17] border border-slate-700 text-center min-w-[120px] focus-within:border-pink-500 transition-colors">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-slate-400 border-none" />
    <input 
      defaultValue={data.label} 
      onChange={data.onChange}
      className="text-[11px] font-medium text-slate-300 bg-transparent text-center outline-none w-full" 
    />
  </div>
);

const initialNodes = [
  { id: 'root', type: 'root', position: { x: 400, y: 50 }, data: { label: 'Weekly Team Synch' } },
  { id: 'n1', type: 'main', position: { x: 100, y: 200 }, data: { label: 'Feature Updates' } },
  { id: 'n2', type: 'main', position: { x: 400, y: 200 }, data: { label: 'Market Research' } },
  { id: 'n3', type: 'main', position: { x: 700, y: 200 }, data: { label: 'User Feedback' } },
  { id: 'n1-1', type: 'sub', position: { x: 50, y: 300 }, data: { label: 'Node Layouts' } },
  { id: 'n1-2', type: 'sub', position: { x: 180, y: 300 }, data: { label: 'JSON Export' } },
  { id: 'n2-1', type: 'sub', position: { x: 400, y: 300 }, data: { label: 'Competitor Analysis' } },
];

const initialEdges = [
  { id: 'e-root-n1', source: 'root', target: 'n1', animated: true, style: { stroke: '#6366f1' } },
  { id: 'e-root-n2', source: 'root', target: 'n2', animated: true, style: { stroke: '#6366f1' } },
  { id: 'e-root-n3', source: 'root', target: 'n3', animated: true, style: { stroke: '#6366f1' } },
  { id: 'e-n1-n1-1', source: 'n1', target: 'n1-1', style: { stroke: '#a855f7' } },
  { id: 'e-n1-n1-2', source: 'n1', target: 'n1-2', style: { stroke: '#a855f7' } },
  { id: 'e-n2-n2-1', source: 'n2', target: 'n2-1', style: { stroke: '#a855f7' } },
];

function ProjectsTestSection() {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getProjects().then(() => setLoading(false)).catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    await createProject({ name: 'Vocalyze Sprint 3', description: 'TSX üzerinden eklendi', status: 'Active' });
  };

  return (
    <div className="p-4 bg-[#181d2f] rounded-xl border border-indigo-500/30 mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-xs font-semibold text-slate-200">API Bağlantı Testi</h3>
        <p className="text-[11px] text-slate-400">{loading ? 'Yükleniyor...' : 'FastAPI bağlantısı aktif!'}</p>
      </div>
      <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition">
        + API Proje Ekle
      </button>
    </div>
  );
}

export default function Home() {
  // React Flow nodeTypes uyarısını çözmek için useMemo kullanıyoruz
  const nodeTypes = useMemo(() => ({ root: RootNode, main: MainNode, sub: SubNode }), []);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Turkish');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Hazır');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMapTitle, setCurrentMapTitle] = useState('Weekly Team Synch');

  const [executiveSummary, setExecutiveSummary] = useState<string>('Henüz analiz edilmiş bir toplantı özeti bulunmuyor. Sol taraftan bir ses dosyası yükleyerek yapay zeka analizini başlatabilirsiniz.');
  const [actionItems, setActionItems] = useState<Array<{ task: string; assignee: string; due_date: string }>>([
    { task: 'Örnek: Zihin haritası arayüzü güncellenecek', assignee: 'Sena', due_date: 'Bugün' },
    { task: 'Örnek: FastAPI entegrasyon testleri yapılacak', assignee: 'Takım', due_date: 'Yarın' }
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const [sentiment, setSentiment] = useState<string>('Henüz Analiz Edilmedi');

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/search-transcript?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.matches || []);
      } catch (err) {
        console.error("Arama hatası:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(15);
    setCurrentStepText(`"${file.name}" yükleniyor...`);
    setCurrentMapTitle(file.name.replace(/\.[^/.]+$/, ""));

    try {
      const uploadResult: any = await uploadAudioFileHelper(file);
      const fileId = uploadResult.file_id; 

      setUploadProgress(50);
      setCurrentStepText('STT: Ses metne dönüştürülüyor...');

      const result: any = await processAudio(fileId, undefined, targetLanguage);

      setUploadProgress(90);
      setCurrentStepText('AI: Özet ve harita oluşturuluyor...');

      if (result.status === 'success' && result.data) {
        const data = result.data;
        const rawNodes = data.nodes || [];
        const rootLabel = file.name.replace(/\.[^/.]+$/, "");

        if (data.sentiment) {
          setSentiment(data.sentiment);
        }

        if (data.executive_summary) {
          setExecutiveSummary(data.executive_summary);
        }
        if (data.action_items && Array.isArray(data.action_items)) {
          setActionItems(data.action_items);
        }

        const newNodes: any[] = [];
        const newEdges: any[] = [];

        newNodes.push({ 
          id: 'root-topic', 
          type: 'root', 
          position: { x: 400, y: 50 }, 
          data: { label: rootLabel } 
        });

        let mainIndex = 0;
        let subIndexCounts: { [key: string]: number } = {};

        rawNodes.forEach((node: any, index: number) => {
          const isMain = index < 3; 
          
          if (isMain) {
            const xPos = 100 + (mainIndex * 300);
            newNodes.push({
              id: node.id || `node-${index}`,
              type: 'main',
              position: { x: xPos, y: 200 },
              data: { label: node.label }
            });
            newEdges.push({
              id: `e-root-${node.id}`,
              source: 'root-topic',
              target: node.id || `node-${index}`,
              animated: true,
              style: { stroke: '#6366f1' }
            });
            subIndexCounts[node.id] = 0;
            mainIndex++;
          } else {
            const parentId = rawNodes[index % 3]?.id || rawNodes[0]?.id;
            const sIndex = subIndexCounts[parentId] || 0;
            const parentNode = newNodes.find(n => n.id === parentId);
            const parentX = parentNode ? parentNode.position.x : 400;

            newNodes.push({
              id: node.id || `node-${index}`,
              type: 'sub',
              position: { x: parentX + (sIndex % 2 === 0 ? -60 : 60), y: 320 + (Math.floor(sIndex / 2) * 80) },
              data: { label: node.label }
            });
            newEdges.push({
              id: `e-${parentId}-${node.id}`,
              source: parentId,
              target: node.id || `node-${index}`,
              style: { stroke: '#a855f7' }
            });
            subIndexCounts[parentId] = sIndex + 1;
          }
        });

        setNodes(newNodes);
        setEdges(newEdges);
      }

      setUploadProgress(100);
      setCurrentStepText('Analiz Tamamlandı!');
    } catch (error) {
      console.error("İşlem hatası:", error);
      setCurrentStepText('Hata oluştu, tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadAudioFileHelper = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://127.0.0.1:8000/api/upload', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  };

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges, executive_summary: executiveSummary, action_items: actionItems }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindmap-data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsExportOpen(false);
  };

  const exportAsPNG = async () => {
    if (!reactFlowWrapper.current) return;
    try {
      const dataUrl = await toPng(reactFlowWrapper.current, { backgroundColor: '#090b10' });
      const link = document.createElement("a");
      link.download = "vocalyze-mindmap.png";
      link.href = dataUrl;
      link.click();
      setIsExportOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*" className="hidden" />

      {/* SOL PANEL */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        <ProjectsTestSection />

        <div className="p-5 rounded-2xl bg-[#121622] border border-[#1f2438] shadow-xl">
          <h2 className="text-sm font-semibold mb-4 text-slate-200">Start New Analysis</h2>
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed ${isProcessing ? 'border-pink-500/50 bg-pink-500/5' : 'border-indigo-500/30 hover:border-indigo-500/60 bg-[#181d2f]/50 hover:bg-[#181d2f]'} rounded-xl p-6 transition cursor-pointer flex flex-col items-center justify-center text-center group block`}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-indigo-500/20">
              {isProcessing ? <Mic className="w-5 h-5 animate-pulse text-pink-400" /> : <Upload className="w-5 h-5 text-indigo-400" />}
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">{isProcessing ? 'Processing Audio...' : 'Upload MP3/WAV Recording'}</p>
            <p className="text-[10px] text-slate-500">Click to browse audio files</p>
          </div>

          <div className="mt-4 flex items-center justify-between bg-[#181d2f] p-3 rounded-xl border border-[#1f2438]">
            <span className="text-xs text-slate-300 font-medium">Output Language</span>
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-[#090b10] text-xs text-indigo-300 border border-[#1f2438] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="Turkish">Türkçe</option>
              <option value="English">English</option>
              <option value="German">Deutsch</option>
              <option value="French">Français</option>
            </select>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium truncate pr-2">{currentStepText}</span>
              <span className="text-indigo-400 font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#090b10] h-2 rounded-full overflow-hidden p-0.5 border border-[#1f2438]">
              <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 rounded-2xl bg-[#121622] border border-[#1f2438] flex flex-col">
          <h2 className="text-sm font-semibold mb-4 text-slate-200">Recent Projects</h2>
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-[#1a2035] border border-indigo-500/40 cursor-pointer shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-100">{currentMapTitle}</p>
                <p className="text-[11px] text-slate-400 mt-1">Today • Just now</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ PANEL */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
        
        <div className="bg-[#121622] border border-[#1f2438] rounded-2xl p-5 flex flex-col relative overflow-visible shadow-2xl min-h-[550px]">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#1f2438] z-30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-semibold text-slate-200">Interactive Mind Map</h2>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in Audio Transcripts..." 
                  className="bg-[#090b10] border border-[#1f2438] text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500 w-52 lg:w-64 placeholder-slate-500"
                />

                {searchQuery.trim().length >= 2 && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#121622] border border-[#1f2438] rounded-xl shadow-2xl z-50 p-2 max-h-72 overflow-y-auto">
                    <p className="text-[10px] font-semibold text-slate-400 px-2 pb-1.5 border-b border-[#1f2438]">
                      {isSearching ? 'Searching transcripts...' : `Found in ${searchResults.length} audio recordings`}
                    </p>

                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <div key={idx} className="p-2.5 hover:bg-[#1a2035] rounded-lg transition mt-1 cursor-pointer border border-transparent hover:border-indigo-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-indigo-300 truncate">{item.title}</span>
                            <Play className="w-3 h-3 text-cyan-400 shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-400 italic bg-[#090b10] p-1.5 rounded border border-[#161a28]">
                            {item.snippet}
                          </p>
                        </div>
                      ))
                    ) : (
                      !isSearching && <p className="text-xs text-slate-500 text-center py-3">No matches found in audio transcripts.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="relative z-20">
                <button onClick={() => setIsExportOpen(!isExportOpen)} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl transition shadow-lg shadow-indigo-600/20">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                {isExportOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#1a2035] border border-[#252b45] rounded-xl shadow-2xl z-50 p-1.5 text-xs text-slate-300">
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

          <div ref={reactFlowWrapper} className="flex-1 bg-[#090b10] rounded-xl mt-4 relative border border-[#161a28] overflow-hidden min-h-[450px] z-10">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[#090b10]"
            >
              <Background color="#1f2438" gap={24} size={2} />
              <Controls className="bg-[#121622] border-[#1f2438] fill-white" />
              <MiniMap 
                nodeColor={(n) => {
                  if (n.type === 'root') return '#8b5cf6';
                  if (n.type === 'main') return '#6366f1';
                  return '#475569';
                }}
                maskColor="rgba(9, 11, 16, 0.8)"
                className="bg-[#121622] border border-[#1f2438]"
              />
            </ReactFlow>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121622] border border-[#1f2438] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-200">Executive Summary</h3>
                </div>
                {/* Duygu Durumu Rozeti */}
                <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Tone: {sentiment}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed bg-[#090b10] p-4 rounded-xl border border-[#161a28]">
                {executiveSummary}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1f2438] flex items-center justify-between text-[11px] text-slate-500">
              <span>AI Generated Insight</span>
              <span className="text-indigo-400 font-mono">Gemini 3 Flash</span>
            </div>
          </div>

          <div className="bg-[#121622] border border-[#1f2438] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListTodo className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">Action Items & Tasks</h3>
              </div>
              
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                {actionItems && actionItems.length > 0 ? (
                  actionItems.map((item, idx) => (
                    <div key={idx} className="bg-[#090b10] border border-[#161a28] p-2.5 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-slate-300 font-medium">{item.task}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <User className="w-3 h-3" /> {item.assignee}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.due_date}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">Bu kayıt için tespit edilen eylem maddesi bulunmuyor.</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1f2438] flex items-center justify-between text-[11px] text-slate-500">
              <span>Total Tasks: {actionItems.length}</span>
              <span className="text-emerald-400 font-mono">Ready to Export</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}