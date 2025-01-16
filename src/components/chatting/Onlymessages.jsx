import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'; 
import service from '../../appwrite/config';

function Onlymessages({ id, name, profile, profile1 }) {
  const [messageInput, setMessageInput] = useState('');
  const userData = useSelector((state) => state.auth.userData);
  const [sortMessages, setSortedMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const senderMessages = await service.getMessages(userData.$id, id);
      const receiverMessages = await service.getMessages(id, userData.$id);

      if (senderMessages && receiverMessages) {
        const combinedMessages = [...senderMessages.documents, ...receiverMessages.documents];
        const sortedMessages = combinedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setSortedMessages(sortedMessages);
        console.log("Fetched and sorted messages", sortedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    const senderID = `${userData.$id}`;
    const receiverID = id;

    const newMessage = {
      senderID,
      receiverID,
      messageContent: messageInput,
      timestamp: new Date().toISOString(),
    };

    try {
      setSortedMessages((prevMessages) => [...prevMessages, newMessage]);
      await service.addMessage(newMessage);
      console.log("Message sent successfully");
      setMessageInput('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 5000);

      return () => clearInterval(intervalId);
    }
  }, [id, userData.$id]);

  return (
    <>
      <header className="bg-white p-4 text-gray-700" style={{ borderBottom: "1px solid #edf4f3" }}>
        <h1 className="text-2xl font-semibold">{name}</h1>
      </header>

      {!id && (
        <div className="h-screen overflow-y-auto p-4 flex justify-center items-center" style={{ width: '70vw' }}>
          <div className="bg-white p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Send private photos and messages</h2>
            <p className="text-gray-600 mb-4">Start a conversation with one or more friends using Your Messages.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Start a conversation now</button>
          </div>
        </div>
      )}

      {id && (
        <div className="h-screen overflow-y-auto p-4 pb-36" style={{ width: '70vw' }}>
          {sortMessages.map((message, index) => {
            const isUserMessage = message.senderID === userData.$id;

            return (
              <div key={index} className={`flex mb-4 cursor-pointer ${isUserMessage ? 'justify-end' : ''}`}>
                {!isUserMessage && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img src={profile ? service.getFilePreview(profile) : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
                  </div>
                )}
                <div className={`flex max-w-96 ${isUserMessage ? 'bg-indigo-500 text-white' : 'bg-white'} rounded-lg p-3 gap-3`}>
                  <p className={isUserMessage ? 'text-white' : 'text-gray-700'}>{message.messageContent}</p>
                </div>
                {isUserMessage && (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                    <img src={profile1 ? service.getFilePreview(profile1) : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {id && (
        <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4" style={{ width: "70vw" }}>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              id="message_"
              value={messageInput}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2" onClick={handleSendMessage}>Send</button>
          </div>
        </footer>
      )}
    </>
  );
}
Onlymessages.propTypes = {
  id: PropTypes.string.isRequired,          // 'id' should be a string and is required
  name: PropTypes.string.isRequired,        // 'name' should be a string and is required
  profile: PropTypes.string,                // 'profile' should be a string, optional
  profile1: PropTypes.string,               // 'profile1' should be a string, optional
};
export default Onlymessages;
