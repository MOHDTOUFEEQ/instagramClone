import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import service from '../../appwrite/config';
import service2 from '../../appwrite/config2';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import { successfully } from '../../store/authSlice';

function EditProfile() {
    const { register, handleSubmit} = useForm();
    const userData = useSelector((state) => state.auth.userData);
    const [data, setData] = useState(null);
    const [name, setName] = useState("");
    const [bio , setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [curr_user, set_curr_user] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch();
    useEffect(() => {
        if (userData) {
            setData(userData);
          }
          
          async function editprof() {
            service2.getcurrUser(userData.$id)
            .then((response) => {
                set_curr_user(response.documents[0]);
                setName(response.documents[0].userName);
                setBio(response.documents[0].Bio);
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
        }

        editprof();
    }, [userData.$id]);

    const onSubmit = async (formData) => {
      try {
          setLoading(true);

          if (formData.name !== "" && formData.name !== userData.userName) {
              const a = await authService.updatename(formData.name);

              if (a) {
                  if (formData.profilePhoto.length >= 1) {
                      if (curr_user.ProfilePic && curr_user.ProfilePic.length > 1) {
                          await service.deleteFile(curr_user.ProfilePic);
                      }

                      const file = formData.profilePhoto[0];
                      const successUploaded = await service.uploadFile(file);

                      if (successUploaded) {
                          const profilePicId = successUploaded.$id;
                          const obj1 = {
                              ProfilePic: profilePicId
                          };
                          await service2.updateProfilePic(userData.$id, obj1);
                      }
                  }

                  const obj = {
                      userName: formData.name
                  };

                  await service2.updateUserName(userData.$id, obj);
              }
          }

          if (formData.Bio !== "" && formData.Bio !== userData.Bio) {
              if (formData.profilePhoto.length >= 1) {
                  if (curr_user.ProfilePic && curr_user.ProfilePic.length > 1) {
                      await service.deleteFile(curr_user.ProfilePic);
                  }

                  const file = formData.profilePhoto[0];
                  const successUploaded = await service.uploadFile(file);

                  if (successUploaded) {
                      const profilePicId = successUploaded.$id;
                      const obj1 = {
                          ProfilePic: profilePicId
                      };
                      await service2.updateProfilePic(userData.$id, obj1);
                  }
              }

              const obj = {
                  Bio: formData.Bio
              };

              await service2.updateBio(userData.$id, obj);
          }

          setLoading(false);
          dispatch(successfully({ messageStatus: true, message: "Profile updated successfully!" }));
          navigate("/profile")
      } catch (error) {
          console.error("Error handling form submission:", error);
          setLoading(false);
      }
  };
  

    return (
    <>
      <div style={{ backgroundColor: '#fffs' }} className="sm:mx-32 lg:mx-32 xl:mx-72 xl:w-screen/2 ">
        <div className="flex justify-between container mx-auto">
          <div className="w-full">
            <div className="mt-4 px-4">
              <h1 className="text-3xl font-semibold py-7 px-5">Edit Profile</h1>

              <form className="mx-5 my-5" onSubmit={handleSubmit(onSubmit)}>
                
              <div className="shrink-0 mb-5">
                  {curr_user ? 
                    <img className="h-20 w-20 object-cover rounded-full"  src={service.getFilePreview(curr_user.ProfilePic) || "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="Current profile photo" /> :   
                    <img className="h-20 w-20 object-cover rounded-full" src="https://sahilnetic.xyz/sahilnetic.png" alt="Current profile photo" /> 
                  }
                </div>

                <label className="block pt-2 mb-3">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    {...register('profilePhoto')}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-300 file:text-zinc-900 hover:file:bg-rose-300"
                  />
                </label>

                <label className="relative block p-3 border-2 border-black rounded" htmlFor="name">
                  <span className="text-md font-semibold text-zinc-900">Name</span>
                  <input
                    {...register('name')}
                    className="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                    value={name ? name : ''}
                    id="name"
                    onChange={(e)=> setName(e.target.value)}
                    type="text"
                    placeholder="Your name"
                  />
                </label>


                <label className="relative block p-3 border-2 mt-5 border-black rounded" htmlFor="bio">
                  <span className="text-md font-semibold text-zinc-900">Bio</span>
                  <input
                    {...register('bio')}
                    className="w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none"
                    id="bio"
                    value={bio ? bio : null}
                    type="text"
                    onChange={(e)=> setBio(e.target.value)}
                    placeholder="Write Your Bio"
                  />
                </label>

                <label className="relative block p-3 border-2 mt-5 border-black rounded" htmlFor="gmail">
                  <span className="text-md font-semibold text-zinc-900">Gmail</span>
                  <input
                    {...register('email')}
                    className="w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none"
                    readOnly
                    value={data ? userData.email : ''}
                    id="gmail"
                    type="text"
                    placeholder="Your Gmail"
                  />
                </label>

                <button
                                    className={`mt-5 border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black translate-y-2 border-l-4 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-700'
                                    }`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Making Changes...' : 'Submit'}
                                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
