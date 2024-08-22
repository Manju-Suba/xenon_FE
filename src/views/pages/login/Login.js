import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useAuth } from './AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ROLE_LIST } from '../../../constants/constants'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    let errors = {}
    if (!email) {
      errors.email = 'Email is required'
    }
    if (!password) {
      errors.password = 'Password is required'
    }
    return errors
  }

  const onFinish = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      toast.error('Please fill in all fields correctly')
      return
    }

    try {
      const response = await login({ email, password })
      console.log(response)
      if (response.status === 200) {
        let token = response.data.data.Token
        if (token === '') {
          navigate('/')
        } else {
          let role = response.data.data?.role || ''

          const rolen = role.replace(/[^A-Za-z]/g, '')
          if (rolen === ROLE_LIST.CLUSTERS) {
            navigate('/sales-hierarchy')
          } else if (role === ROLE_LIST.CDMO) {
            navigate('/sales-hierarchy')
          } else {
            navigate('/')
          }
        }
        setEmail('')
        setPassword('')
      } else {
        toast.error('Invalid credential')
      }
    } catch (error) {
      toast.error('Invalid credential', error)
      console.error(error)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onFinish}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Username"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 signup-bg" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div></div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
