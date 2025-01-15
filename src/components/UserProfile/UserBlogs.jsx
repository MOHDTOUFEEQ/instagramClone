import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import service from '../../appwrite/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

function UserBlogs({id}) {
    const userid = {$id : id}
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
    }, []); // Add userid as a dependency

    return (
        <>
            {posts.length > 0 ? (
              <>
              {posts.map((e) => (
                <div className='w-1/3 p-px md:px-3 card ' id='card_container' key={e.$id}>
                <Link
                  to={`/all-Blog/${e.$id}`}
                  className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4"
                >
                  <article className="post bg-gray-100 text-white relative pb-full md:mb-6 " id='card_div'>
                    <img
                      style={{
                        height: '345px', // Default height for larger screens
                      }}
                      className="w-full h-full object-cover"
                      src={service.getFilePreview(e.featuredImage)}
                      alt="image"
                    />
                    <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 ">
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
              <div className='flex items-center justify-center flex-col' style={{ width: "100vw", gap: "2vh", position: "relative", paddingTop: "10vh" }}>
                <div className='border rounded p-2 border-black h-20 w-20 flex items-center justify-center rounded-full text-black text-lg'>
                  <FontAwesomeIcon icon={faCamera} className="text-xl" />
                </div>
                <h1 className='text-center pt-6 text-4xl font-bold'>No posts yet</h1>
              </div>
            </>
            )}
        </>
    );
}

export default UserBlogs;
