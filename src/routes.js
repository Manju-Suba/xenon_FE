import React from 'react'
import SalesHierarchy from './views/pages/SalesHierarchy'
import Target from './views/pages/Target'
import RSwiseTarget from './views/pages/RSwiseTarget'
import Historylog from './views/pages/Historylog'
import ChangePassword from './views/pages/login/ChangePassword'

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/sales-hierarchy', name: 'Sales Hierarchy', element: SalesHierarchy },
  { path: '/target', name: 'Salesman Target', element: Target },
  { path: '/rs-wise-target', name: 'RS Wise Target', element: RSwiseTarget },
  { path: '/history-log', name: 'History Log', element: Historylog },
  { path: '/change-password', name: 'Change Password', element: ChangePassword },
]

export default routes
