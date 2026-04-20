import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, LayoutDashboard, Tv, Image as ImageIcon, 
  Monitor, Smartphone, CheckCircle, RefreshCw, 
  X, Check, User, ExternalLink, ArrowRight, Zap,
  Globe, Shield, QrCode, Sparkles, Lock, LogIn,
  Send, RotateCcw, ChevronRight, Activity, TrendingUp,
  Heart, Stars, Gift, Calendar, Music
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import io from 'socket.io-client';

const SERVER_URL = (import.meta.env.VITE_SERVER_URL || window.location.origin).toString().trim();
const socket = io(SERVER_URL);

// --- Navigation ---
const Navbar = () => {
  const { pathname } = useLocation();
  if (pathname === '/client') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="flex items-center gap-2 no-underline group">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
          <Heart size={18} className="text-white fill-white" />
        </div>
        <span className="text-lg sm:text-xl font-black tracking-tighter text-text-main">
          OUR<span className="text-primary xs-hidden">MOMENTS</span>
        </span>
      </Link>
      <div className="nav-links">
        <Link to="/gallery" className={pathname === '/gallery' ? 'active' : ''}>Gallery</Link>
        <Link to="/admin" className={pathname === '/admin' ? 'active' : ''}>Admin</Link>
      </div>
      <Link to="/client" className="btn btn-primary !py-2 !px-3 sm:!py-2.5 sm:!px-5 rounded-full text-[10px] sm:text-xs shadow-none whitespace-nowrap">
        <span className="xs-hidden">Join Live</span>
        <span className="xs-only">Join</span>
      </Link>
    </nav>
  );
};

// --- Animations ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- Components ---

