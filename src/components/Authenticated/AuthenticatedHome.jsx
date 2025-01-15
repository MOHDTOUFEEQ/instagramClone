import React, { useEffect, useState } from 'react';
import service from '../../appwrite/config';
import Postcard from './Postcard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AuthenticatedHome() {
  const [posts, setPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const message1 = useSelector((state) => state.auth.message);

  useEffect(() => {
    service.getPosts().then((post) => {
      if (post) {
        setPosts(post.documents);
      }
    });
  }, []);

  useEffect(() => {
    console.log("I am the changed value in state", message1);
    setShowMessage(true);

    const timeoutId = setTimeout(() => {
      setShowMessage(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [message1]);
  console.log("this is a full post for home", posts);
  return (
    <>
   
    <div className="min-h-screen flex flex-col items-center justify-center">
    <div>
    <div className="mb-4">
          {showMessage && message1?.length > 7 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message1}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              
              </span>
            </div>
          )}
        </div>
</div>
    <div className="flex flex-col items-center gap-2 px-5 overflow-x-hidden">
      {posts.map((val) => (
        <div key={val.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-full mb-10">
          {/* <Link to={`/homeview/${val.$id}`}> */}
            <Postcard post={val}/>
          {/* </Link> */}
        </div>
      ))}
    </div>
  </div>

    </>
  );
}

export default AuthenticatedHome;
