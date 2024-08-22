import {
  FETCH_SH,
  FETCH_RS,
  FETCH_TARGET,
  FETCH_CLUSTERS,
  FETCH_STATE,
  FETCH_HISTORY,
  FETCH_TS_EXCEL,
} from '../actiontype'
import axiosInstance from '../../constants/Global'
import { ROLE_LIST } from '../../constants/constants'

export const SalesHierarchyImport = (formData, tabhead) => {
  return async (dispatch) => {
    try {
      let url
      if (tabhead === 'Sales') {
        url = `/sales-hierarchy/excel-upload`
      } else if (tabhead === 'Target') {
        url = `/salesman-target/excel-upload`
      } else {
        url = `/rs-target/excel-upload`
      }
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response
    } catch (error) {
      console.error('Error while uploading file:', error)
      throw error
    }
  }
}

export const getAllSHDetails = (page, pageSize, cluster, state, role) => {
  let url
  if (role === ROLE_LIST.CLUSTERS) {
    url = `/sales-hierarchy/fetch-all?page=${page}&size=${pageSize}`
  } else {
    url = `/sales-hierarchy/ctmo-fetch-all?page=${page}&size=${pageSize}`
    if (cluster === 'All' && state === 'All' && cluster === '' && state === '') {
      url += ''
    } else if (cluster !== 'All' && state !== 'All' && cluster !== '' && state !== '') {
      url += `&cluster=${cluster}&state=${state}`
    } else if (cluster === 'All' && state !== 'All' && cluster === '' && state !== '') {
      url += `&state=${state}`
    } else if (cluster !== 'All' && state === 'All' && cluster !== '' && state !== '') {
      url += `&cluster=${cluster}`
    } else {
      url += ``
    }
  }
  return (dispatch) => {
    axiosInstance
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch({
          type: FETCH_SH,
          payload: res.data.data,
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getAllRSDetails = (page, pageSize, cluster, state, role) => {
  let url
  if (role === ROLE_LIST.CLUSTERS) {
    url = `/rs-target/fetch-all?page=${page}&size=${pageSize}`
  } else {
    url = `/rs-target/ctmo-fetch-all?page=${page}&size=${pageSize}`
    if (cluster === 'All' && state === 'All' && cluster === '' && state === '') {
      url += ''
    } else if (cluster !== 'All' && state !== 'All' && cluster !== '' && state !== '') {
      url += `&cluster=${cluster}&state=${state}`
    } else if (cluster === 'All' && state !== 'All' && cluster === '' && state !== '') {
      url += `&state=${state}`
    } else if (cluster !== 'All' && state === 'All' && cluster !== '' && state !== '') {
      url += `&cluster=${cluster}`
    } else {
      url += ``
    }
  }
  return (dispatch) => {
    axiosInstance
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch({
          type: FETCH_RS,
          payload: res.data.data,
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getAllTargetDetails = (page, pageSize, cluster, state, role) => {
  let url
  if (role === ROLE_LIST.CLUSTERS) {
    url = `/salesman-target/fetch-all?page=${page}&size=${pageSize}`
  } else {
    url = `/salesman-target/ctmo-fetch-all?page=${page}&size=${pageSize}`
    if (cluster === 'All' && state === 'All' && cluster === '' && state === '') {
      url += ''
    } else if (cluster !== 'All' && state !== 'All' && cluster !== '' && state !== '') {
      url += `&cluster=${cluster}&state=${state}`
    } else if (cluster === 'All' && state !== 'All' && cluster === '' && state !== '') {
      url += `&state=${state}`
    } else if (cluster !== 'All' && state === 'All' && cluster !== '' && state !== '') {
      url += `&cluster=${cluster}`
    } else {
      url += ``
    }
  }
  return (dispatch) => {
    axiosInstance
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch({
          type: FETCH_TARGET,
          payload: res.data.data,
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getAllClusterDetails = () => {
  let url = `/common/fetch-cluster`

  return (dispatch) => {
    axiosInstance
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch({
          type: FETCH_CLUSTERS,
          payload: res.data.data,
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getAllStateDetails = (cluster) => {
  let url = `/common/fetch-state-by-cluster?cluster=${cluster}`

  return (dispatch) => {
    axiosInstance
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch({
          type: FETCH_STATE,
          payload: res.data.data,
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getAllHistoryDetails = (page, pageSize) => {
  let url = `/common/fetchall-excel-history?page=${page}&size=${pageSize}`

  return (dispatch) => {
    axiosInstance
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch({
          type: FETCH_HISTORY,
          payload: res.data.data,
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getExcelByClusterDetails = (cluster, Ftype) => {
  let url = `/common/ctmo-cluster-wise-download?cluster=${cluster}&excelType=${Ftype}`

  return async (dispatch) => {
    const response = await axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response
  }
}

export const getExcelTSCluster = () => {
  let url = `/salesman-target/download/sales-target`

  return async (dispatch) => {
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
    })
    return response
  }
}

export const updatePassword = (formData) => {
  let url = `/common/change-password`
  return async (dispatch) => {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response
  }
}
