import { io } from 'socket.io-client';

const joinRoomButton = document.getElementById('room-button');
const roomInput = document.getElementById('room-input');
const messageInput = document.getElementById('message-input');
const form = document.getElementById('form');

const socket = io('http://localhost:3000');
const userSocket = io('http://localhost:3000/user', {
  auth: {
    token: 'test'
  }
});

userSocket.on('connect_error', (error) => {
  displayMessage(error);
});

socket.on("connect", () => {
  displayMessage(`You connected with id: ${socket.id}`);
});

socket.on('receive-message', (message) => {
  displayMessage(message);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === "") return;
  displayMessage(message);
  socket.emit('send-message', message, room);

  messageInput.value = '';
});

joinRoomButton.addEventListener('click', () => {
  const room = roomInput.value;
  socket.emit('join-room', room, message => {
    displayMessage(message);
  });
});

function displayMessage(message) {
  const div = document.createElement('div');
  div.textContent = message;
  document.getElementById('message-container').append(div);
}

let count = 0;

setInterval(() => {
  socket.volatile.emit('ping', ++count);
}, 1000);

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input')) return;

  if (e.key === 'c') {
    socket.connect();
  }
  if (e.key === 'd') {
    socket.disconnect();
  }
});
