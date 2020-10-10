// ローカル環境で起動した wisdom-http-api にリクエストをリダイレクトさせるためのカスタムサーバー
// `npm run dev` でしか参照されず、本番環境には影響しない。
// @see https://nextjs.org/docs/advanced-features/custom-server
// @see https://qiita.com/onigiri_/items/d0c96662e1caeaf8db5f

if (process.env.NODE_ENV === "production")
  throw new Error("server.js は production 環境では使用できません");

const fetch = require("node-fetch");
const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const chalk = require("chalk");

const port = parseInt(process.env.PORT, 10) || 3000;
const proxyTarget = process.env.PROXY_TARGET || "http://localhost:3001";
const proxyDebugUserName = process.env.PROXY_DEBUG_USER_NAME;
const proxyDebugUserEmail = process.env.PROXY_DEBUG_USER_EMAIL;

fetch(proxyTarget, { method: "HEAD" }).catch(() => {
  console.warn(
    chalk.bold.yellow.inverse(" WARN "),
    chalk.yellow(
      "/api 以下を利用するには wisdom-http-api を起動し、環境変数 PROXY_TARGET にそのアドレスを指定する必要があります"
    )
  );
});
if (!(proxyDebugUserName && proxyDebugUserEmail))
  console.warn(
    chalk.bold.yellow.inverse(" WARN "),
    chalk.yellow(
      "/api 以下を利用するには環境変数 PROXY_DEBUG_USER_NAME と PROXY_DEBUG_USER_EMAIL にデバッグ用ユーザー情報を指定する必要があります"
    )
  );

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    "/api/",
    createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
      pathRewrite: {
        "^/api/[^/]+": "",
      },
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader("wisdom-user-name", encodeURI(proxyDebugUserName));
        proxyReq.setHeader("wisdom-user-email", encodeURI(proxyDebugUserEmail));
      },
      logLevel: "warn",
    })
  );

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
