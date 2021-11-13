import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const PORT = 8000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (backSocket) => {
  backSocket.on("enter_room", (roomName, hi) => {
    console.log(roomName);
    setTimeout(() => {
      hi("hi i'm backend:)");
    }, 3000);
  });
});

// import { WebSocketServer } from "ws";
// const wss = new WebSocketServer({ server });
// const sockets = [];
// wss.on("connection", (backSocket) => {
//   sockets.push(backSocket);
//   backSocket["nickname"] = "익명";
//   console.log("Connected to Browser");
//   backSocket.on("close", () => {
//     console.log("Disconnected from the browser");
//   });
//   backSocket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "message":
//         sockets.forEach((element) => {
//           element.send(`${backSocket["nickname"]}: ${message.payload}`);
//         });
//         break;
//       case "nickname":
//         backSocket["nickname"] = message.payload;
//         break;
//     }
//   });
// });

httpServer.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}`)
);
