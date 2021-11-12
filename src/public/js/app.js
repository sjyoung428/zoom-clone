const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#msg");
const nickForm = document.querySelector("#nick");
const frontSocket = new WebSocket(`ws://${window.location.host}`);

frontSocket.addEventListener("open", () => {
  console.log("Connected to Server");
});
frontSocket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected from the Server");
});

const makeText = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

const handleMsgSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  frontSocket.send(makeText("message", input.value));
  input.value = "";
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  frontSocket.send(makeText("nickname", input.value));
};

messageForm.addEventListener("submit", handleMsgSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
