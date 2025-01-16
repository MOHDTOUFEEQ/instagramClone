import  { useState } from 'react';
import PropTypes from 'prop-types'; // For props validation
import service from '../../appwrite/config';
import { useSelector } from 'react-redux';

function CommentComponent({ postDetails, sendingnouser }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(postDetails.comment || []);
  const userData = useSelector((state) => state.auth.userData);

  const handleCommentSubmit = async () => {
    if (userData && userData.$id !== null) {
      const articleId = postDetails.$id;
      const timestamp = new Date().toISOString();
      const userName = userData.name;

      try {
        await service.addComment({ content: commentText, timestamp, userName, articles: articleId });

        // Update the comments list
        const newComment = {
          userName,
          content: commentText,
          timestamp,
        };

        setComments((prevComments) => [newComment, ...prevComments]);

        // Clear the input field
        setCommentText('');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    } else {
      sendingnouser(); // Notify the parent if the user is not logged in
    }
  };

  const getTimeAgo = (timestamp) => {
    const commentDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - commentDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference >= 1) {
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }

    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursDifference >= 1) {
      return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    }

    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="px-3 full-commentbox flex items-center justify-center">
      <div className="w-full flex flex-col">
        {/* Comment Display Area */}
        <div className="h-25 w-full mb-2 overflow-y-scroll fullly">
          {comments.length > 0 ? (
            comments.map((data, index) => (
              <div className="comment_area mb-2" key={index}>
                <span className="font-bold mr-2">{data.userName}:</span>
                <span>{data.content}</span>
                <span className="ml-2 text-gray-500">{getTimeAgo(data.timestamp)}</span>
              </div>
            ))
          ) : (
            <div>No comments. Add a comment!</div>
          )}
        </div>

        {/* Add Comment Input */}
        <div className="w-full flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-5/6 mr-2 p-2 border rounded"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            className="w-1/6 bg-blue-500 text-white p-2 rounded"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
          >
            Post
          </button>
        </div>

        {/* Success Message */}
        {commentText === '' && (
          <div className="comment_Successfully">
            <h3>Comment successfully posted!</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// Add PropTypes for validation
CommentComponent.propTypes = {
  postDetails: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    comment: PropTypes.arrayOf(
      PropTypes.shape({
        userName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  sendingnouser: PropTypes.func.isRequired,
};

export default CommentComponent;
