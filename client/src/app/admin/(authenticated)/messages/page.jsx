'use client';
import { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, Trash2, Loader2, Info } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInquiryId, setActiveInquiryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { token } = useAuthStore();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data);
      if (response.data.length > 0 && !activeInquiryId) {
        setActiveInquiryId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      alert('Failed to load inquiries. Make sure you are logged in as admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${API_BASE}/api/inquiries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(inquiries.filter(inq => inq._id !== id));
        if (activeInquiryId === id) {
          setActiveInquiryId(null);
        }
      } catch (error) {
        console.error('Error deleting inquiry:', error);
        alert('Failed to delete inquiry.');
      }
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeInquiry = inquiries.find(inq => inq._id === activeInquiryId) || filteredInquiries[0];

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customer Inquiries</h1>
          <p className="text-slate-400">Manage form submissions from the Contact and Expeditions pages.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Messages List Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-[#0B0C10]/30 shrink-0">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..." 
                className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
                <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
                <p className="text-sm font-medium">Decrypting transmissions...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                <Info size={32} className="mb-4 opacity-50" />
                <p className="text-sm font-medium">No messages found.</p>
                {searchQuery && <p className="text-xs mt-1">Try a different search term.</p>}
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const isActive = activeInquiry?._id === inq._id;
                return (
                  <div 
                    key={inq._id}
                    onClick={() => setActiveInquiryId(inq._id)}
                    className={`p-4 border-l-2 cursor-pointer transition-colors ${isActive ? 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/15' : 'border-transparent hover:bg-white/5'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{inq.name}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-xs font-medium mb-1 truncate ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                      Source: {inq.source.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{inq.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message View Area */}
        <div className="flex-1 flex flex-col bg-[#0B0C10]/10">
          {activeInquiry ? (
            <>
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">Inquiry from {activeInquiry.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {activeInquiry.email && (
                      <span className="text-slate-300">
                        Email: <a href={`mailto:${activeInquiry.email}`} className="text-blue-400 hover:underline">{activeInquiry.email}</a>
                      </span>
                    )}
                    <span className="text-slate-300">
                      Phone: <a href={`tel:${activeInquiry.phone}`} className="text-blue-400 hover:underline">{activeInquiry.phone}</a>
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-slate-500">
                      {new Date(activeInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleDelete(activeInquiry._id)} className="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors tooltip-target" title="Delete Message">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-slate-300 leading-relaxed text-sm">
                {activeInquiry.chassis && (
                  <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl self-start min-w-[200px]">
                    <div className="text-[10px] text-sky-400/80 uppercase tracking-widest font-bold mb-1">Target Chassis Platform</div>
                    <div className="text-sky-300 font-bold font-mono text-base">{activeInquiry.chassis.toUpperCase()}</div>
                  </div>
                )}
                
                <div className="bg-[#0B0C10]/50 border border-white/5 rounded-xl p-5 shadow-inner flex-1">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <Mail size={12} />
                    Transmission Log
                  </div>
                  <div className="whitespace-pre-wrap font-mono text-slate-300 leading-loose">
                    {activeInquiry.message}
                  </div>
                </div>
              </div>
              
              {activeInquiry.email && (
                <div className="p-6 border-t border-white/10 shrink-0 bg-black/20">
                  <a 
                    href={`mailto:${activeInquiry.email}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-lg transition-colors"
                  >
                    <Mail size={16} />
                    Reply via Email
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
              <Mail size={48} className="mb-4 opacity-20" />
              <p>Select a message to read.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
