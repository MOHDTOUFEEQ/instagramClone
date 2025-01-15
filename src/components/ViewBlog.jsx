import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import service from '../appwrite/config';
function ViewBlog() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        service.getPost(id)
            .then((curr_post) => {
                setPost(curr_post);
                console.log(curr_post);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [id]);
    
    const handleDelete = () => {
        service.deletePost(id).then(() => service.deleteFile(post.featuredImage)).then(()=>navigate("/"));
    };

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-8">Error: {error.message}</p>;
    }

    return (
        <div className="main-container max-w-2xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
            <img
                src={service.getFilePreview(post.featuredImage)}
                alt="Featured"
                className="w-full h-64 object-cover rounded-md mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {/* Render other post details here */}
            
            <div className="flex justify-end">
                <Link to={`/Edit/${id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded">
                    Edit
                </Link>
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ViewBlog;
