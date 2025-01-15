import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import { useSelector } from 'react-redux';
import CommentComponent from './CommentComponent';
import { useNavigate } from 'react-router-dom';

function Postcard({ post }) {
  const userData = useSelector((state) => state.auth.userData);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.Likes);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);
  const [savedBy, setSavedBy] = useState(post.saved || []);
  const [showCommentComponent, setShowCommentComponent] = useState(false);
  const [isLiked,setisLiked] = useState(post.saved || [])
  const [likes_info,setLike_info] = useState({})
  const [isGreen,setisGreen] = useState(false)
  const [please_login,setPleaseLokin] = useState(null)

  console.log("is_liked",isLiked);
  useEffect(() => {
    const userLiked = isLiked.find(data => data.userId === userData?.$id);
    if (userLiked) {
      setisGreen(true);
      setLike_info(userLiked);
    }
  }, [isLiked, userData]);
  
  // Call the function to remove saved posts sequentially
  // removeSavedPostsSequentially(postIdsToRemove);
  console.log("I am likedby", likedBy);
  useEffect(() => {
    setLiked(likedBy.includes(userData?.$id));
    setisGreen(savedBy.includes(userData?.$id))
  }, [likedBy, userData, post.$id,savedBy]);


  
  const updateComments = async () => {
    console.log('Comments updated');
  };

  const toggleLike = async () => {
    try {
      if (userData && userData.$id !== null) {
        const userLiked = likedBy.includes(userData?.$id);

        if (userLiked) {
          const updatedLikedBy = likedBy.filter((userId) => userId !== userData?.$id);
          setLikedBy(updatedLikedBy);
          await service.updateLikes(post.$id, { Likes: likeCount - 1, likedBy: updatedLikedBy });
          setLikeCount(likeCount - 1);
          setLiked(false);
        } else {
          await service.updateLikes(post.$id, { Likes: likeCount + 1, likedBy: [...likedBy, userData?.$id] });
          setLikedBy([...likedBy, userData?.$id]);
          setLikeCount(likeCount + 1);
          setLiked(true);
        } 
      }
      else{
        setPleaseLokin("Please, Login to like the post")
        setTimeout(() => {
          setPleaseLokin("")
        }, 6000);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };
  
  const handleComment = () => {
    setShowCommentComponent((prev) => !prev);
  };
  const toggleSave_ = async () => {
    try {
      if (userData && userData.$id !== null) {
        const userSaved = savedBy.includes(userData?.$id);
        if (userSaved) {
          const updatedSavedBy = savedBy.filter((userId) => userId !== userData?.$id);
          setSavedBy(updatedSavedBy)  
          await service.updateSaved(post.$id, { saved: updatedSavedBy });
          setisGreen(false)
        }
        else{
          await service.updateSaved(post.$id, { saved: [...savedBy, userData?.$id] });
          setSavedBy([...savedBy, userData?.$id]);
          setisGreen(true)
        }
      }
      else{
        setPleaseLokin("Please, Login to save the post")
        setTimeout(() => {
          setPleaseLokin("")
        }, 6000);
      }
    } catch (error) {
      console.error('Error saving/removing post:', error);
    }
  };
  


  
  
  return (
    <>
      <div class="bg-gray-100 p-4">
        <div class="bg-white border rounded-sm max-w-md">
             <a href={`/profile/${post.userId}`}>
          <div class="flex items-center px-4 py-3">
            <img class="h-8 w-8 rounded-full" src={post.ProfilePic ? service.getFilePreview(post.ProfilePic) : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} />
            <div class="ml-3 ">
              <span class="text-sm font-semibold antialiased block leading-tight">{post.username}</span>
              <span class="text-gray-600 text-xs block">{post.title}</span>
            </div>
          </div>
              </a>
          <div style={{ position: 'relative', overflow: 'hidden', maxHeight: '450px' }}>
            <img src={service.getFilePreview(post.featuredImage)} className="w-full h-full object-fit-contain" alt="Post Image" />
      
          </div>
          <div class="flex items-center justify-between mx-4 mt-3 mb-2">
            <div class="flex gap-5">
              <button
                onClick={toggleLike}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2em',
                  color: liked ? 'red' : 'white',
                  position: 'relative',
                  right: '10px',
                  bottom: '8px',
                }}
              >
                {liked ? '❤️' : '🤍'}
              </button>
              <button onClick={handleComment} style={{position : 'relative' , right: "12px", bottom : "8px"}}>
                <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                  <path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path>
                </svg>
              </button>
            </div>
                {isGreen ? <button onClick={toggleSave_} >
                    <div class="flex">
                      <img src="https://static.thenounproject.com/png/3810268-200.png" style={{height: "30px" , width: "35px",}} className='relative t-100px' alt="" />
              
                    </div>
                </button> : 
                <button onClick={toggleSave_} >
                    <div class="flex">
                      <img src="https://cdn.iconscout.com/icon/free/png-256/free-save-3244517-2701888.png" style={{height: "35px" , width: "35px"}} alt="" />
                    </div>
                </button> 
                }
          </div>
              
          {please_login? <>
            <div className='w-full  pl-4 text-red-500'>
            {please_login}
          </div>
          </> : null}
          {showCommentComponent && <CommentComponent sendingnouser={() => {   setPleaseLokin("Please, Login to comment on this post")
        setTimeout(() => {
          setPleaseLokin("")
        }, 6000);}} postDetails={post} updateComments={updateComments} />}
          <div class="font-semibold text-sm mx-4 mt-2 mb-4">{likeCount} Likes</div>
        </div>
      </div>
    </>
  );
}

export default Postcard;
