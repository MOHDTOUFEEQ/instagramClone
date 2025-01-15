import React, { useEffect, useState } from 'react'
import service from '../appwrite/config';
import { useParams } from 'react-router-dom';

function HomeViewBlog() {
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
        <div className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
            <img
                src={service.getFilePreview(post.featuredImage)}
                alt="Featured"
                className="w-full h-64 object-cover rounded-md mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {/* Render other post details here */}

        </div>
    );
}

export default HomeViewBlog