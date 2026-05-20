const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session handling
app.use(session({
    secret: 'portfolio-admin-secret-key-12345',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using https
        httpOnly: true,
        // maxAge is set dynamically during login based on "Remember Me"
    }
}));

// Protect sensitive files from direct static serving
app.use((req, res, next) => {
    const sensitiveFiles = ['/server.js', '/package.json', '/data.json', '/package-lock.json'];
    if (sensitiveFiles.includes(req.path)) {
        return res.status(403).send('Forbidden');
    }
    next();
});

// ================= INTERNAL ROUTING =================
// Serve admin routes using specific paths instead of direct HTML files

// Check Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin root redirects to dashboard
app.get('/admin', (req, res) => {
    res.redirect('/admin/dashboard');
});

// Admin Login Page
app.get('/admin/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// Admin Dashboard Page (Protected)
app.get('/admin/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Serve static files for frontend (excluding admin directory directly if we want)
app.use(express.static(__dirname, {
    index: ['index.html']
}));

// ================= API ENDPOINTS =================

// Login API
app.post('/api/login', (req, res) => {
    const { username, password, rememberMe } = req.body;
    
    // Credentials requested by user
    if (username === 'birsenaykantar' && password === 'Bk2026!Secure') {
        req.session.isAdmin = true;
        
        // "Beni Hatırla" logic
        if (rememberMe) {
            // Keep logged in for 30 days
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else {
            // Session expires when browser closes (Session cookie)
            req.session.cookie.expires = false;
        }

        res.json({ success: true, message: 'Giriş başarılı' });
    } else {
        res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı' });
    }
});

// Logout API
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Çıkış yapıldı' });
});

// Check Auth Status API
app.get('/api/check-auth', (req, res) => {
    if (req.session && req.session.isAdmin) {
        res.json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

// Get Data API
app.get('/api/data', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.json({});
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Veri okunamadı' });
    }
});

// Update Data API (Protected)
app.post('/api/data', (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }

    try {
        const updatedData = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
        res.json({ success: true, message: 'İçerik başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ error: 'Veri kaydedilemedi' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
