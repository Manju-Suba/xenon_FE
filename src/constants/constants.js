// export const API_BASE_URL = 'http://localhost:8082'
// export const API_AUTH_URL = 'http://localhost:8082'
export const API_BASE_URL = 'https://dev.cavinkare.in/xenonbe'
export const API_AUTH_URL = 'https://dev.cavinkare.in/xenonbe'
export const BASE_URL = 'http://localhost:3001/'
// export const UPLOAD_URL =
//   'http://localhost/xenon-backend/xenon/src/main/resources/static/assets/uploads/'
export const UPLOAD_URL =
  'https://dev.cavinkare.in/xenon/xenon_be/src/main/resources/static/assets/uploads/'

// Testing demo
export const QR_PORT = 'asset_management_react'

// QA
// export const QR_PORT = 'asset_management';

const token = localStorage.getItem('token') || ''
let decoded
if (token === '') {
  decoded = ''
} else {
  decoded = JSON.parse(atob(token.split('.')[1]))
}
export const DECODE_USER = decoded || ''
export const ROLE = decoded?.role?.[0]?.authority || ''
export const USER = decoded?.username || ''
export const USER_MAIL = decoded?.email || ''
export const USER_PLANT = decoded?.plant || ''
export const USER_DOMAIN = decoded?.domian || ''
export const REFRESH_TOKEN = decoded?.refreshToken || ''
export const COMPANY_ID = decoded?.companyId || ''
export const USER_DATA = decoded || ''
export const ACCESS_TOKEN = token || ''

export const PERMISSIONS = {
  CAN_VIEW_SH_LIST: 'view_sh_list',
  CAN_VIEW_RS_LIST: 'view_rs_list',
  CAN_VIEW_ST_LIST: 'view_st_list',
  CAN_VIEW_HISTORY: 'view_history',
  CAN_VIEW_NONE: 'view_none',
}

export const ROLE_LIST = {
  ADMIN: 'Admin',
  CLUSTER: 'Cluster 1',
  CLUSTER2: 'Cluster 2',
  CLUSTER3: 'Cluster 3',
  CLUSTER4: 'Cluster 4',
  CLUSTER5: 'Cluster 5',
  CLUSTER6: 'Cluster 6',
  CLUSTER7: 'Cluster 7',
  CLUSTER8: 'Cluster 8',
  CLUSTER9: 'Cluster 9',
  CLUSTER10: 'Cluster 10',
  CLUSTER11: 'Cluster 11',
  CLUSTER12: 'Cluster 12',
  CLUSTERS: 'Cluster',
  CDMO: 'CTMO',
}
export const STATUS_ASSET = {
  SCRAPPED: 'Scrapped',
  ONLINE: 'Online',
  OFFLINE: 'Offline',
}
