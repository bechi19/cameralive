import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, LayoutDashboard, Tv, Image as ImageIcon, 
  Monitor, Smartphone, CheckCircle, RefreshCw, 
  X, Check, User, ExternalLink, ArrowRight, Zap,
  Globe, Shield, QrCode, Sparkles, Lock, LogIn,
  Send, RotateCcw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import io from 'socket.io-client';

const SERVER_URL = (import.meta.env.VITE_SERVER_URL || `http://${window.location.hostname}:5000`).toString().trim();
const socket = io(SERVER_URL);

// --- Navigation ---
const Navbar = () => {
  const { pathname } = useLocation();
  if (pathname === '/client') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Camera size={18} className="text-white" />
        </div>
        <span className="hidden sm:inline">CL.</span>
      </Link>
      <div className="nav-links">
        <Link to="/gallery">Gallery</Link>
        <Link to="/admin">Admin</Link>
      </div>
      <Link to="/client" className="btn btn-primary !py-2 !px-4 rounded-full text-[10px] sm:text-xs">
        <Camera size={14} /> Open Camera
      </Link>
    </nav>
  );
};

// --- Pages ---

const Home = () => {
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full"
      >
        <div className="status-badge mb-6 text-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          GLOBAL SESSION ACTIVE
        </div>
        <h1 className="hero-title">
          LIVE <span className="text-gradient">SYNERGY.</span>
        </h1>
        <p className="hero-subtitle">
          Capture moments natively from your smartphone and see them live in the community gallery instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-sm sm:max-w-none">
          <Link to="/client" className="btn btn-primary px-10 py-5 text-lg">
            Join as Photographer <Camera size={20} />
          </Link>
          <Link to="/gallery" className="btn btn-secondary px-10 py-5 text-lg">
            Explore Gallery
          </Link>
        </div>
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
    <div className="page-container h-screen flex items-center justify-center p-6 !pt-0">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card max-w-sm text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Lock size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-black mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            className="input-field text-left" 
            placeholder="Username" 
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password"
            className="input-field text-left" 
            placeholder="Password" 
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
          <button type="submit" className="btn btn-primary w-full py-4 text-sm mt-4">
            Sign In <LogIn size={18} />
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
    fetch(`${SERVER_URL}/photos`).then(r => r.json()).then(setPhotos).catch(e => console.error("Fetch failed", e));
    socket.on('new-photo', (ph) => setPhotos(v => [ph, ...v]));
    socket.on('photo-approved', (u) => setPhotos(v => v.map(p => p.id === u.id ? u : p)));
    socket.on('photo-removed', (id) => setPhotos(v => v.filter(p => p.id !== id)));
    return () => { socket.off('new-photo'); socket.off('photo-approved'); socket.off('photo-removed'); };
  }, []);

  return (
    <div className="page-container">
      <div className="w-full mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-4xl font-black mb-2">Control <span className="text-primary">Hub</span></h2>
          <p className="text-text-secondary">Moderate community captures live.</p>
        </div>
        <div className="glass-card p-4 !w-auto flex items-center gap-6 border-primary/20 bg-primary/5">
           <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase">Remote Access</p>
             <p className="text-xs font-mono">{clientUrl}</p>
           </div>
           <div className="p-2 bg-white rounded-xl">
             <QRCodeSVG value={clientUrl} size={64} fgColor="#020617" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full">
          <div className="glass-card p-8 flex justify-between items-center">
            <div>
              <p className="text-sm text-text-secondary mb-1">Queue Size</p>
              <p className="text-5xl font-black">{photos.filter(p => p.status === 'pending').length}</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500"><RefreshCw className="animate-spin-slow" /></div>
          </div>
          <div className="glass-card p-8 flex justify-between items-center">
            <div>
              <p className="text-sm text-text-secondary mb-1">Published</p>
              <p className="text-5xl font-black text-primary">{photos.filter(p => p.status === 'approved').length}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-2xl text-primary"><CheckCircle /></div>
          </div>
      </div>

      <div className="w-full">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><ImageIcon /> Media Queue</h3>
        {photos.length === 0 ? (
          <div className="glass-card text-center p-20 border-dashed opacity-50">
            <p className="font-bold">No photos submitted yet.</p>
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
                  className={`glass-card !p-0 overflow-hidden relative aspect-square group ${p.status === 'approved' ? 'border-primary' : ''}`}
                >
                  <img src={p.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${p.status === 'approved' ? 'bg-primary text-white' : 'bg-amber-500 text-black'}`}>
                        {p.status}
                      </span>
                      <button onClick={() => fetch(`${SERVER_URL}/photo/${p.id}`, { method: 'DELETE' })} className="text-slate-400 hover:text-red-400 transition-colors"><X size={24}/></button>
                    </div>
                    <div>
                      <p className="font-black text-xl">{p.userName}</p>
                      <p className="text-[10px] text-text-secondary mb-4">{new Date(p.timestamp).toLocaleTimeString()}</p>
                      {p.status === 'pending' && (
                        <button onClick={() => fetch(`${SERVER_URL}/approve/${p.id}`, { method: 'POST' })} className="btn btn-primary w-full justify-center py-2 text-sm">Approve</button>
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
    fetch(`${SERVER_URL}/photos/approved`).then(r => r.json()).then(setPhotos).catch(e => console.error("Fetch failed", e));
    socket.on('photo-approved', (p) => setPhotos(v => [p, ...v]));
    socket.on('photo-removed', (id) => setPhotos(v => v.filter(p => p.id !== id)));
    return () => { socket.off('photo-approved'); socket.off('photo-removed'); };
  }, []);

  return (
    <div className="page-container">
      <header className="text-center mb-16">
        <h1 className="hero-title">LIVE <span className="text-gradient">SYNERGY.</span></h1>
        <p className="hero-subtitle mx-auto">Authentic moments captured live by our community.</p>
      </header>

      {photos.length === 0 ? (
        <div className="glass-card text-center p-20 border-dashed opacity-50">
          <ImageIcon size={48} className="mx-auto mb-4" />
          <p className="font-bold">The wall is empty. Waiting for live captures...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {photos.map((p) => (
            <div key={p.id} className="photo-card glass-card !p-0">
              <img src={p.url} />
              <div className="photo-overlay">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/20 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center font-black">
                     {p.userName.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <p className="font-black text-lg leading-tight">{p.userName}</p>
                     <p className="text-[10px] text-primary font-black tracking-widest uppercase">Verified Capture</p>
                   </div>
                </div>
              </div>
            </div>
          ))}
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

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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

  if (!joined) {
    return (
      <div className="page-container h-screen flex items-center justify-center p-6 !pt-0">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-sm text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-primary to-accent" />
          <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <User size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-black mb-2">Identify</h2>
          <p className="text-text-secondary text-sm mb-10">Enter your name to start sharing live moments.</p>
          
          <div className="space-y-6">
            <input 
              className="input-field"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button disabled={!name} onClick={join} className="btn btn-primary w-full py-5 text-lg shadow-2xl">
              Start Capturing <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container h-screen flex flex-col items-center justify-center text-center p-6 !pt-0">
      <div className="glass-card max-w-sm flex flex-col items-center gap-6 py-8">
        {!previewUrl ? (
          <>
            <div className="relative">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <Camera size={48} className="text-primary" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-2">Ready, {name.split(' ')[0]}?</h2>
              <p className="text-text-secondary text-sm">Open your camera to capture a moment.</p>
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
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary w-full py-6 text-xl shadow-[0_20px_40px_rgba(99,102,241,0.4)]"
            >
              <Camera size={28} /> Open Camera
            </button>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="aspect-square w-full rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img src={previewUrl} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
               <button 
                onClick={submitPhoto}
                disabled={capturing}
                className="btn btn-primary w-full py-5 text-lg"
              >
                {capturing ? <RefreshCw className="animate-spin" /> : <><Send size={20} /> Submit to Admin</>}
              </button>
              <button 
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="btn btn-secondary w-full py-3 text-sm"
              >
                <RotateCcw size={16} /> Retake Photo
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
              className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-2 rounded-full font-black text-[10px] tracking-widest uppercase"
            >
              Capture Sent Successfully
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={
          isLoggedIn ? <AdminDashboard /> : <AdminLogin onLogin={() => setIsLoggedIn(true)} />
        } />
        <Route path="/client" element={<ClientCamera />} />
        <Route path="/gallery" element={<PublicGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
