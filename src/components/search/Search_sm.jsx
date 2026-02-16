import  { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import service2 from '../../appwrite/config2';
import { useSelector } from 'react-redux';
import service from '../../appwrite/config';

function SearchSm() {
  const userData = useSelector((state) => state.auth.userData);
  const [searchValue, setSearchValue] = useState("");
  const [searchUser, setSearchUser] = useState([]);

  // useEffect(() => {
  //   if (isSmallScreen && location.pathname === "/search") {
  //     document.querySelector(".nav__logo").style.display = "none";
  //     document.querySelector(".nav__img").style.display = "none";
  //   } else {
  //     document.querySelector(".nav__logo").style.display = "block";
  //     document.querySelector(".nav__img").style.display = "block";
  //   }
  // }, [isSmallScreen, location]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchValue.length > 0) {
        try {
          const getting_user = await service2.getuser(searchValue);
          if (getting_user) {
            setSearchUser(() => getting_user.documents);
          } else {
          }
        } catch (error) {
        }
      }
    };

    fetchData();
  }, [searchValue]);

  return (
    <>
      <div className="flex items-center max-w-md mx-auto bg-white rounded-lg">
        <div className="w-full">
          <input
            type="search"
            className="w-full px-4 py-2 text-gray-800 rounded-full focus:outline-none bg-[#efefef]"
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          
        </div>
      </div>
      {searchValue === "" ? (
        <p className="text-gray-500 text-center mt-8">
        Please enter a username to search
      </p>
      
      ) : (
        <div className="search_bottom bg-white" style={{ backgroundColor: "white" }}>
          {searchUser.length > 0 ? (
            searchUser.map((user) => (
              <div key={user.userID} className="user_overall">
                {user.userID === userData.$id ? (
                  <Link to="/profile" className="flex items-center">
                    <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: "2vw", width: '90vw', paddingLeft: "5vw", marginTop: "3vh" }}>
                      <div className="user_top" style={{ width: '20%' }}>
                        {user.ProfilePic ? (
                          <img
                            src={service.getFilePreview(user.ProfilePic)}
                            alt=""
                            style={{ width: '67px', height: '67px', objectFit: 'fill', borderRadius: "50%" }}
                          />
                        ) : (
                          <img
                            src="https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                            alt=""
                            style={{ width: '67px', height: '67px', objectFit: 'cover', borderRadius: "50%" }}
                          />
                        )}
                      </div>
                      <div className="user_bottom" style={{ width: '80%' }}>
                        <h3>{user.userName}</h3>
                        <h4>{user.Followers} Followers</h4>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link to={`/profile/${user.userID}`} className="flex items-center">
                    <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: "2vw", width: '90vw', paddingLeft: "5vw", marginTop: "3vh" }}>
                      <div className="user_top" style={{ width: '20%' }}>
                        {user.ProfilePic ? (
                          <img
                            src={service.getFilePreview(user.ProfilePic)}
                            alt=""
                            style={{ width: '67px', height: '67px', objectFit: 'fill', borderRadius: "50%" }}
                          />
                        ) : (
                          <img
                            src="https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                            alt=""
                            style={{ width: '67px', height: '67px', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div className="user_bottom" style={{ width: '80%' }}>
                        <h1 style={{ fontSize: "1.2rem", fontWeight: "500" }}>{user.userName}</h1>
                        <h4>{user.Followers} Followers</h4>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="text-center mt-8">
            <img
              src="https://cdn2.iconfinder.com/data/icons/delivery-and-logistic/64/Not_found_the_recipient-no_found-person-user-search-searching-4-512.png" // Replace with an image URL or use a placeholder
              alt="No Users Found"
              style={{height:"200px",objectFit:"contain",borderRadius:"50%"}}
              className="mx-auto w-1/2"
            />
            <p className="text-gray-500 mb-2">No users found</p>
          </div>
          )}
        </div>
      )}
    </>
  );
}

export default SearchSm;
