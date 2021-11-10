import http from "http";
import express from "express";
import WebSocket, { WebSocketServer } from "ws";

const app = express();

const PORT = 8000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("home"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

server.listen(PORT, () => console.log(`Listening on http://localhost${PORT}`));
