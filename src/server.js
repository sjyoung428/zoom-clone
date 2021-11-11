import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const PORT = 8000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

app.get("/*", (req, res) => res.redirect("home"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (backSocket) => {
  sockets.push(backSocket);
  console.log("Connected to Browser");
  backSocket.on("close", () => {
    console.log("Disconnected from the browser");
  });
  backSocket.on("message", (message) => {
    sockets.forEach((element) => {
      element.send(message.toString("utf-8"));
    });
  });
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
