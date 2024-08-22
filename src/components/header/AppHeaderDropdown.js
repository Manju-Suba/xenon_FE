import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockUnlocked, cilAccountLogout, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useAuth } from '../../views/pages/login/AuthContext'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const { logout } = useAuth()
  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.status === 200) {
        Navigate('/')
      }
    } catch (error) {
      // toast.error('Unable Logout', error)
      console.log(error)
    }
  }

  // const navigate = useNavigate();

  const handleChangePassword = (event) => {
    event.preventDefault() // Prevent the default action to avoid full page reload
    navigate('/change-password')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem> */}
        <CDropdownItem href="#" onClick={handleChangePassword}>
          <CIcon icon={cilLockUnlocked} className="me-2" />
          Change Password
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleLogout}>
          {/* <CIcon icon={cilLockLocked} className="me-2" /> */}
          <CIcon icon={cilAccountLogout} className="me-2" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
