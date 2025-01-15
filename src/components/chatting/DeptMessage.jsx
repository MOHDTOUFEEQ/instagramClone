import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../../appwrite/config';
import { useSelector } from 'react-redux';

function DeptMessage() {
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const [currentProfile, setCurrentProfile] = useState("");
  const [profilepic, setProfilePic] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState(""); 
  const [sortMessages, setSortedMessages] = useState([]);
  
  const fetchMessages = async () => {
    try {
      const senderMessages = await service.getMessages(userData.$id, id);
      const receiverMessages = await service.getMessages(id, userData.$id);
      if (senderMessages && receiverMessages) {
        const combinedMessages = [...senderMessages.documents, ...receiverMessages.documents];
        const sortedMessages = combinedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setSortedMessages(sortedMessages);
        console.log("this is all messages", sortedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
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
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      await service.addMessage(newMessage);
      console.log("Message has been sent successfully");
      setMessageInput('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(()=>{
    if (location.pathname ==`/chatting/${id}`) {
      const header = document.querySelector(".header");
      if (header) {
        header.style.width = "5vw";
        
      }
    }
    async function getData(params) {
      const oppoUser = await service.getProfileinfo(id);
      const curr_user = await service.getProfileinfo(userData.$id);
      if (curr_user && oppoUser) {
        setCurrentProfile(oppoUser.ProfilePic);
        setProfilePic(curr_user.ProfilePic);
        setCurrentName(oppoUser.userName)
      }
    }
    getData()
  },[userData.$id])
  useEffect(() => {
    if (id) {
      fetchMessages();

      const intervalId = setInterval(fetchMessages, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [id, userData.$id]);

  return (
    <>
    <div class="relative flex items-center space-x-4" style={{paddingLeft:"24px",borderBottom:"1px solid #e6e8ec"}}>
         <div class="relative">
            <span class="absolute text-green-500 right-0 bottom-0">
               <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
               </svg>
            </span>
         <img src={ currentProfile? service.getFilePreview(currentProfile) :  "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full"/>
         </div>
         <div class="flex flex-col leading-tight">
            <div class="text-2xl mt-1 flex items-center">
               <span class="text-gray-700 mr-3">{currentName? currentName : "User"}</span>
            </div>
         </div>
      </div>
    <div className="h-screen overflow-y-auto p-4" style={{ width: '100vw',height:"75vh" }}>
    {sortMessages.map((message, index) => {
      const isUserMessage = message.senderID === userData.$id;

      return (
        <div key={index} className={`flex mb-4 cursor-pointer ${isUserMessage ? 'justify-end' : ''}`}>
    {!isUserMessage && (
      <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
         <img  src={ currentProfile? service.getFilePreview(currentProfile) :  "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
      </div>
    )}
    <div className={`flex max-w-96 ${isUserMessage ? 'bg-indigo-500 text-white' : 'bg-white'} rounded-lg p-3 gap-3`}>
      <p className={isUserMessage ? 'text-white' : 'text-gray-700'}>{message.messageContent}</p>
    </div>
    {isUserMessage && (
      <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
         <img  src={ profilepic? service.getFilePreview(profilepic) :    "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
      </div>
    )}
</div>
      );
    })}
  </div>
    <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0" style={{position:"absolute",bottom:"4.9rem",width:"100vw"}}>
    <div class="relative flex">
  <input type="text" placeholder="Write your message!"   value={messageInput} onChange={(e) => setMessageInput(e.target.value)} class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"/>
  <div class="absolute right-0 items-center inset-y-0">
    <button type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none" onClick={handleSendMessage}>
      <span class="font-bold">Send</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
      </svg>
    </button>
  </div>
</div>



    </div>
    </>
  )
}

export default DeptMessage;
