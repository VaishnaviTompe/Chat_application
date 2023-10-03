// Import the necessary components.
import './App.css';
import Chat from "./Chat";
import io from "socket.io-client";
import { useState } from "react";
import Chatbot from './chatbot.jpg'

// Connect to the Socket.IO server running at http://localhost:3001.
const socket = io.connect("http://localhost:3001");

function App() {
  // State variables to manage username, room, and whether to show the chat.
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Function to join a chat room when the "Join A Room" button is clicked.
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      <img src={Chatbot} className="img-fluid" alt="Responsive" style={{ height: '100vh', width: '100%' }}></img>
      <div className='card-img-overlay' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {/* Render a form if chat is not shown, otherwise show the Chat component */}
        {!showChat ? (
          <form className='bg-light rounded'>
            <h3 className="text-center mt-3 " style={{ color: 'black' }}>Join a chat</h3>
            <div className="form-group mb-2">
              <label for="exampleInputEmail1">Name</label>
              <input
                type="text"
                className="form-control mt-3"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Username..."
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                required
              />
            </div>
            <div className="form-group">
              <label for="exampleInputPassword1">Room ID</label>
              <input
                type="number"
                className="form-control mt-3"
                id="exampleInputPassword1"
                placeholder="Room ID..."
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
                required
              />
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary" onClick={joinRoom}>Join A Room</button>
            </div>
          </form>
        ) : (
          // If showChat is true, render the Chat component with socket, username, and room props.
          <Chat socket={socket} username={username} room={room} />
        )}
      </div>
    </div>
  );
}

export default App;
