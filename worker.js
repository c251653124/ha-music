import { constructServer } from './server';

let app = null;

export default {
  async fetch(request, env, context) {
    if (!app) {
      app = await constructServer();
    }
    
    return new Promise((resolve, reject) => {
      const { pathname, search } = new URL(request.url);
      const url = pathname + search;
      
      const req = {
        method: request.method,
        url: url,
        headers: Object.fromEntries(request.headers.entries()),
        body: request.method !== 'GET' ? request.body : null,
        query: Object.fromEntries(new URLSearchParams(search)),
        cookies: {},
        ip: request.headers.get('CF-Connecting-IP') || '127.0.0.1',
      };
      
      const res = {
        status: 200,
        headers: {},
        send(body) {
          if (typeof body === 'object') {
            body = JSON.stringify(body);
            this.headers['Content-Type'] = 'application/json; charset=utf-8';
          }
          resolve(new Response(body, {
            status: this.status,
            headers: new Headers(this.headers),
          }));
        },
        status(code) {
          this.status = code;
          return this;
        },
        set(key, value) {
          this.headers[key] = value;
          return this;
        },
        append(key, value) {
          if (Array.isArray(this.headers[key])) {
            this.headers[key].push(value);
          } else if (this.headers[key]) {
            this.headers[key] = [this.headers[key], value];
          } else {
            this.headers[key] = value;
          }
          return this;
        },
        redirect(code, location) {
          this.status = code;
          this.headers['Location'] = location;
          resolve(new Response('', {
            status: this.status,
            headers: new Headers(this.headers),
          }));
        },
      };
      
      app(req, res, (err) => {
        if (err) {
          reject(err);
        }
      });
    });
  },
};
