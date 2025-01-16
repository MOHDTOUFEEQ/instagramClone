import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import service from '../../appwrite/config';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Tagged_post() {
  const userid = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    service
      .getPosts()
      .then((post) => {
        if (post) {
          setPosts(post.documents);
        }
      })
      .catch((err) => {
        setError('Failed to fetch posts');
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // Stop loading once data is fetched or if there's an error
      });
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.saved.some((savedItem) => savedItem === userid.$id)
  );

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  return (
    <>
      {filteredPosts && filteredPosts.length > 0 ? (
        <>
          {filteredPosts.map((e) => (
            <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-3 card" key={e.$id} id="card_container">
              <Link to={`/all-Blog/${e.$id}`} className="w-full">
                <article className="post bg-gray-100 relative pb-full md:mb-6">
                  <img
                    className="w-full h-full object-cover"
                    style={{ height: '345px' }}
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
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </>
      ) : (
        <>
          <div
            className="flex items-center justify-center flex-col"
            style={{ width: '100vw', gap: '2vh', position: 'relative', paddingTop: '10vh' }}
          >
            <div className="border rounded p-2 border-black h-20 w-20 flex items-center justify-center rounded-full text-black text-lg">
              <FontAwesomeIcon icon={faBookmark} className="text-xl" />
            </div>
            <h1 className="h-screen text-center pt-6 text-4xl font-bold">No saved post</h1>
          </div>
        </>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>} {/* Show error message if any */}
    </>
  );
}

export default Tagged_post;
