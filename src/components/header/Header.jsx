import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import Logout from "./Logout";
import { Link } from "react-router-dom";
import perfilImage from '../../assets/perfil.png';
import service from "../../appwrite/config";
import service2 from "../../appwrite/config2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
export const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [shouldRenderComponent, setShouldRenderComponent] = useState(false);
  const [SearchUser, setSearchUser] = useState([]);
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const isBigScreen = useMediaQuery({ minWidth: 767 });
  /*=============== CHANGE BACKGROUND HEADER ===============*/
  function scrollHeader(){
      const header = document.getElementById('header')
      // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
      if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
  }
  window.addEventListener('scroll', scrollHeader)
  useEffect(() => {
    const handleResize = () => {
      setShouldRenderComponent(window.innerWidth > 767);
    };
    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const search_button = ()=>{
    const search_navbar = document.querySelector(".search_extend");
    const header = document.querySelector(".header");
    if (window.innerWidth > 767) {
        if (search_navbar.style.width === "25vw") {
            search_navbar.style.width = "0vw";
            header.style.width = "15vw";
            search_navbar.style.borderRight = "0px solid #dfdfdf"
        } else {
            search_navbar.style.width = "25vw";
            header.style.width = "5vw";
            search_navbar.style.borderRight = "1px solid #dfdfdf"
        }
    }
  }
  const home_button = () => {
    const search_navbar = document.querySelector(".search_extend");
    const search_bottom = document.querySelector(".search_bottom");
    const header = document.querySelector(".header");

    
    if (window.innerWidth > 767) {
      if (search_navbar.style.width === "25vw") {
        console.log("up");
        search_navbar.style.width = "0vw";
        header.style.width = "15vw";
        search_navbar.style.borderRight = "0px solid #dfdfdf";
      } else {
        search_bottom.style.display = "none";
        search_navbar.style.width = "25vw";
        search_navbar.style.borderRight = "1px solid #dfdfdf";
        header.style.width = "5vw";
      }
    }
  };
  const search_button_off = ()=>{
    const search_navbar = document.querySelector(".search_extend");
    const header = document.querySelector(".header");
    search_navbar.style.width = "0vw";
    header.style.width = "15vw";
    search_navbar.style.borderRight = "0px solid #dfdfdf";
  }
  const messsage_button__on = ()=>{
    console.log("clicking on message");
    const header = document.querySelector(".header");
    header.style.width = "5vw";
  }
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      if (searchValue.length > 0) {
        try {
          const getting_user = await service2.getuser(searchValue);
          if (getting_user) {
              setSearchUser(()=> getting_user.documents)
              console.log(SearchUser);
          } else {
            console.log("no user found");
          }
          if (searchValue.length == 0) {
            setSearchUser("")
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchData();
  }, [searchValue]);

 
  const hideSidebar = ()=>{
    search_button_off()
  }
  return (
    <>
    {isBigScreen && (
      <header className="header header1 sm:width-screen" id="header">
  <nav className="nav container">
    <Link className="nav__logo">Blog</Link>

    <div className="nav__menu" id="nav-menu">
      <ul className="nav__list">
        <li className="nav__item Home">
          <Link></Link>
          <Link to="/" onClick={home_button} style={{ display: "flex" }} className="nav__link Home">
            <i className='bx bx-home-alt nav__icon'></i>
            <span className="nav__name">Home</span>
          </Link>
        </li>
        {authStatus && isBigScreen ?
          (<li className="nav__item" onClick={search_button}>
            <a className="nav__link search">
              <i className='bx bx-user nav__icon'></i>
              <span className="nav__name">search</span>
            </a>
          </li>) : null
        }
        {authStatus && isSmallScreen ?
          (
            <Link to={"/search"}>
              <li className="nav__item">
                <span className="nav__link search">
                  <i className='bx bx-user nav__icon'></i>
                  <span className="nav__name">Search</span>
                </span>
              </li>
            </Link>
          ) : null
        }
        {authStatus ?
          (<li className="nav__item create">
            <Link to="/create-post1" onClick={search_button_off} className="nav__link create">
              <i className='bx bx-message-square-detail nav__icon'></i>
              <span className="nav__name">Create</span>
            </Link>
          </li>) : null
        }
       {authStatus ? (
          <li className="nav__item create">
            <Link to="/chatting" onClick={messsage_button__on} className="nav__link create">
              <i className='bx bx-envelope nav__icon'></i>
              <span className="nav__name">Message</span>
            </Link>
          </li>
        ) : null}

        {authStatus ? (<li className="nav__item">
          <Link to="/profile" className="nav__link profile" onClick={search_button_off}>
            <i className='bx bx-book-alt nav__icon'></i>
            <span className="nav__name">Profile</span>
          </Link>
        </li>) : null}
        {!authStatus ? (<li className="nav__item login">
          <Link to="/login" className="nav__link login">
            <i className='bx bx-book-alt nav__icon'></i>
            <span className="nav__name">Login</span>
          </Link>
        </li>) : null}
        {!authStatus ? (<li className="nav__item signup">
          <Link to="/Sign-up" className="nav__link signup" onClick={search_button_off}>
            <i className='bx bx-book-alt nav__icon'></i>
            <span className="nav__name">Signup</span>
          </Link>
        </li>) : null}

        {authStatus ?
          <Logout /> : null
        }
      </ul>

    </div>

    <img src={perfilImage} alt="" className="nav__img" />
  </nav>
      </header> 
)}
{isSmallScreen && (
      <header className="header header1 sm:width-screen" id="header">
  <nav className="nav container justify-center" style={{justifyContent:'center'}}>
    <a className="nav__logo text-bold">Messenger</a>

    <div className="nav__menu" id="nav-menu">
      <ul className="nav__list">
        <li className="nav__item Home">
          <Link></Link>
          <Link to="/" onClick={home_button} style={{ display: "flex" }} className="nav__link Home">
            <i className='bx bx-home-alt nav__icon'></i>
            <span className="nav__name">Home</span>
          </Link>
        </li>
        {authStatus && isSmallScreen ?
          (
            <Link to={"/search"}>
              <li className="nav__item">
                <span className="nav__link search">
                  <i className='bx bx-user nav__icon'></i>
                  <span className="nav__name">Search</span>
                </span>
              </li>
            </Link>
          ) : null
        }
        {authStatus ?
          (<li className="nav__item create">
            <Link to="/create-post1" onClick={search_button_off} className="nav__link create">
              <i className='bx bx-message-square-detail nav__icon'></i>
              <span className="nav__name">Create</span>
            </Link>
          </li>) : null
        }
        {authStatus ? (
          <li className="nav__item create">
            <Link to="/chatting_mobile"  className="nav__link create">
              <i className='bx bx-envelope nav__icon'></i>
              <span className="nav__name">Message</span>
            </Link>
          </li>
        ) : null}
        {authStatus ? (<li className="nav__item">
          <Link to="/profile" className="nav__link profile" onClick={search_button_off}>
            <i className='bx bx-book-alt nav__icon'></i>
            <span className="nav__name">Profile</span>
          </Link>
        </li>) : null}
        {!authStatus ? (<li className="nav__item login">
          <Link to="/login" className="nav__link login">
            <i className='bx bx-book-alt nav__icon'></i>
            <span className="nav__name">Login</span>
          </Link>
        </li>) : null}
        {!authStatus ? (<li className="nav__item signup">
          <Link to="/Sign-up" className="nav__link signup" onClick={search_button_off}>
            <i className='bx bx-book-alt nav__icon'></i>
            <span className="nav__name">Signup</span>
          </Link>
        </li>) : null}

        {authStatus ?
          <Logout /> : null
        }
      </ul>

    </div>

  </nav>
</header>
)}
{shouldRenderComponent ?

  <div className="search_extend" style={{ position: "fixed", height: '100vh' }} >
    <div className="search_header">
      <div className="search_header_top">
        <h1>Search</h1>
      </div>
      <div className="search_header_down">

        <FontAwesomeIcon icon={faSearch} className="search_logo " />
        <input onChange={(e) => setSearchValue(e.target.value)} className="search_input" placeholder="Search" style={{ padding: '10px' }} type="text" name="" id="query_input" />
      </div>
    </div>
    <div className="search_bottom bg-white" style={{ backgroundColor: "white" }}>
      {SearchUser ? SearchUser.map((user) => (
        <div key={user.userID} onClick={hideSidebar}>
          {user.userID === userData.$id ? (
            <Link to="/profile">
              <div className="user_overall">
                <div className="user_top">
                  {user.ProfilePic ? (
                    <img src={service.getFilePreview(user.ProfilePic) || "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="" />
                  ) : (
                    <img src="https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png" alt="" />
                  )}
                </div>
                <div className="user_bottom">
                  <h3>{user.userName}</h3>
                  <h4>{user.Followers} Followers</h4>
                </div>
              </div>
            </Link>
          ) : (
            <Link to={`/profile/${user.userID}`}>
              <div className="user_overall">
                <div className="user_top">
                  {user.ProfilePic ? (
                    <img src={service.getFilePreview(user.ProfilePic) || "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"} alt="" />
                  ) : (
                    <img src="https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png" alt="" />
                  )}
                </div>
                <div className="user_bottom">
                  <h3>{user.userName}</h3>
                  <h4>{user.Followers} Followers</h4>
                </div>
              </div>
            </Link>
          )}
        </div>
      )) : null}
    </div>
  </div>
  : null}
    </>
  );
};







