import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import PropTypes from 'prop-types'

const PrivateRoute = ({ children }) => {
  const [cookies] = useCookies(['role', 'token'])
  const token = cookies?.token

  return token ? children : <Navigate to="/login" />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrivateRoute
