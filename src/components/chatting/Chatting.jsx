import  { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import service from '../../appwrite/config';
import service2 from '../../appwrite/config2';
import Onlymessages from './Onlymessages';
import { Link, useLocation } from 'react-router-dom';

function Chatting() {
  const location = useLocation();
  if (location.pathname =="/chatting") {
    const header = document.querySelector(".header");
    if (header) {
      header.style.width = "5vw";
      
    }
  }
  const userData = useSelector((state) => state.auth.userData);
    const [curr_user_id, setCurr_user_id] = useState("");
    const [followersInfo, setFollowersInfo] = useState([]);
    const [current_id, setCurrent_id] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [current_name, setCurrent_name] = useState("");
    
    useEffect(() => {
      async function fetchingFollowers() {
        try {
          const userProfile = await service.getProfileinfo(String(userData?.$id));
        
          if (userProfile) {
            setCurr_user_id(userProfile.ProfilePic);
            (userProfile.followersList);
          }
  
  
          // Rest of your code...
  
          const followers_list = userProfile.followersList;
  
          // Create an array to store the user information for each follower
          const followersInfo = [];
  
          // Iterate over each follower
          for (const followerId of followers_list) {
            // Make a request to get user information for each follower
            const userPosts = await service2.getPostsForCurrentUserr(followerId);
  
            // Assuming the user information is present in userPosts.documents
            // Adjust the code based on the actual structure of your response
            const userInfo = userPosts.documents[0]; // Assuming you only expect one document
  
            // Add the user information to the followersInfo array
            followersInfo.push({
              userId: followerId,
              username: userInfo.userName,
              profilePic: userInfo.ProfilePic,
              // Add other properties as needed
            });
          }
  
          setFollowersInfo(followersInfo);
        } catch (error) {
          console.error("Error fetching followers:", error);
        }
      }

  
      fetchingFollowers();
    }, [userData]);
    const clicktomessage = (e)=>{
        setCurrent_id(e.userId)
        setCurrent_name(e.username)
        setProfilePic(e.profilePic)
    } 
    const homechat = ()=>{
        setCurrent_id("")
        setCurrent_name("")
        
    }
    return (
   <>
     <div className="flex h-screen overflow-hidden">
        <div className="w-1/4 bg-white border-r border-gray-300 relative left-5vw" style={{ left: '5vw' }}>
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white cursor-pointer" onClick={homechat}>
            <h1 className="text-2xl font-semibold" >Chat Web</h1>
            <div className="relative">
              <button id="menuButton" className="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-100" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                </svg>
              </button>
              <div id="menuDropdown" className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg hidden">
                <ul className="py-2 px-3">
                  <li><Link to="#" className="block px-4 py-2 text-gray-800 hover:text-gray-400">Option 1</Link></li>
                  <li><Link to="#" className="block px-4 py-2 text-gray-800 hover:text-gray-400">Option 2</Link></li>
                </ul>
              </div>
            </div>
          </header>
        
          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
          {followersInfo.length > 0 ?   
                followersInfo.map((e) => (
                    <div key={e.userId} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"onClick={() => clicktomessage(e)}>
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img
                        src={
                            e.profilePic
                            ? service.getFilePreview(e.profilePic)
                            : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                        }
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">{e.username}</h2>
                        <p className="text-gray-600">click here to see any new messages!!</p>
                    </div>
                    </div>
                ))
                : null}

          
           
            
            
          </div>
        </div>
        
        <div className="flex-1" style={{position: "relative",left: "5vw", width: "47vw"}}>
            <Onlymessages  id={current_id} name= {current_name} profile = {profilePic} profile1= {curr_user_id} />
        </div>
    </div>
   </>
  
  )
}

export default Chatting