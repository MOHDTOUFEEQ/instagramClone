import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faShoppingBag, faBars,faBookOpen, faSignOutAlt, faUserPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
function Logout() {
    const dispatch  = useDispatch()
    const navigate = useNavigate()
    const doingLogout = ()=>{
        authService.logout().then(()=>{
            dispatch(logout())
            navigate("/")
        })
        document.querySelector(".search_extend").style.width = "0vw"
        document.querySelector("#header").style.width = "15vw"
        document.querySelector(".search_extend").style.borderRight = "0px";
    }
    return (
        <button onClick={doingLogout}> 
        <Link className='logout_a'>
              <li class="nav__item">
                  <a href="" class="nav__link">
                      <i class='bx bx-message-square-detail nav__icon'></i>
                      <span class="nav__name">Logout</span>
                  </a>
              </li>
          </Link>
           </button>
  )
}

export default Logout