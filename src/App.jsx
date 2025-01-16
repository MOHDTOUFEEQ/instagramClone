import './App.css'
import { Header } from './components/header/Header'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  const location = useLocation();
  const searchNavLink = document.querySelector(".search");
  if (searchNavLink && location.pathname === "/search") {
    searchNavLink.style.color = "#5abcb2";
  }

  return !loading ? (
      <>
        <Header />
        <Outlet />
     </>
        ) : null
}

export default App
