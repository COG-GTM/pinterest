'use strict';
// Local stand-in for the retired pinwork-api.herokuapp.com Phoenix backend.
// Serves the same JSON shapes the app expects, seeded deterministically.
const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const COLORS = ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8', '#4db6ac', '#f06292', '#a1887f'];
const TAGS = ['angular', 'design', 'travel', 'food', 'code', 'photography'];

let db;

function seed() {
  const users = [
    { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com', provider: 'google.com', avatar: '/api/img/avatar/u1.svg', uid: 'uid-ada' },
    { id: 'u2', name: 'Grace Hopper', email: 'grace@example.com', provider: 'google.com', avatar: '/api/img/avatar/u2.svg', uid: 'uid-grace' },
    { id: 'u3', name: 'Alan Turing', email: 'alan@example.com', provider: 'google.com', avatar: '/api/img/avatar/u3.svg', uid: 'uid-alan' }
  ];
  const pins = [];
  for (let i = 1; i <= 30; i++) {
    const tagA = TAGS[i % TAGS.length];
    const tagB = TAGS[(i * 2) % TAGS.length];
    pins.push({
      id: 'p' + i,
      name: 'Seed pin ' + i,
      description: 'Description for seed pin ' + i + ' about ' + tagA,
      image_url: '/api/img/pin/' + i + '.svg',
      url: 'https://example.com/blog/' + i,
      tags: tagA === tagB ? tagA : tagA + ',' + tagB,
      user_id: users[i % users.length].id
    });
  }
  const comments = [
    { id: 'c1', pin_id: 'p1', user_id: 'u2', message: 'Lovely pin!', inserted_at: '2017-03-20T10:00:00' },
    { id: 'c2', pin_id: 'p1', user_id: 'u3', message: 'Bookmarked for later.', inserted_at: '2017-03-21T12:30:00' }
  ];
  db = { users, pins, comments, seq: 1000 };
}
seed();

const userById = id => db.users.find(u => u.id === id);
const withUser = o => Object.assign({}, o, { user: userById(o.user_id) });
const pinView = p => Object.assign(withUser(p), { comments: db.comments.filter(c => c.pin_id === p.id).map(withUser) });
const nextId = prefix => prefix + (++db.seq);

function svg(res, w, h, color, label) {
  res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' });
  res.end('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
    '<rect width="100%" height="100%" fill="' + color + '"/>' +
    '<text x="50%" y="50%" font-family="sans-serif" font-size="' + Math.round(w / 8) + '" fill="#fff" text-anchor="middle" dominant-baseline="middle">' + String(label).replace(/[^\w ?-]/g, '') + '</text></svg>');
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, X-Auth-Token, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  // Image paths are stored relative but served absolute: the app's pin form only accepts http(s) image URLs.
  const json = body === undefined ? '' : JSON.stringify(body).replace(/"\/api\/img\//g, '"http://' + (res.apiHost || 'localhost:' + PORT) + '/api/img/');
  res.end(json);
}

function readBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { resolve({}); }
    });
  });
}

const tokens = {};

