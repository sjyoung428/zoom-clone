const frontSocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  frontSocket.emit("enter_room", { payload: input.value }, (event) =>
    console.log("hi i'm frontend:) ", event)
  );
};

form.addEventListener("submit", handleRoomSubmit);
