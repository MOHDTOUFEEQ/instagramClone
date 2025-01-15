import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import { Provider } from 'react-redux'
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import Login from './components/Login.jsx'
import  Home  from './components/Home.jsx'
import Signup from './components/Signup.jsx'
import Protection from './components/protection/Protection.jsx'
import Allblogs from './components/Allblogs.jsx'
import Postform from './components/PostForm/Postform.jsx'
import ViewBlog from './components/ViewBlog.jsx'
import HomeViewBlog from './components/HomeViewBlog.jsx'
import Edit from './components/edit/Edit.jsx'
import Profile from './components/Profile/Profile.jsx'
import UserProfile from './components/UserProfile/UserProfile.jsx'
import EditProfile from './components/Profile/EditProfile.jsx'
import Search_sm from './components/search/Search_sm.jsx'
import Postform1 from './components/PostForm/Postform1.jsx'
import Chatting from './components/chatting/Chatting.jsx'
import Chatting_mobile from './components/chatting/Chatting_mobile.jsx'
import DeptMessage from './components/chatting/DeptMessage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element : <App />,
    children : [
      {
        path: "/",
        element:(
          <Home  />
        ),
        
      },
      {
        path: "/login",
        element:(
          <Login />
        ),
      },
      {
        path: "/Sign-up",
        element:(
          <Signup />
        ),
      }, 
      {
        path: "/all-Blog",
        element:(
          <Protection >

            <Allblogs />
          </Protection>
        ),
      },
      {
        path: "/create-post",
        element:(
          <Protection>
            <Postform/>   
          </Protection>
            
        ),
      }, 
      {
        path: "/create-post1",
        element:(
          <Protection>
            <Postform1 />   
          </Protection>
            
        ),
      }, 
      {
        path : "/all-Blog/:id",
        element:(
          <Protection>
            <ViewBlog/>   
          </Protection>
      ),
      },{
        path: "/homeview/:id",
        element:(
          <Protection>
            <HomeViewBlog />
          </Protection>
        )
      },
      {
        path:"/Edit/:id",
        element:(
          <Edit/>
        )
      } ,    
      {
        path:"/profile",
        element:(
          <Profile />
        )
      },
      {
        path:"/profile/:id",
        element:(
          <UserProfile />
        )
      },
      {
        path: "/editProfile",
        element:(
          <EditProfile />
        )
      },
      {
        path: "/search",
        element:(
          <Search_sm />
        )
      },
      {
        path: "/chatting",
        element:(
          <Chatting />
        )
      },
      {
        path: "/Chatting_mobile",
        element:(
          <Chatting_mobile />
        )
      },
      {
        path: "/DeptMessage/:id",
        element:(
          <DeptMessage />
        )
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
