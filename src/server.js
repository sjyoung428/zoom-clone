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

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}; // 방 찾기

wsServer.on("connection", (backSocket) => {
  wsServer.sockets.emit("room-change", publicRooms());
  backSocket["nickname"] = "Anonymous";
  backSocket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  backSocket.on("enter_room", (roomName, done) => {
    backSocket.join(roomName);
    done();
    backSocket.to(roomName).emit("welcome", backSocket.nickname);
    wsServer.sockets.emit("room-change", publicRooms()); //전체 소켓에 알림
  });
  backSocket.on("disconnecting", () => {
    backSocket.rooms.forEach((room) =>
      backSocket.to(room).emit("bye", backSocket.nickname)
    );
  });
  backSocket.on("disconnect", () => {
    wsServer.sockets.emit("room-change", publicRooms());
  });
  backSocket.on("new_message", (msg, room, done) => {
    backSocket.to(room).emit("new_message", `${backSocket.nickname}: ${msg}`);
    done();
  });
  backSocket.on("nickname", (name) => (backSocket["nickname"] = name));
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
