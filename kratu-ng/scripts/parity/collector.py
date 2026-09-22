import http.server, json, os
D='/tmp/kratu-parity/data'; os.makedirs(D, exist_ok=True)
class H(http.server.BaseHTTPRequestHandler):
    def _cors(self): self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Access-Control-Allow-Headers','content-type'); self.send_header('Access-Control-Allow-Methods','POST, OPTIONS')
    def do_OPTIONS(self): self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        n=int(self.headers.get('content-length',0)); body=json.loads(self.rfile.read(n)); name=body.get('name','x').replace('/','_')
        json.dump(body, open(os.path.join(D,name+'.json'),'w'), ensure_ascii=False)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok')
    def log_message(self,*a): pass
http.server.HTTPServer(('127.0.0.1',4299),H).serve_forever()
