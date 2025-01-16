import  { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import { useSelector } from 'react-redux';
import PropTypes from "prop-types";
import CommentComponent from './CommentComponent';

function Postcard({ post = {} }) {
  const userData = useSelector((state) => state.auth.userData);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.Likes || 0);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);
  const [savedBy, setSavedBy] = useState(post.saved || []);
  const [showCommentComponent, setShowCommentComponent] = useState(false);
  const [isGreen, setIsGreen] = useState(false);
  const [pleaseLoginMessage, setPleaseLoginMessage] = useState("");

  // Check if the user has liked the post
  useEffect(() => {
    const userLiked = likedBy.includes(userData?.$id);
    setLiked(userLiked);
  }, [likedBy, userData]);

  // Check if the user has saved the post
  useEffect(() => {
    const userSaved = savedBy.includes(userData?.$id);
    setIsGreen(userSaved);
  }, [savedBy, userData]);

  const handlePleaseLoginMessage = (message) => {
    setPleaseLoginMessage(message);
    setTimeout(() => {
      setPleaseLoginMessage("");
    }, 6000);
  };

  const toggleLike = async () => {
    try {
      if (!userData || !userData.$id) {
        handlePleaseLoginMessage("Please login to like the post");
        return;
      }

      const userLiked = likedBy.includes(userData.$id);
      if (userLiked) {
        const updatedLikedBy = likedBy.filter((userId) => userId !== userData.$id);
        setLikedBy(updatedLikedBy);
        setLikeCount((prev) => prev - 1);
        setLiked(false);
        await service.updateLikes(post.$id, { Likes: likeCount - 1, likedBy: updatedLikedBy });
      } else {
        const updatedLikedBy = [...likedBy, userData.$id];
        setLikedBy(updatedLikedBy);
        setLikeCount((prev) => prev + 1);
        setLiked(true);
        await service.updateLikes(post.$id, { Likes: likeCount + 1, likedBy: updatedLikedBy });
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const toggleSave = async () => {
    try {
      if (!userData || !userData.$id) {
        handlePleaseLoginMessage("Please login to save the post");
        return;
      }

      const userSaved = savedBy.includes(userData.$id);
      if (userSaved) {
        const updatedSavedBy = savedBy.filter((userId) => userId !== userData.$id);
        setSavedBy(updatedSavedBy);
        setIsGreen(false);
        await service.updateSaved(post.$id, { saved: updatedSavedBy });
      } else {
        const updatedSavedBy = [...savedBy, userData.$id];
        setSavedBy(updatedSavedBy);
        setIsGreen(true);
        await service.updateSaved(post.$id, { saved: updatedSavedBy });
      }
    } catch (error) {
      console.error("Error saving/removing post:", error);
    }
  };

  const toggleComments = () => {
    setShowCommentComponent((prev) => !prev);
  };

  return (
    <>
      <div className="bg-gray-100 p-4">
        <div className="bg-white border rounded-sm max-w-md">
          {/* Post Header */}
          <a href={`/profile/${post.userId}`}>
            <div className="flex items-center px-4 py-3">
              <img
                className="h-8 w-8 rounded-full"
                src={
                  post.ProfilePic
                    ? service.getFilePreview(post.ProfilePic)
                    : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                }
                alt="Profile"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold antialiased block leading-tight">
                  {post.username}
                </span>
                <span className="text-gray-600 text-xs block">{post.title}</span>
              </div>
            </div>
          </a>

          {/* Post Image */}
          <div style={{ position: "relative", overflow: "hidden", maxHeight: "450px" }}>
            <img
              src={service.getFilePreview(post.featuredImage)}
              className="w-full h-full object-contain"
              alt="Post"
            />
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mx-4 mt-3 mb-2">
            <div className="flex gap-5">
              {/* Like Button */}
              <button
                onClick={toggleLike}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "2em",
                  color: liked ? "red" : "black",
                  position: "relative",
                  right: "10px",
                  bottom: "8px",
                }}
              >
                {liked ? "❤️" : "🤍"}
              </button>

              {/* Comment Button */}
              <button
                onClick={toggleComments}
                style={{ position: "relative", right: "12px", bottom: "8px" }}
              >
                <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                  <path
                    clipRule="evenodd"
                    d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Save Button */}
            <button onClick={toggleSave}>
              {isGreen ? (
                <img
                  src="https://static.thenounproject.com/png/3810268-200.png"
                  alt="Saved"
                  style={{ height: "30px", width: "35px" }}
                />
              ) : (
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-save-3244517-2701888.png"
                  alt="Save"
                  style={{ height: "35px", width: "35px" }}
                />
              )}
            </button>
          </div>

          {/* Please Login Message */}
          {pleaseLoginMessage && (
            <div className="w-full pl-4 text-red-500">{pleaseLoginMessage}</div>
          )}

          {/* Comments Component */}
          {showCommentComponent && (
            <CommentComponent
              sendingnouser={() =>
                handlePleaseLoginMessage("Please login to comment on this post")
              }
              postDetails={post}
              updateComments={() => console.log("Comments updated")}
            />
          )}

          {/* Likes Count */}
          <div className="font-semibold text-sm mx-4 mt-2 mb-4">{likeCount} Likes</div>
        </div>
      </div>
    </>
  );
}
Postcard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    status: PropTypes.string,
    content: PropTypes.string,
  }),
};
export default Postcard;
