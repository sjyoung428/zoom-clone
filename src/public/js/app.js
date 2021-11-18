const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let stream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

const getCameras = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((device) => device.kind === "videoinput");
  const currentCamera = stream.getVideoTracks()[0];
  cameras.forEach((camera) => {
    const option = document.createElement("option");
    option.value = camera.deviceId;
    option.innerText = camera.label;
    if (currentCamera.label === camera.label) {
      option.selected = true;
    }
    cameraSelect.appendChild(option);
  });
};

const getMedia = async (deviceId) => {
  const initCamera = {
    audio: true,
    video: { facingMode: "user" },
  };
  const changeCamera = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(
      deviceId ? changeCamera : initCamera
    );
    myFace.srcObject = stream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
};

const handleMuteClick = () => {
  stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (muted) {
    muteBtn.innerText = "Mute";
    muted = false;
  } else {
    muteBtn.innerText = "Unmute";
    muted = true;
  }
};
const handleCameraClick = () => {
  stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));

  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
};
const handleCameraChange = () => {
  getMedia(cameraSelect.value);
};

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

// Choose a Room.

const welcome = document.getElementById("welcome");
const welcomeForm = document.querySelector("form");

const startMedia = async () => {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
};

const handleWelcomeSubmit = (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join-room", input.value, startMedia);
  roomName = input.value;
  input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code..https://codesandbox.io/s/a09blueprint-forked-ifuw3?file=/src/index.js

socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("Sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", (offer) => console.log(offer));

//RTC Code..

const makeConnection = () => {
  myPeerConnection = new RTCPeerConnection();
  stream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, stream));
};

// const welcome = document.getElementById("welcome");
// const nameForm = document.querySelector("#name");
// const roomNameForm = welcome.querySelector("#room__name");
// const room = document.getElementById("room");

// room.hidden = true;

// let roomName;

// const addMessage = (message) => {
//   const ul = room.querySelector("ul");
//   const li = document.createElement("li");
//   li.innerText = message;
//   ul.appendChild(li);
// };

// const handleMessageSubmit = (event) => {
//   event.preventDefault();
//   const input = room.querySelector("#msg input");
//   const value = input.value;
//   frontSocket.emit("new_message", input.value, roomName, () => {
//     addMessage(`You: ${value}`);
//   });
//   input.value = "";
// };

// const handleNameForm = (event) => {
//   event.preventDefault();
//   const input = document.querySelector("#name input");
//   frontSocket.emit("nickname", input.value);
// };

// const showRoom = (newCount) => {
//   welcome.hidden = true;
//   room.hidden = false;
//   const h3 = room.querySelector("h3");
//   h3.innerText = `Room: ${roomName} (${newCount})`;
//   const msgForm = room.querySelector("#msg");
//   msgForm.addEventListener("submit", handleMessageSubmit);
// };

// const handleRoomSubmit = (event) => {
//   event.preventDefault();
//   const input = roomNameForm.querySelector("input");
//   roomName = input.value;
//   frontSocket.emit("enter_room", input.value, showRoom);
//   input.value = "";
// };

// nameForm.addEventListener("submit", handleNameForm);
// roomNameForm.addEventListener("submit", handleRoomSubmit);

// frontSocket.on("welcome", (user, newCount) => {
//   const h3 = room.querySelector("h3");
//   h3.innerText = `Room: ${roomName} (${newCount})`;
//   addMessage(`${user} Joined! :)`);
// });
// frontSocket.on("bye", (user, newCount) => {
//   const h3 = room.querySelector("h3");
//   h3.innerText = `Room: ${roomName} (${newCount})`;
//   addMessage(`${user} Left :(`);
// });

// frontSocket.on("new_message", (msg) => {
//   addMessage(msg);
// });
// frontSocket.on("room-change", (rooms) => {
//   const roomList = document.querySelector("#roomList");
//   if (rooms.length === 0) {
//     roomList.innerHTML = "";
//     return;
//   }
//   rooms.forEach((room) => {
//     const li = document.createElement("li");
//     li.innerText = room;
//     roomList.append(li);
//   });
// });
