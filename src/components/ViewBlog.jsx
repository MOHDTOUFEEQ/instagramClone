import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../appwrite/config';
function ViewBlog() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        service.getPost(id)
            .then((curr_post) => {
                setPost(curr_post);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [id]);
    
   

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-8">Error: {error.message}</p>;
    }

    return (
        <div className="main-container max-w-2xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
            <img
                src={service.getFilePreview(post.featuredImage) || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18'%3ENo image%3C/text%3E%3C/svg%3E"}
                alt="Featured"
                className="w-full h-64 object-cover rounded-md mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {/* Render other post details here */}
            
            
        </div>
    );
}

export default ViewBlog;
