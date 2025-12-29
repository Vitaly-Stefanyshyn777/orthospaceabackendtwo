const http = require('http');

const server = http.createServer((req, res) => {
  console.log(new Date().toISOString(), req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/v1/auth/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const loginData = JSON.parse(body);
        if (loginData.email === 'admin@example.com' && loginData.password === 'R3k0gr1n1k@Admin#2024') {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token',
            user: { id: 1, email: 'admin@example.com', role: 'admin' }
          }));
        } else {
          res.writeHead(401, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (e) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/v1/public/gallery/albums/general') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      photos: [{
        id: 1,
        albumId: 1,
        url: 'https://picsum.photos/800/600?random=1',
        title: 'Test Photo',
        description: 'Test description',
        tag: 'general',
        fileName: 'test.jpg',
        fileSize: 1000,
        mimeType: 'image/jpeg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }));
    return;
  }

  if (req.method === 'DELETE' && req.url.startsWith('/api/v1/gallery/photos/')) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.writeHead(401, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ message: 'Photo deleted successfully' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/v1/upload/photo') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.writeHead(401, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      id: Date.now(),
      url: 'https://picsum.photos/800/600?random=' + Date.now(),
      title: 'Uploaded Photo',
      description: '',
      tag: 'general',
      fileName: 'uploaded.jpg',
      fileSize: 1500,
      mimeType: 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3002, '0.0.0.0', () => {
  console.log('✅ Backend server started on port 3002');
  console.log('Available endpoints:');
  console.log('  POST /api/v1/auth/login');
  console.log('  GET  /api/v1/public/gallery/albums/general');
  console.log('  DELETE /api/v1/gallery/photos/:id');
  console.log('  POST /api/v1/upload/photo');
});



