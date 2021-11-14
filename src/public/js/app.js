const frontSocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  roomName = input.value;
  frontSocket.emit("enter_room", input.value, showRoom);
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

frontSocket.on("welcome", () => {
  addMessage("Someone Joined! :)");
});
frontSocket.on("bye", () => {
  addMessage("Someone Left :(");
});
