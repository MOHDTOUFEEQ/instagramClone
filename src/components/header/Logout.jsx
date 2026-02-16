import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
function Logout() {
    const dispatch  = useDispatch()
    const navigate = useNavigate()
    const doingLogout = ()=>{
        console.log("hii");
        
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
        <span className='logout_a'>
              <li className="nav__item">
                  <Link  className="nav__link">
                      <i className='bx bx-message-square-detail nav__icon'></i>
                      <span className="nav__name">Logout</span>
                  </Link>
              </li>
          </span>
           </button>
  )
}

export default Logout