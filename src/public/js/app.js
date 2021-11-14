const frontSocket = io();

const welcome = document.getElementById("welcome");
const nameForm = document.querySelector("#name");
const roomNameForm = welcome.querySelector("#room__name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  frontSocket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
};

const handleNameForm = (event) => {
  event.preventDefault();
  const input = document.querySelector("#name input");
  frontSocket.emit("nickname", input.value);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  roomName = input.value;
  frontSocket.emit("enter_room", input.value, showRoom);
  input.value = "";
};

nameForm.addEventListener("submit", handleNameForm);
roomNameForm.addEventListener("submit", handleRoomSubmit);

frontSocket.on("welcome", (user) => {
  addMessage(`${user} Joined! :)`);
});
frontSocket.on("bye", (user) => {
  addMessage(`${user} Left :(`);
});

frontSocket.on("new_message", (msg) => {
  addMessage(msg);
});
frontSocket.on("room-change", (rooms) => {
  const roomList = document.querySelector("#roomList");
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
