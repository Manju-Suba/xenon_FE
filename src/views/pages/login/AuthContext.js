import React, { createContext, useContext, useState, useMemo } from 'react'
import { useCookies } from 'react-cookie'
import axiosInstance from '../../../constants/Global'
import { PERMISSIONS, API_AUTH_URL, ROLE_LIST } from '../../../constants/constants'
import axios from 'axios'
import PropTypes from 'prop-types'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies()
  const [user, setUser] = useState({
    username: '',
    permissions: [],
  })

  const login = async (formData) => {
    try {
      const response = await axios.post(API_AUTH_URL + '/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        const token = response.data.data.Token
        if (token === '') {
          return false
        } else {
          let role = response.data.data?.role || ''
          let username = response.data.data?.name || ''
          localStorage.setItem('token', token)
          setCookie('token', token)
          setCookie('role', role)
          let alphaOnly = role.replace(/[^A-Za-z]/g, '')
          if (role === ROLE_LIST.CDMO) {
            setUser({
              username: username,
              permissions: [
                PERMISSIONS.CAN_VIEW_SH_LIST,
                PERMISSIONS.CAN_VIEW_RS_LIST,
                PERMISSIONS.CAN_VIEW_ST_LIST,
                PERMISSIONS.CAN_VIEW_HISTORY,
              ],
            })
            setCookie('permissions', [
              PERMISSIONS.CAN_VIEW_SH_LIST,
              PERMISSIONS.CAN_VIEW_RS_LIST,
              PERMISSIONS.CAN_VIEW_ST_LIST,
            ])
          } else if (alphaOnly === ROLE_LIST.CLUSTERS) {
            setUser({
              username: username,
              permissions: [
                PERMISSIONS.CAN_VIEW_SH_LIST,
                PERMISSIONS.CAN_VIEW_RS_LIST,
                PERMISSIONS.CAN_VIEW_ST_LIST,
              ],
            })
            setCookie('permissions', [
              PERMISSIONS.CAN_VIEW_SH_LIST,
              PERMISSIONS.CAN_VIEW_RS_LIST,
              PERMISSIONS.CAN_VIEW_ST_LIST,
            ])
          } else {
            setUser({
              username: username,
              permissions: [PERMISSIONS.CAN_VIEW_NONE],
            })
            setCookie('permissions', [PERMISSIONS.CAN_VIEW_NONE])
          }
        }
      } else {
        throw new Error('Login failed')
      }

      return response
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await axiosInstance.post(
        `/auth/logout`,
        {},
        {
          headers: {},
        },
      )
      if (response.status === 200) {
        window.localStorage.clear()
        localStorage.removeItem('token')
        ;['token', 'permissions'].forEach((obj) => removeCookie(obj))
        Object.keys(cookies).forEach((cookieName) => {
          removeCookie(cookieName, { path: '/' })
        })
      }
      return response
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  const value = useMemo(
    () => ({
      user,
      cookies,
      login,
      logout,
    }),
    [cookies],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
