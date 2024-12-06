import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route } from "react-router-dom"


const ProtectedRoute = ({Component}) => {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user)
    return (
        <Fragment>
          { loading===false
            

            && (isAuthenticated===true ? <Component/> :<Navigate to="/login"/>)
          }
        </Fragment>
    )
}

export default ProtectedRoute