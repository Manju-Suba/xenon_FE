import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilLan, cilAvTimer, cilBuilding, cilSpreadsheet } from '@coreui/icons'
import { CNavItem } from '@coreui/react'
import { useCookies } from 'react-cookie'
import { ROLE_LIST } from './constants/constants'

const useNavItems = () => {
  const [cookies] = useCookies(['role'])
  let _nav = []
  if (cookies?.role?.replace(/[^A-Za-z]/g, '') === ROLE_LIST.CLUSTERS) {
    _nav = [
      {
        component: CNavItem,
        name: 'Sales Hierarchy',
        to: '/sales-hierarchy',
        icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Salesman Target',
        to: '/target',
        icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'RS Wise Target',
        to: '/rs-wise-target',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      },
    ]
  } else if (cookies?.role?.replace(/[^A-Za-z]/g, '') === ROLE_LIST.CDMO) {
    _nav = [
      {
        component: CNavItem,
        name: 'Sales Hierarchy',
        to: '/sales-hierarchy',
        icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Salesman Target',
        to: '/target',
        icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'RS Wise Target',
        to: '/rs-wise-target',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'History Log',
        to: '/history-log',
        icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,
      },
    ]
  } else {
    _nav = [
      {
        component: CNavItem,
        name: 'Home',
        to: '/login',
        icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
      },
    ]
  }
  return _nav
}

export default useNavItems
