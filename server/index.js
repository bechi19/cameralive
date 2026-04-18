const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// In-memory data store
let photos = [];
let streamers = new Set();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// --- API Endpoints ---

// 1. Upload Photo
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    
    const userName = req.body.userName || 'Anonymous';
    const imageUrl = `http://${req.headers.host}/uploads/${req.file.filename}`;
    
    const newPhoto = {
        id: Date.now().toString(),
        url: imageUrl,
        userName: userName,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    photos.push(newPhoto);
    
    // Notify admin
    io.emit('new-photo', newPhoto);
    
    res.status(200).json(newPhoto);
});

// 2. Approve Photo
app.post('/approve/:id', (req, res) => {
    const photo = photos.find(p => p.id === req.params.id);
    if (!photo) return res.status(404).send('Photo not found');
    
    photo.status = 'approved';
    
    // Notify everyone (especially public gallery)
    io.emit('photo-approved', photo);
    
    res.status(200).json(photo);
});

// 3. Reject/Delete Photo
app.delete('/photo/:id', (req, res) => {
    photos = photos.filter(p => p.id !== req.params.id);
    io.emit('photo-removed', req.params.id);
    res.status(200).send('Removed');
});

// 4. Get all photos (for admin)
app.get('/photos', (req, res) => {
    res.json(photos);
});

// 5. Get approved photos (for public site)
app.get('/photos/approved', (req, res) => {
    res.json(photos.filter(p => p.status === 'approved'));
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// --- Socket.io ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register-streamer', (peerId) => {
        streamers.add(peerId);
        io.emit('streamer-list', Array.from(streamers));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
