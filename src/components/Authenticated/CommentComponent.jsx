import React, { useState } from 'react';
import service from '../../appwrite/config';
import { useSelector } from 'react-redux';

function CommentComponent({ postDetails , updateComment ,sendingnouser }) {
  const [commentText, setCommentText] = useState('');
  const [comment_info, comment_add] = useState(postDetails.comment || []);
  const userData = useSelector((state) => state.auth.userData);
  const [please_login,setPleaseLokin] = useState(null)
  const handleCommentSubmit = async () => {
    if (userData && userData.$id !== null) {
      const articles = postDetails.$id;
      console.log("i am article", articles);
      const timestamp = new Date().toISOString();
      const userName = postDetails.username
      // Assuming you have an Appwrite service instance
      try {
        await service.addComment({ content: commentText, timestamp , userName ,articles});
        console.log('Comment submitted successfully');
        const newCommentElement = document.createElement('div');
        newCommentElement.className = 'comment_area mb-2';
        newCommentElement.innerHTML = `
          <span class="font-bold mr-2">${userData.userName}:</span>
          <span>${commentText}</span>
          <span class="ml-2 text-gray-500">Just now</span>
        `;
    
        // Append the new comment element to the existing comment area
        document.querySelector('.fullly').appendChild(newCommentElement);
        document.querySelector(".comment_Successfully h3").style.display = "block"
        setTimeout(()=> {
        document.querySelector(".comment_Successfully h3").style.display = "none"
        } , 5000)
        setCommentText(''); // Clear the comment text after submission
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    } 
    else{
      sendingnouser()
    }
  };

  return (
    <div className='px-3 full-commentbox flex items-center justify-center'>
      <div className='w-full flex flex-col justify-center align-center'>
      
        <div className='h-25 w-full mb-2 overflow-y-scroll fullly'>
          {/* Display comments here */}
                    {comment_info.map((data) => {
            const commentDate = new Date(data.timestamp);
            const currentDate = new Date();
            const timeDifference = currentDate - commentDate;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            let timeAgo;
            if (daysDifference >= 1) {
              timeAgo = `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
            } else {
              const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
              if (hoursDifference >= 1) {
                timeAgo = `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
              } else {
                const minutesDifference = Math.floor(timeDifference / (1000 * 60));
                timeAgo = `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
              }
            }
            return (
              <>
             <>
              <div className="comment_area mb-2" key={data.commentId}>
                <span className="font-bold mr-2">{data.userName}:</span>
                <span>{data.content}</span>
                <span className="ml-2 text-gray-500">{timeAgo}</span>
              </div>
             
             </>
              </>
            );
          })}

          {comment_info.length === 0 && <div>No comments. Add a comment!</div>}
        </div>
        <div className='w-full flex items-center'>
          <input
            type="text"
            placeholder='Add a comment...'
            className='w-5/6 mr-2 p-2 border rounded'
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            className='w-1/6 bg-blue-500 text-white p-2 rounded'
            onClick={handleCommentSubmit}
          >
            Post
          </button>
          
        </div>
        <div className='comment_Successfully'>
          <h3>Comment successfully Done!!</h3>
        </div>
      </div>
    </div>
  );
}

export default CommentComponent;