async function handle(req, res) {
  res.apiHost = req.headers['x-forwarded-host'] || req.headers.host;
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname.replace(/^\/api/, '').replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  const method = req.method;

  if (method === 'OPTIONS') return send(res, 204);

  if (parts[0] === 'img' && parts[1] === 'pin') {
    const n = parseInt(parts[2], 10) || 1;
    // angular2-masonry appends bricks in image-load order; staggering responses (newest first)
    // keeps the grid order deterministic so screenshots are comparable run to run.
    const delay = Math.max(0, 40 - n) * 25;
    return setTimeout(() => svg(res, 300, 200 + (n * 37) % 220, COLORS[n % COLORS.length], 'Pin ' + n), delay);
  }
  if (parts[0] === 'img' && parts[1] === 'avatar') {
    const id = (parts[2] || '').replace('.svg', '');
    const u = userById(id);
    return svg(res, 64, 64, COLORS[(id.charCodeAt(1) || 0) % COLORS.length], u ? u.name[0] : '?');
  }

  if (path === '/__reset' && method === 'POST') { seed(); return send(res, 200, { ok: true }); }

  if (parts[0] === 'users') {
    if (parts[1] === 'auth' && method === 'POST') {
      const body = await readBody(req);
      const info = (body && body.user) || {};
      let user = db.users.find(u => u.uid === info.uid || (info.email && u.email === info.email));
      if (!user) {
        user = { id: nextId('u'), name: info.name, email: info.email, provider: info.provider, avatar: info.avatar, uid: info.uid };
        db.users.push(user);
      }
      const token = crypto.randomBytes(12).toString('hex');
      tokens[token] = user.id;
      return send(res, 200, { token, user });
    }
    if (parts.length === 1 && method === 'GET') return send(res, 200, { data: db.users });
    if (parts.length === 2 && method === 'GET') {
      const u = userById(parts[1]);
      return u ? send(res, 200, { data: u }) : send(res, 404, { error: 'not found' });
    }
  }

  if (parts[0] === 'pins') {
    if (parts.length === 1 && method === 'GET') {
      const limit = parseInt(parsed.query.limit, 10) || 20;
      const offset = parseInt(parsed.query.offset, 10) || 0;
      const tags = (parsed.query.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      let list = db.pins.slice().reverse();
      if (tags.length) {
        list = list.filter(p => (p.tags || '').toLowerCase().split(',').some(t => tags.indexOf(t.trim()) > -1));
      }
      return send(res, 200, { data: list.slice(offset, offset + limit).map(withUser) });
    }
    if (parts.length === 1 && method === 'POST') {
      const body = (await readBody(req)).pin || {};
      const pin = {
        id: nextId('p'), name: body.name, description: body.description, image_url: body.image_url,
        url: body.url, tags: body.tags || '', user_id: body.user_id || tokens[req.headers['x-auth-token']]
      };
      db.pins.push(pin);
      return send(res, 201, { data: pinView(pin) });
    }
    const pin = db.pins.find(p => p.id === parts[1]);
    if (!pin) return send(res, 404, { error: 'not found' });
    if (method === 'GET') return send(res, 200, { data: pinView(pin) });
    if (method === 'PUT') {
      const body = (await readBody(req)).pin || {};
      ['name', 'description', 'image_url', 'url', 'tags'].forEach(k => { if (body[k] !== undefined && body[k] !== null) pin[k] = body[k]; });
      return send(res, 200, { data: pinView(pin) });
    }
    if (method === 'DELETE') {
      db.pins = db.pins.filter(p => p !== pin);
      db.comments = db.comments.filter(c => c.pin_id !== pin.id);
      return send(res, 204);
    }
  }

  if (parts[0] === 'comments') {
    if (parts.length === 1 && method === 'POST') {
      const body = (await readBody(req)).comment || {};
      const comment = {
        id: nextId('c'), pin_id: body.pin_id, user_id: body.user_id || tokens[req.headers['x-auth-token']],
        message: body.message, inserted_at: new Date().toISOString().slice(0, 19)
      };
      db.comments.push(comment);
      return send(res, 201, { data: withUser(comment) });
    }
    if (parts.length === 2 && method === 'DELETE') {
      db.comments = db.comments.filter(c => c.id !== parts[1]);
      return send(res, 204);
    }
  }

  return send(res, 404, { error: 'not found' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(err => { console.error(err); send(res, 500, { error: String(err) }); });
});

// Minimal Phoenix channel endpoint so the app's socket can join "comments:lobby".
try {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server, path: '/socket/websocket' });
  wss.on('connection', ws => {
    ws.on('message', raw => {
      let msg;
      try { msg = JSON.parse(raw); } catch (e) { return; }
      if (!msg || typeof msg !== 'object') return;
      if (msg.event === 'phx_join' || msg.event === 'heartbeat') {
        ws.send(JSON.stringify({ topic: msg.topic, event: 'phx_reply', payload: { status: 'ok', response: {} }, ref: msg.ref }));
      }
    });
  });
} catch (e) {
  console.warn('ws module not installed; socket endpoint disabled');
}

server.listen(PORT, '127.0.0.1', () => console.log('mock pinwork api on http://localhost:' + PORT));
