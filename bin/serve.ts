import { createServer, request, IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import { Duplex } from "stream";

const ALLOWED_ORIGIN = "https://early.penpot.dev";
const PROXY_TARGET_ADDRESS = "http://localhost:5173";
const LISTEN_PORT = 3000;
const PLUGIN_FILENAME = "plugin.js";

const __dirname = import.meta.dirname;
const proxyTargetUrl = new URL(PROXY_TARGET_ADDRESS);

const server = createServer((req, res) => {
  if (req.url === `/${PLUGIN_FILENAME}`) {
    const filePath = join(__dirname, "../dist", PLUGIN_FILENAME);

    try {
      const data = readFileSync(filePath);

      res.writeHead(200, {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      });
      res.end(data);
    } catch (e) {
      console.error("Failed to read plugin file: ", e);

      res.writeHead(500, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      });
      res.end("Internal Server Error");
    }
  } else {
    proxyHttpRequest(req, res);
  }
});

server.on("upgrade", (req, socket) => {
  proxyWebSocketRequest(req, socket);
});

server.listen(LISTEN_PORT, () => {
  console.log(`Server is running on http://localhost:${LISTEN_PORT}`);
});

const proxyHttpRequest = (req: IncomingMessage, res: ServerResponse) => {
  const options = {
    hostname: proxyTargetUrl.hostname,
    port: proxyTargetUrl.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode!, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (e) => {
    console.error("[HTTP] Proxy request failed: ", e);

    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  });

  req.pipe(proxyReq, { end: true });
};

const proxyWebSocketRequest = (req: IncomingMessage, socket: Duplex) => {
  const options = {
    hostname: proxyTargetUrl.hostname,
    port: proxyTargetUrl.port,
    path: req.url,
    headers: req.headers,
  };

  const proxyReq = request(options);

  proxyReq.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    // Include headers from the proxy response in the client response
    const httpHeaderString = `HTTP/${proxyRes.httpVersion} ${proxyRes.statusCode} ${proxyRes.statusMessage}`;
    const headersString = Object.entries(proxyRes.headers)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
      )
      .join("\r\n");

    socket.write(httpHeaderString + "\r\n" + headersString + "\r\n\r\n");
    proxySocket.write(proxyHead);

    // Create two-way traffic between connections
    proxySocket.pipe(socket).pipe(proxySocket);
  });

  proxyReq.on("error", (e) => {
    console.error("[WebSocket] Proxy request failed: ", e);

    socket.end();
  });

  proxyReq.end();
};
