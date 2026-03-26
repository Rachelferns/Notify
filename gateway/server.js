const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());
app.use(express.json());

const noticeServiceUrl =
  process.env.NOTICE_SERVICE_URL || "http://notice-service:5001";
const authServiceUrl =
  process.env.AUTH_SERVICE_URL || "http://auth-service:5002";
const port = Number(process.env.PORT) || 5003;

app.use((req, res, next) => {
  console.log("Gateway received:", req.method, req.originalUrl);
  next();
});

app.use(
  "/notices",
  createProxyMiddleware({
    target: "http://notice-service:5001",
    changeOrigin: true,

    pathRewrite: (path, req) => {
  console.log("ORIGINAL PATH:", path);

  if (req.method === "DELETE" || req.method === "PUT") {
    return "/notices" + path; // 🔥 keeps ID
  }

  return "/notices"; // keep your working GET/POST behavior
},

    on: {
      proxyReq: (proxyReq, req) => {
        console.log("FORWARDING FINAL PATH:", proxyReq.path);

        const role = req.get("role") || req.get("x-user-role");
        if (role) {
          proxyReq.setHeader("role", role);
        }

        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    },
  })
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    proxyTimeout: 5000,
    timeout: 5000,
    on: {
      proxyReq: (proxyReq, req) => {
        const authorization = req.get("authorization");
        if (authorization) proxyReq.setHeader("authorization", authorization);
      },
      error: (err, req, res) => {
        console.error("Auth proxy error:", req.method, req.originalUrl, err.message);
        if (!res.headersSent) {
          res.status(502).json({ error: "Auth service unavailable" });
        }
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send("Gateway working");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Gateway running on ${port}`);
});
