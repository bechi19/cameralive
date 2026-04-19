import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, LayoutDashboard, Tv, Image as ImageIcon, 
  Monitor, Smartphone, CheckCircle, RefreshCw, 
  X, Check, User, ExternalLink, ArrowRight, Zap,
  Globe, Shield, QrCode, Sparkles, Lock, LogIn,
  Send, RotateCcw, ChevronRight, Activity, TrendingUp
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
          <Camera size={18} className="text-white" />
        </div>
        <span className="text-lg sm:text-xl font-black tracking-tighter text-white">
          LIVE<span className="text-primary xs-hidden">SCAN</span>
        </span>
      </Link>
      <div className="nav-links">
        <Link to="/gallery" className={pathname === '/gallery' ? 'active' : ''}>Gallery</Link>
        <Link to="/admin" className={pathname === '/admin' ? 'active' : ''}>Admin</Link>
      </div>
      <Link to="/client" className="btn btn-primary !py-2 !px-3 sm:!py-2.5 sm:!px-5 rounded-full text-[10px] sm:text-xs shadow-none whitespace-nowrap">
        <span className="hidden xs:inline">Join Live</span>
        <span className="xs:hidden">Join</span>
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
  return (
    <div className="page-container justify-center items-center text-center">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full max-w-4xl"
      >
        <motion.div variants={fadeInUp} className="flex justify-center mb-8 sm:mb-12">
          <div className="status-badge">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE STREAMING ACTIVE
          </div>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="hero-title">
          The Future of <br />
          <span className="text-gradient">Live Moments.</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="hero-subtitle px-4">
          Experience events through the lens of everyone present. Instant, unedited, and authentic community storytelling.
        </motion.p>
        
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 mt-6 sm:mt-8 px-4">
          <Link to="/client" className="btn btn-primary group !py-4 sm:!py-5">
            Start Capturing <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/gallery" className="btn btn-secondary !py-4 sm:!py-5">
            View Live Gallery
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 px-6">
           {[
             { icon: <Zap className="text-amber-400" />, title: "Instant", desc: "Real-time sync" },
             { icon: <Shield className="text-emerald-400" />, title: "Moderated", desc: "Safe community" },
             { icon: <Globe className="text-blue-400" />, title: "Global", desc: "Share everywhere" }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-3">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 shadow-xl">
                 {item.icon}
               </div>
               <div>
                 <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                 <p className="text-sm text-text-muted">{item.desc}</p>
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
        <h2 className="text-3xl font-black text-center mb-2">Admin Panel</h2>
        <p className="text-text-muted text-center mb-8">Enter your credentials to manage live content.</p>
        
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
          <button type="submit" className="btn btn-primary w-full py-4 mt-4">
            Authorize <ChevronRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const clientUrl = `${window.location.origin}/client`;

  useEffect(() => {
    fetch(`/photos`).then(r => r.json()).then(setPhotos).catch(e => console.error("Fetch failed", e));
    socket.on('new-photo', (ph) => setPhotos(v => [ph, ...v]));
    socket.on('photo-approved', (u) => setPhotos(v => v.map(p => p.id === u.id ? u : p)));
    socket.on('photo-removed', (id) => setPhotos(v => v.filter(p => p.id !== id)));
    return () => { socket.off('new-photo'); socket.off('photo-approved'); socket.off('photo-removed'); };
  }, []);

  return (
    <div className="page-container">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 sm:mb-16">
        <div className="w-full">
          <h2 className="text-3xl sm:text-5xl font-black mb-3 sm:mb-4">Command <span className="text-gradient">Center</span></h2>
          <div className="flex flex-wrap items-center gap-3">
             <div className="status-badge bg-primary/10 border-primary/20 text-primary !py-1 !px-3">
               <Activity size={12} /> <span className="text-[10px] sm:text-xs">LIVE MODERATION</span>
             </div>
             <p className="text-xs sm:text-base text-text-muted">Monitoring {photos.length} total captures.</p>
          </div>
        </div>
        
        <div className="glass-card !p-4 flex items-center gap-4 bg-white/5 border-white/10 group">
           <div className="text-right">
             <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Client Portal</p>
             <p className="text-xs font-mono text-white/60">{clientUrl}</p>
           </div>
           <div className="p-1.5 bg-white rounded-xl transition-transform group-hover:scale-105">
             <QRCodeSVG value={clientUrl} size={64} fgColor="#020617" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16 w-full">
          {[
            { label: "Pending Approval", val: photos.filter(p => p.status === 'pending').length, icon: <RefreshCw className="animate-spin-slow" />, color: "text-amber-400", bg: "bg-amber-400/10" },
            { label: "Total Published", val: photos.filter(p => p.status === 'approved').length, icon: <CheckCircle />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Active Photographers", val: new Set(photos.map(p => p.userName)).size, icon: <User />, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Session Health", val: "100%", icon: <TrendingUp />, color: "text-primary", bg: "bg-primary/10" }
          ].map((stat, i) => (
            <div key={i} className="glass-card stat-card">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase mb-2">{stat.label}</p>
                <p className={`stat-value ${stat.color}`}>{stat.val}</p>
              </div>
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>{stat.icon}</div>
            </div>
          ))}
      </div>

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
                      <button onClick={() => fetch(`/photo/${p.id}`, { method: 'DELETE' })} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                        <X size={20}/>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-black text-2xl mb-1">{p.userName}</p>
                        <p className="text-xs text-text-muted">{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Captured Live</p>
                      </div>
                      {p.status === 'pending' && (
                        <button onClick={() => fetch(`/approve/${p.id}`, { method: 'POST' })} className="btn btn-primary w-full py-3 text-sm">Approve Moment</button>
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

  useEffect(() => {
    fetch(`/photos/approved`).then(r => r.json()).then(setPhotos).catch(e => console.error("Fetch failed", e));
    socket.on('photo-approved', (p) => setPhotos(v => [p, ...v]));
    socket.on('photo-removed', (id) => setPhotos(v => v.filter(p => p.id !== id)));
    return () => { socket.off('photo-approved'); socket.off('photo-removed'); };
  }, []);

  return (
    <div className="page-container">
      <header className="text-center mb-12 sm:mb-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 border border-primary/20 rounded-full text-primary text-[10px] sm:text-xs font-bold mb-4 sm:mb-6"
        >
          <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" /> LIVE COMMUNITY WALL
        </motion.div>
        <h1 className="hero-title">Live <span className="text-gradient">Gallery.</span></h1>
        <p className="hero-subtitle px-4">Authentic moments from our community, updated in real-time as they happen.</p>
      </header>

      {photos.length === 0 ? (
        <div className="glass-card text-center py-32 border-dashed opacity-40">
          <ImageIcon size={64} className="mx-auto mb-6 text-text-muted" />
          <p className="text-2xl font-bold mb-2">The wall is waiting.</p>
          <p className="text-text-muted">Start capturing to see your moments here.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          <AnimatePresence>
            {photos.map((p) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="photo-card"
              >
                <img src={p.url} alt={`By ${p.userName}`} />
                <div className="photo-overlay">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-primary/30">
                       {p.userName.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <p className="font-black text-xl leading-none mb-1">{p.userName}</p>
                       <p className="text-[10px] text-primary font-black tracking-[0.2em] uppercase">Verified Capture</p>
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await fetch(`/upload`, { method: 'POST', body: fd });
      setSuccess(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Upload failed. Please check your connection.");
    }
    setCapturing(false);
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
      <div className="glass-card max-w-md w-full space-y-10">
        {!previewUrl ? (
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
              className="btn btn-primary w-full py-6 text-2xl shadow-2xl shadow-primary/40 group"
            >
              {capturing ? <RefreshCw className="animate-spin" /> : <><Camera size={32} /> Open Camera</>}
            </button>
            
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Safe & Moderated Environment</p>
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
                className="btn btn-primary w-full py-5 text-xl"
              >
                {capturing ? <RefreshCw className="animate-spin" /> : <><Send size={20} /> Publish Moment</>}
              </button>
              <button 
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="btn btn-secondary w-full py-4"
              >
                <RotateCcw size={18} /> Take Another
              </button>
            </div>
          </motion.div>
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

