const frontSocket = new WebSocket(`ws://${window.location.host}`);

frontSocket.addEventListener("open", () => {
  console.log("Connected to Server");
});
frontSocket.addEventListener("message", (message) => {
  console.log(`New Message: "${message.data}" from the Server`);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected from the Server");
});

setTimeout(() => {
  frontSocket.send("Hi I'm browser");
}, 10000);
