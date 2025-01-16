import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types'; // Import PropTypes
import service from '../appwrite/config';

function Allblogs({ setShowDelete }) {
  const userid = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetching() {
      try {
        const post = await service.getPostsForCurrentUser(userid.$id);
        if (post) {
          setPosts(post.documents);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetching();
  }, [userid]);

  const [showDeleteButton, setShowDeleteButton] = useState(null);

  const handleToggleDeleteButton = (postId) => {
    setShowDeleteButton((prevShowDeleteButton) => (prevShowDeleteButton === postId ? null : postId));
  };

  const handleDeletePost = (postId) => {
    setShowDelete(postId);
  };

  const hideoption = (e) => {
    if (e.target.tagName !== 'BUTTON') {
      setShowDeleteButton(false);
    }
  };

  return (
    <>
      {posts.length > 0 ? (
        <>
          {posts.map((e) => (
            <div className="w-1/3 p-px md:px-3 card" id="card_container" onClick={hideoption} key={e.$id}>
              <article className="post bg-gray-100 text-white relative pb-full md:mb-6" id="card_div">
                <img
                  style={{
                    height: '345px',
                  }}
                  className="w-full h-full object-cover"
                  src={service.getFilePreview(e.featuredImage)}
                  alt="image"
                />
                <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0">
                  <div className="flex justify-center items-center space-x-4 h-full">
                    <span className="p-2 text-white">
                      <i className="fas fa-heart"></i> {e.Likes}
                    </span>
                    <span className="p-2 text-white">
                      <i className="fas fa-comment"></i> {e.comment.length}
                    </span>
                    <div className="absolute right-0 top-0">
                      <button
                        className="p-2 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                        onClick={() => handleToggleDeleteButton(e.$id)}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>

                      {showDeleteButton === e.$id && (
                        <div className="absolute right-0 top-0 bg-red-600">
                          <button
                            className="p-2 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600"
                            onClick={() => handleDeletePost(e.$id)}
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </>
      ) : (
        <div
          className="flex items-center justify-center flex-col"
          style={{ width: '100vw', gap: '2vh', position: 'relative', paddingTop: '10vh' }}
        >
          <div className="border rounded p-2 border-black h-20 w-20 flex items-center justify-center rounded-full text-black text-lg">
            <FontAwesomeIcon icon={faCamera} className="text-xl" />
          </div>
          <h1 className=" text-center pt-6 text-4xl font-bold">No posts yet</h1>
        </div>
      )}
    </>
  );
}

// Define PropTypes for the component
Allblogs.propTypes = {
  setShowDelete: PropTypes.func, // Define setShowDelete as a required function
};

export default Allblogs;
