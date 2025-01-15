import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NonAuthenticatedUser from '../NonAuthenticatedUser'

function Protection({children,authentication = true}) {
    const curr_user = useSelector((state)=>state.auth.status)
    const [loader,setLoader] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        if (authentication && curr_user !== authentication) {
          navigate('/login');
        } else {
          setLoader(false);
        }
      }, [authentication, curr_user, navigate]);

    return loader ? <NonAuthenticatedUser /> : <>{children}</>
}

export default Protection