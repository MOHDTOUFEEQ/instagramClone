import { useEffect, useState } from "react";
import service from "../../appwrite/config";
import Postcard from "./Postcard";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid"; // Import nanoid

function AuthenticatedHome() {
  const [posts, setPosts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const message1 = useSelector((state) => state.auth.message);

  // Fetch posts on component mount
  useEffect(() => {
    service
      .getPosts()
      .then((post) => {
        if (post?.documents) {
          setPosts(post.documents);
        } else {
          console.error("No posts found or invalid response:", post);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  // Handle showing a success message when message1 changes
  useEffect(() => {
    if (message1) {
      setShowMessage(true);

      const timeoutId = setTimeout(() => {
        setShowMessage(false);
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [message1]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center">
        {/* Notification Message */}
        <div className="mb-4">
          {showMessage && message1?.length > 7 && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{message1}</span>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="flex flex-col items-center gap-2 px-5 overflow-x-hidden">
          {posts.length === 0 ? (
            <p>No posts available at the moment.</p>
          ) : (
            posts.map((val) => (
              <div
                key={nanoid()} // Generate a unique key using nanoid
                className="w-full md:w-1/2 lg:w-1/3 xl:w-full mb-10"
              >
                <Postcard post={val} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AuthenticatedHome;
