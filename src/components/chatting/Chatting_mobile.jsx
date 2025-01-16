import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import service from '../../appwrite/config';
import service2 from '../../appwrite/config2';
import { Link } from 'react-router-dom';

function Chatting_mobile() {
  const userData = useSelector((state) => state.auth.userData);
  const [followersInfo, setFollowersInfo] = useState([]);


  useEffect(() => {
    async function fetchingFollowers() {
      try {
        const userProfile = await service.getProfileinfo(String(userData?.$id));
        if (userProfile) {
          const followersInfoPromises = userProfile.followersList.map(async (followerId) => {
            const userPosts = await service2.getPostsForCurrentUserr(followerId);
            const userInfo = userPosts.documents[0];
  
            return {
              userId: followerId,
              username: userInfo.userName,
              profilePic: userInfo.ProfilePic,
            };
          });
  
          const resolvedFollowersInfo = await Promise.all(followersInfoPromises);
  
          setFollowersInfo(resolvedFollowersInfo);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    }
  
    fetchingFollowers();
  }, [userData]);
  
  return (
    <div className="container mx-auto p-8">
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold"><span className="text-blue-500">YourUsername</span></h1>
    </div>

    <h2 className="text-2xl font-bold text-center mb-4">Chat App</h2>

    <div className="space-y-4">
    {followersInfo.length > 0 ? followersInfo.map((follower) => (
          <div key={follower.userId} className={`flex items-center border-b border-gray-300 pb-4 ${follower.userId ? 'visible' : 'hidden'}`}>
            {follower.userId && (
              <Link to={`/DeptMessage/${follower.userId}`} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img className="w-16 h-16 rounded-full" src={follower.profilePic ? service.getFilePreview(follower.profilePic) : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="User Profile" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{follower.username}</p>
                  <p className="text-gray-500 text-sm">Last message: How are you doing?</p>
                </div>
              </Link>
            )}
          </div>
        )): null}
    </div>
  </div>
  );
}

export default Chatting_mobile;
