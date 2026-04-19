const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Aggressively clean environment variables to remove hidden characters or non-standard quotes
const cleanEnv = (val, fallback) => {
  if (!val) return fallback;
  return val.toString().replace(/[^\x21-\x7E]/g, "").trim() || fallback;
};

const PORT = cleanEnv(process.env.PORT, '5000');
const CLIENT_URL = cleanEnv(process.env.CLIENT_URL, '*');

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
app.use(express.static(path.join(__dirname, '../dist')));

const DB_FILE = path.join(__dirname, 'photos.json');

// Load photos from "database" file
let photos = [];
if (fs.existsSync(DB_FILE)) {
    try {
        photos = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        photos = [];
    }
}

// Save photos to "database" file
const saveToDb = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(photos, null, 2));
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/photos', (req, res) => {
    res.json(photos);
});

app.get('/photos/approved', (req, res) => {
    res.json(photos.filter(p => p.status === 'approved'));
});

app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const photo = {
        id: Date.now().toString(),
        url: `/uploads/${req.file.filename}`,
        userName: req.body.userName,
        timestamp: new Date(),
        status: 'pending'
    };
    photos.push(photo);
    saveToDb();
    io.emit('new-photo', photo);
    res.json(photo);
});

app.post('/approve/:id', (req, res) => {
    const photo = photos.find(p => p.id === req.params.id);
    if (photo) {
        photo.status = 'approved';
        saveToDb();
        io.emit('photo-approved', photo);
        res.json(photo);
    } else {
        res.status(404).send('Photo not found');
    }
});

app.delete('/photo/:id', (req, res) => {
    photos = photos.filter(p => p.id !== req.params.id);
    saveToDb();
    io.emit('photo-removed', req.params.id);
    res.send('Deleted');
});

// Handle React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
