import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import { updatePassword } from 'src/redux/sales/action'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [confirmShowPassword, setConfirmShowPassword] = useState(false)

  const dispatch = useDispatch()

  const resetForm = () => {
    setPassword('')
    setConfirmPassword('')
    setErrors({})
  }

  const validate = () => {
    let errors = {}
    if (!password) {
      errors.password = 'Password is required'
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Password & Confirm Password do not match'
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

    const formData = new FormData()
    formData.append('password', password)
    formData.append('confirmPassword', confirmPassword)

    try {
      const response = await dispatch(updatePassword(formData))
      if (response.status === 200) {
        resetForm()
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error during update password:', error)
      toast.error(error.response?.data?.message || 'Error during update password')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const togglePasswordVisibility2 = () => {
    setConfirmShowPassword(!confirmShowPassword)
  }

  return (
    <CRow>
      <CCol xs={7}>
        <CCard className="mb-4">
          <ToastContainer />
          <CCardHeader>
            <strong>Change Password</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={onFinish}>
              <p className="text-medium-emphasis">Reset your password here!</p>
              <CCol xs={6}>
                <CInputGroup className="mb-4">
                  {/* <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText> */}
                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  <CInputGroupText onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </CInputGroupText>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </CInputGroup>
                <CInputGroup className="mb-4">
                  {/* <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText> */}
                  <CFormInput
                    type={confirmShowPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <CInputGroupText
                    onClick={togglePasswordVisibility2}
                    style={{ cursor: 'pointer' }}
                  >
                    {confirmShowPassword ? <FaEye /> : <FaEyeSlash />}
                  </CInputGroupText>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </CInputGroup>
              </CCol>

              <CRow>
                <CCol xs={6}>
                  <CButton color="primary" className="px-4" type="submit">
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ChangePassword
