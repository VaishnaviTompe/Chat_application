import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import AI from './AI.jpg'

// Defining the Chat component.
function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // Function to sending a message.
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            // Emit the message data to the server.
            await socket.emit("send_message", messageData);

            // Update the message list with the new message.
            setMessageList((list) => [...list, messageData]);

            // Clear the current message input field.
            setCurrentMessage("");
        }
    };

    // Effect to listen for incoming messages from the server.
    useEffect(() => {
      const receiveMessageListener = (data) => {
          // Add the received message to the message list.
          setMessageList((list) => [...list, data]);
      };
  
      socket.on("receive_message", receiveMessageListener);
  
      return () => {
          socket.off("receive_message", receiveMessageListener);
      };
  }, [socket]);

    return (
        <div>
            <img src={AI} className="img-fluid" alt="Responsive" style={{ height: '100vh', width: '100%' }}></img>

            <div className='card-img-overlay' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="card-window col-3">
                    <div className="card" style={{ width: '18rem' }}>
                        <div className="card-header text-center">
                            <p>Live Chat</p>
                        </div>
                        <div className="card-body">
                            <ScrollToBottom className="message-container">
                                {messageList.map((messageContent) => {
                                    return (
                                        <div key={messageContent.messageId}  className="message" id={username === messageContent.author ? "you" : "other"}>

                                            <div>
                                                <div className="message-content">
                                                    <p>{messageContent.message}</p>
                                                </div>
                                                <div className="message-meta">
                                                    <p id="time">{messageContent.time}</p>
                                                    <p id="author">{messageContent.author}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </ScrollToBottom>
                        </div>
                        <div className="card-footer text-muted mb-2">
                            <input type="text" name="text" value={currentMessage} placeholder="Hey..." onChange={(event) => { setCurrentMessage(event.target.value); }} onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }} />

                            <button className="full" onClick={sendMessage}>&#9658;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