const Home = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamerName, setStreamerName] = useState('');
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);

  useEffect(() => {
    socket.on('stream-status', (status) => {
      setIsLive(status.active);
      setStreamerName(status.streamerName || '');
      if (!status.active) setCurrentFrame(null);
    });

    socket.on('stream-frame', (frame) => {
      setCurrentFrame(frame);
      setIsLive(true);
    });

    return () => { 
      socket.off('stream-status'); 
      socket.off('stream-frame');
    };
  }, []);

  return (
    <div className="page-container justify-center items-center text-center">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-5xl"
      >
        <motion.div variants={fadeInUp} className="flex justify-center mb-8 sm:mb-16">
          <div className="status-badge group cursor-default">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`} />
            <span className={isLive ? 'text-red-400 font-bold' : 'group-hover:text-emerald-400 transition-colors'}>
              {isLive ? 'LIVE STREAMING ACTIVE' : 'SYSTEM ONLINE'}
            </span>
          </div>
        </motion.div>

        {isLive && currentFrame && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 sm:mb-24 w-full"
          >
            <div className="glass-card !p-0 overflow-hidden border-primary/40 shadow-[0_0_80px_rgba(212,175,55,0.2)] max-w-3xl mx-auto group">
              <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <h3 className="text-sm font-black tracking-widest uppercase m-0">Direct Live</h3>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span className="text-xs font-bold text-text-muted">Captured by {streamerName}</span>
                </div>
              </div>
              <div className="aspect-video w-full bg-black relative overflow-hidden">
                <img src={currentFrame} className="w-full h-full object-contain" alt="Live stream" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-white text-xs font-bold tracking-widest uppercase">Live Celebration Feed</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.h1 variants={fadeInUp} className="hero-title">
          Capturing Our <br />
          <span className="text-gradient">Eternal Love.</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="hero-subtitle px-4 lg:px-0">
          Every guest a photographer. Every moment a treasure. Help us document our special day through your lens.
        </motion.p>
        
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10 sm:mt-12 px-4">
          <Link to="/client" className="btn btn-primary group !py-5 !px-8 text-lg min-w-[240px]">
            Share a Moment <Camera size={22} className="transition-transform group-hover:scale-110 ml-2" />
          </Link>
          <Link to="/gallery" className="btn btn-secondary !py-5 !px-8 text-lg min-w-[240px]">
            View Guest Gallery
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-24 sm:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 px-6">
           {[
             { icon: <Heart className="text-secondary fill-secondary" />, title: "Cherished", desc: "Forever preserved" },
             { icon: <Sparkles className="text-primary" />, title: "Magical", desc: "Real-time celebration" },
             { icon: <Gift className="text-amber-600" />, title: "Gifted", desc: "Shared with love" }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-4 group">
               <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-2 shadow-2xl transition-all group-hover:scale-110 group-hover:border-primary/50 group-hover:bg-primary/5">
                 {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
               </div>
               <div className="text-center">
                 <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                 <p className="text-base text-text-muted">{item.desc}</p>
               </div>
             </div>
           ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'adminwebsite' && pass === '123456') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="page-container justify-center items-center">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card max-w-md w-full"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto mb-8 flex items-center justify-center text-primary">
          <Lock size={40} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-2">Admin Panel</h2>
        <p className="text-text-muted text-center mb-10 max-w-xs mx-auto">Enter your credentials to manage live content.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase ml-1">Username</label>
            <input 
              className="input-field" 
              placeholder="admin..." 
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase ml-1">Password</label>
            <input 
              type="password"
              className="input-field" 
              placeholder="••••••" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}
          <button type="submit" className="btn btn-primary !w-full py-4 mt-4">
            Authorize <ChevronRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [streamerName, setStreamerName] = useState('');
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const clientUrl = `${window.location.origin}/client`;

  useEffect(() => {
    fetch(`${SERVER_URL}/photos`).then(r => r.json()).then(setPhotos).catch(e => console.error("Fetch failed", e));
    
    socket.on('new-photo', (ph) => setPhotos(v => [ph, ...v]));
    socket.on('photo-approved', (u) => setPhotos(v => v.map(p => p.id === u.id ? u : p)));
    socket.on('photo-removed', (id) => setPhotos(v => v.filter(p => p.id !== id)));
    
    socket.on('stream-status', (status) => {
      setIsLive(status.active);
      setStreamerName(status.streamerName || '');
      if (!status.active) setCurrentFrame(null);
    });

    socket.on('stream-frame', (frame) => {
      setCurrentFrame(frame);
      setIsLive(true);
    });

    return () => { 
      socket.off('new-photo'); 
      socket.off('photo-approved'); 
      socket.off('photo-removed'); 
      socket.off('stream-status');
      socket.off('stream-frame');
    };
  }, []);

  const killStream = () => {
    if (window.confirm("Are you sure you want to forcibly stop this stream?")) {
      socket.emit('kill-stream');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
        <div className="w-full lg:w-auto">
          <h2 className="text-4xl sm:text-6xl font-black mb-6">Command <span className="text-gradient">Center</span></h2>
          <div className="flex flex-wrap items-center gap-4">
             <div className="status-badge bg-primary/10 border-primary/20 text-primary !py-2 !px-5 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
               <Activity size={16} /> <span className="text-sm">LIVE MODERATION</span>
             </div>
             <p className="text-base text-text-muted border-l border-white/10 pl-4 ml-1">Monitoring {photos.length} total captures.</p>
          </div>
        </div>
        
        <div className="glass-card !p-5 flex items-center gap-6 bg-white/5 border-white/10 group lg:max-w-md w-full shadow-2xl">
           <div className="text-right flex-1 min-w-0">
             <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Live Feed Portal</p>
             <p className="text-sm font-mono text-primary truncate selection:bg-primary selection:text-white">{clientUrl}</p>
           </div>
           <div className="p-2 bg-white rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-3 shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
             <QRCodeSVG value={clientUrl} size={80} fgColor="#020617" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16 w-full">
          {[
            { label: "Pending Approval", val: photos.filter(p => p.status === 'pending').length, icon: <RefreshCw className="animate-spin-slow" />, color: "text-amber-400", bg: "bg-amber-400/10" },
            { label: "Total Published", val: photos.filter(p => p.status === 'approved').length, icon: <CheckCircle />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Active Photographers", val: new Set(photos.map(p => p.userName)).size, icon: <User />, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Live Streaming", val: isLive ? "ACTIVE" : "OFFLINE", icon: <Tv />, color: isLive ? "text-red-400" : "text-primary", bg: isLive ? "bg-red-400/10" : "bg-primary/10" }
          ].map((stat, i) => (
            <div key={i} className="glass-card stat-card">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase mb-2">{stat.label}</p>
                <p className={`stat-value ${stat.color} !text-2xl sm:!text-4xl`}>{stat.val}</p>
              </div>
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>{stat.icon}</div>
            </div>
          ))}
      </div>

      {isLive && currentFrame && (
        <div className="mb-20 w-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black flex items-center gap-3"><Tv /> Live Stream Monitor</h3>
            <button onClick={killStream} className="btn bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600 hover:text-white !py-2 !px-4 !text-xs">
              Stop Stream
            </button>
          </div>
          <div className="glass-card !p-0 overflow-hidden border-red-500/20 max-w-2xl">
             <div className="aspect-video bg-black relative">
               <img src={currentFrame} className="w-full h-full object-contain" alt="Live monitor" />
               <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-[10px] font-bold text-white uppercase animate-pulse">
                 Monitoring: {streamerName}
               </div>
             </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-black flex items-center gap-3"><ImageIcon /> Content Queue</h3>
          <div className="flex gap-2">
            <button className="btn btn-secondary !py-2 !px-4 !text-xs">Recent</button>
            <button className="btn btn-secondary !py-2 !px-4 !text-xs opacity-50">Oldest</button>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="glass-card text-center py-24 border-dashed opacity-40">
             <Sparkles size={48} className="mx-auto mb-4 text-text-muted" />
             <p className="font-bold text-xl">Queue is currently empty.</p>
             <p className="text-sm">Wait for new captures to arrive.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            <AnimatePresence mode="popLayout">
              {photos.map((p) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={p.id}
                  className={`photo-card relative group ${p.status === 'approved' ? 'border-primary/50' : ''}`}
                >
                  <img src={p.url} className="w-full" alt="Captured content" />
                  <div className="photo-overlay opacity-0 group-hover:opacity-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'approved' ? 'bg-primary text-white' : 'bg-amber-400 text-black'}`}>
                        {p.status}
                      </span>
                      <button onClick={() => fetch(`${SERVER_URL}/photo/${p.id}`, { method: 'DELETE' })} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                        <X size={20}/>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-black text-2xl mb-1">{p.userName}</p>
                        <p className="text-xs text-text-muted">{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Captured Live</p>
                      </div>
                      {p.status === 'pending' && (
                        <button onClick={() => fetch(`${SERVER_URL}/approve/${p.id}`, { method: 'POST' })} className="btn btn-primary w-full py-3 text-sm">Approve Moment</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const PublicGallery = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [streamerName, setStreamerName] = useState('');
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${SERVER_URL}/photos/approved`).then(r => r.json()).then(setPhotos).catch(e => console.error("Fetch failed", e));
    
    socket.on('photo-approved', (p) => setPhotos(v => [p, ...v]));
    socket.on('photo-removed', (id) => setPhotos(v => v.filter(p => p.id !== id)));
    
    socket.on('stream-status', (status) => {
      setIsLive(status.active);
      setStreamerName(status.streamerName || '');
      if (!status.active) setCurrentFrame(null);
    });

    socket.on('stream-frame', (frame) => {
      setCurrentFrame(frame);
      setIsLive(true);
    });

    return () => { 
      socket.off('photo-approved'); 
      socket.off('photo-removed'); 
      socket.off('stream-status');
      socket.off('stream-frame');
    };
  }, []);

  return (
    <div className="page-container">
      <header className="text-center mb-16 sm:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold mb-8"
        >
          <Heart size={14} className="fill-primary" /> THE WEDDING CELEBRATION WALL
        </motion.div>
        <h1 className="hero-title">Guest <span className="text-gradient">Gallery.</span></h1>
        <p className="hero-subtitle max-w-2xl">A collection of beautiful moments captured by our family and friends today.</p>
      </header>

      {isLive && currentFrame && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-20"
        >
          <div className="glass-card !p-0 overflow-hidden border-primary/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] max-w-4xl mx-auto">
            <div className="bg-primary/10 px-6 py-4 flex items-center justify-between border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-black tracking-widest uppercase">Live Broadcast</span>
              </div>
              <span className="text-xs font-bold text-text-muted italic">Shared by {streamerName}</span>
            </div>
            <div className="aspect-video w-full bg-black relative">
              <img src={currentFrame} className="w-full h-full object-contain" alt="Live stream" />
              <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                Real-Time Feed
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {photos.length === 0 ? (
        <div className="glass-card text-center py-40 border-dashed opacity-40">
          <ImageIcon size={64} className="mx-auto mb-6 text-text-muted" />
          <p className="text-2xl font-bold mb-2">The wall is currently empty.</p>
          <p className="text-text-muted">Waiting for new captures to arrive...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          <AnimatePresence mode="popLayout">
            {photos.map((p) => (
              <motion.div 
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="photo-card group"
              >
                <img src={p.url} alt={`Captured by ${p.userName}`} />
                <div className="photo-overlay bg-gradient-to-t from-bg-dark/95 via-bg-dark/40 to-transparent pt-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center font-black text-primary text-lg shadow-inner">
                         {p.userName.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <p className="font-black text-xl text-white leading-tight">{p.userName}</p>
                         <p className="text-[10px] text-primary font-black tracking-widest uppercase mt-1">Verified Moment</p>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const ClientCamera = () => {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [mode, setMode] = useState<'photo' | 'live'>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    let timer: any;
    if (isStreaming) {
      timer = setInterval(() => setStreamDuration(d => d + 1), 1000);
    } else {
      setStreamDuration(0);
    }
    return () => clearInterval(timer);
  }, [isStreaming]);

  const join = () => {
    if (name) setJoined(true);
  };

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1280;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
        };
      };
    });
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturing(true);
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], "photo.jpg", { type: "image/jpeg" });
      setSelectedFile(resizedFile);
      setPreviewUrl(URL.createObjectURL(resizedFile));
      setCapturing(false);
    }
  };

  const submitPhoto = async () => {
    if (!selectedFile) return;

    const fd = new FormData();
    fd.append('photo', selectedFile);
    fd.append('userName', name);
    
    setCapturing(true);
    try {
      await fetch(`${SERVER_URL}/upload`, { method: 'POST', body: fd });
      setSuccess(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Upload failed. Please check your connection.");
    }
    setCapturing(false);
  };

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      socket.emit('start-stream', { name });

      // Start frame capture loop
      intervalRef.current = setInterval(() => {
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const frame = canvasRef.current.toDataURL('image/jpeg', 0.4);
            socket.emit('stream-frame', frame);
          }
        }
      }, 100); // 10 FPS
    } catch (err) {
      alert("Could not access camera for streaming.");
    }
  };

  const stopLive = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsStreaming(false);
    socket.emit('stop-stream');
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!joined) {
    return (
      <div className="page-container justify-center items-center">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] mx-auto mb-10 flex items-center justify-center text-primary relative">
            <User size={48} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#020617] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-black mb-4">Hello There.</h2>
          <p className="text-text-muted mb-10">Identify yourself to start contributing to the live gallery.</p>
          
          <div className="space-y-6">
            <input 
              className="input-field !text-center text-xl font-bold"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button disabled={!name} onClick={join} className="btn btn-primary w-full py-5 text-xl shadow-2xl shadow-primary/40">
              Enter Gallery <ArrowRight size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container justify-center items-center text-center">
      <div className="glass-card max-w-md w-full space-y-8">
        {!isStreaming && !previewUrl && (
          <div className="mode-toggle-container">
            <button 
              onClick={() => setMode('photo')}
              className={`mode-toggle-btn ${mode === 'photo' ? 'active' : ''}`}
            >
              <ImageIcon size={18} /> PHOTO
            </button>
            <button 
              onClick={() => setMode('live')}
              className={`mode-toggle-btn ${mode === 'live' ? 'active' : ''}`}
            >
              <Tv size={18} /> GO LIVE
            </button>
          </div>
        )}

        {mode === 'photo' ? (
          !previewUrl ? (
            <>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                  <Camera size={56} className="text-primary" />
                  <div className="absolute inset-0 border-2 border-primary/30 border-dashed rounded-full animate-spin-slow" />
                </div>
                <h2 className="text-3xl font-black mb-2">Ready, {name.split(' ')[0]}?</h2>
                <p className="text-text-muted">Take a photo to share it instantly.</p>
              </div>

              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={onFileSelect}
              />

              <button 
                disabled={capturing}
                onClick={() => fileInputRef.current?.click()}
                className="btn-premium btn-premium-primary"
              >
                {capturing ? <RefreshCw className="animate-spin" /> : <><Camera size={32} /> Open Camera</>}
              </button>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-8"
            >
              <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
              </div>

              <div className="space-y-4">
                 <button 
                  onClick={submitPhoto}
                  disabled={capturing}
                  className="btn-premium btn-premium-primary"
                >
                  {capturing ? <RefreshCw className="animate-spin" /> : <><Send size={20} /> Publish Moment</>}
                </button>
                <button 
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="btn btn-secondary w-full py-4 rounded-2xl font-bold"
                >
                  <RotateCcw size={18} /> Take Another
                </button>
              </div>
            </motion.div>
          )
        ) : (
          <div className="space-y-8">
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border-2 border-white/10 shadow-2xl relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${isStreaming ? 'opacity-100' : 'opacity-40'}`} 
              />
              <canvas ref={canvasRef} width="640" height="480" className="hidden" />
              
              {isStreaming && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-[10px] font-bold text-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" /> LIVE
                </div>
              )}
              {isStreaming && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white">
                  {formatDuration(streamDuration)}
                </div>
              )}
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <Tv size={48} className="text-white/20" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              {!isStreaming ? (
                <button 
                  onClick={startLive}
                  className="btn-premium btn-premium-primary"
                >
                  <Tv size={32} /> Start Livestream
                </button>
              ) : (
                <button 
                  onClick={stopLive}
                  className="btn-premium btn-premium-danger"
                >
                  <X size={32} /> Stop Streaming
                </button>
              )}
              <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Broadcasting to guest gallery</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} /> MOMENT SENT FOR REVIEW
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="mesh-bg" />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={
            isLoggedIn ? <AdminDashboard /> : <AdminLogin onLogin={() => setIsLoggedIn(true)} />
          } />
          <Route path="/client" element={<ClientCamera />} />
          <Route path="/gallery" element={<PublicGallery />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

