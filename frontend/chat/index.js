import { io } from "socket.io-client"; 

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

const roomId = document.querySelector("#room-id").value;

chatSocket.on(`chat:message:${roomId}`, ({ from, timestamp, message, hash}) => {
  console.log({event: 'chat:message', timestamp, message});

  const div = document.querySelector("#message-template").content.cloneNode(true);

  const img = div.querySelector("img");
  img.className = "message-avatar";
  img.src = `https://gravatar.com/avatar/${hash}?s=50`;
  img.alt = `Avatar of ${from}`;

  const p = div.querySelector("p");
  p.innerText = message;

  chatWindow.appendChild(div);
})

document.querySelector("#message").addEventListener("keydown", event => {
  if(event.keyCode === 13){
    const message = event.target.value;

    console.log({ message });

    fetch(`${document.location.pathname}/chat`, { 
      method: "post", 
      headers: { "Content-Type": "application/json"}, 
      body: JSON.stringify({ message })
    })

    event.target.value = "";
  }
});