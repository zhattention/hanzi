const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

// Get local IP address
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    let ipAddress = 'localhost';
    
    // Loop through network interfaces
    Object.keys(interfaces).forEach((interfaceName) => {
        const addresses = interfaces[interfaceName];
        for (const addr of addresses) {
            // Skip internal and non-IPv4 addresses
            if (addr.internal === false && addr.family === 'IPv4') {
                ipAddress = addr.address;
                return;
            }
        }
    });
    
    return ipAddress;
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Handle root path to serve index.html
    let filePath = req.url === '/' 
        ? path.join(__dirname, 'index.html') 
        : path.join(__dirname, req.url);
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
                return;
            }
            
            // Server error
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
            return;
        }
        
        // Success
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    });
});

// Listen on all network interfaces (0.0.0.0)
const HOST = '0.0.0.0';
const localIp = getLocalIpAddress();

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Local network access: http://${localIp}:${PORT}/`);
    console.log(`Press Ctrl+C to stop the server`);
}); 