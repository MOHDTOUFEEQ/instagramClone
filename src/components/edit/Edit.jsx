import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import service from '../../appwrite/config';

function Edit() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [post, setPost] = useState(null);
    useEffect(() => {
        service.getPost(id).then((data) => setPost(data));
    }, [id]);
    const { register, handleSubmit,setValue,watch} = useForm({
        defaultValues: {
            title:  '',
            slug: '', // Provide a default value or remove this line if not needed
            status: '', // Provide a default value or remove this line if not needed
            content: '', // Provide a default value or remove this line if not needed
        },
    });
    const watch_value = watch("title")
    useEffect(()=>{
        function slugTransformation(value) {
            const transformedValue = value.replace(/\s+/g, '-');
            setValue("slug",transformedValue,{required:true})
        }
        slugTransformation(watch_value)
    },[watch_value])

    useEffect(() => {
        if (post) {
            setValue('title', post.title);
            setValue('slug', post.$id);
            setValue('status', post.status);
            setValue('content', post.content);
            // Set other form values if needed
            }
        }, [post, setValue]);

        const onSubmit = async (data) => {
            try {
                if (data && data.image && data.image.length > 0) {
                    const img = data.image[0];
                    // Assuming service.uploadFile returns a promise
                    const img_data = await service.uploadFile(img);
                    await service.deleteFile(post.featuredImage);
                    if (img_data && img_data.$id) {
                        data.featuredImage = img_data.$id;
        
                        // Assuming service.updatePost returns a promise
                        const updating = await service.updatePost(post.$id, { ...data });
        
                        if (updating) {
                            // Assuming navigate is a function for navigation
                            navigate("/");
                        } else {
                            console.log('Failed to update post.');
                        }
                    } else {
                        console.log('Failed to upload image.');
                    }
                
                }
                else if(data){
                     await service.updatePost(post.$id, { ...data }).then((data)=>{
                        if (data) {
                            // Assuming navigate is a function for navigation
                            navigate("/");
                        } else {
                            console.log('Failed to update post.');
                        }
                    });
        
                    
                }
                else {
                    console.log('No image selected.');
                }
            } catch (error) {
                console.error('Error while editing the form:', error);
            }
        };
        

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                        {...register('title', { required: true })}
                    />
                </div>

                <div>
                    <input
                        type="text"
                        id="slug"
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                        hidden
                        {...register('slug', { required: true })}
                        disabled
                    />
                </div>

                {post &&
                    <div>
                        <img className='h-1/4 w-1/4' src={service.getFilePreview(post.featuredImage)} alt="Preview"/>
                    </div>
                }

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        className="mt-1 p-2 w-full border rounded-md"
                        accept="image/*"
                        {...register('image')}
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        className="mt-1 p-2 w-full border rounded-md"
                        rows="8"
                        required
                        {...register('content', { required: true })}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Edit;
