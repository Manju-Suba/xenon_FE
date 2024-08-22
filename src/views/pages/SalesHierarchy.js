import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormSelect, CRow } from '@coreui/react'
import ImportModal from './modal/ImportModal'
import { Table } from 'antd'
import salesh from '../../assets/sample/SalesHierarchyTarget.xlsx'
import {
  getAllSHDetails,
  getAllClusterDetails,
  getAllStateDetails,
  getExcelByClusterDetails,
} from '../../redux/sales/action'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCloudUpload } from '@coreui/icons'
import { ROLE_LIST, UPLOAD_URL } from 'src/constants/constants'
import { toast, ToastContainer } from 'react-toastify'
import debounce from 'lodash.debounce'

const SalesHierarchy = () => {
  const dispatch = useDispatch()
  const [shdata, setData] = useState([])
  const hasMoreRef = useRef(true)
  const tableBodyRef = useRef(null)
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const clusterRef = useRef('All')

  const [cookies] = useCookies(['role'])
  const [visible, setVisible] = useState(false)
  const SalesHierarchy = useSelector(
    (state) => state.saleshierarchyData && state.saleshierarchyData.saleHData,
  )
  const clusterData = useSelector(
    (state) => state.saleshierarchyData && state.saleshierarchyData.ClustersData,
  )
  const stateData = useSelector(
    (state) => state.saleshierarchyData && state.saleshierarchyData.StateData,
  )

  const [cluster, setCluster] = useState('All')
  const [stateName, setSateName] = useState('All')
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: '#',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'SMCode',
      dataIndex: 'smCode',
      key: 'smCode',
    },
    {
      title: 'SMSysName',
      dataIndex: 'smSysName',
      key: 'smSysName',
    },
    {
      title: 'ZM',
      dataIndex: 'zm',
      key: 'zm',
    },
    {
      title: 'ZM ID',
      dataIndex: 'zmId',
      key: 'zmId',
    },
    {
      title: 'AMName',
      dataIndex: 'amName',
      key: 'amName',
    },
    {
      title: 'AM ID',
      dataIndex: 'amId',
      key: 'amId',
    },
    {
      title: 'TSOName',
      dataIndex: 'tsoName',
      key: 'tsoName',
    },
    {
      title: 'TSO ID',
      dataIndex: 'tsoId',
      key: 'tsoId',
    },
  ]

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current // Calculate the start index based on the page number
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1, // Generating serial number with the correct offset
    }))
  }

  useEffect(() => {
    if (SalesHierarchy && SalesHierarchy.length > 0) {
      const dataWithSerialNumbers = addSerialNumbers(SalesHierarchy)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
    } else {
      hasMoreRef.current = false
    }
    setLoading(false)
  }, [SalesHierarchy])

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        fetchMoreData()
      }
    }, 100),
    [],
  )

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(
        getAllSHDetails(pageRef.current, sizeRef.current, clusterRef.current, stateName, role),
      )
    }
  }

  useEffect(() => {
    const tableBody = document.querySelector('.ctmo-sales-hierarchy .ant-table-body')
    if (tableBody) {
      tableBodyRef.current = tableBody
      tableBody.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (tableBody) {
        tableBody.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  const [isImportButtonEnabled, setIsImportButtonEnabled] = useState(false)
  const role = cookies.role.replace(/[^A-Za-z]/g, '')

  useEffect(() => {
    setLoading(true)
    pageRef.current = 0
    setData([])
    hasMoreRef.current = true

    dispatch(getAllClusterDetails())
    dispatch(getAllSHDetails(pageRef.current, sizeRef.current, clusterRef.current, stateName, role))
    const checkDay = () => {
      const today = new Date()
      const dayOfWeek = today.getDay() // getDay() returns 0 for Sunday, 1 for Monday, and so on

      if (dayOfWeek === 1) {
        // 1 means Monday
        setIsImportButtonEnabled(true)
      } else {
        setIsImportButtonEnabled(false)
      }
    }

    checkDay()
  }, [dispatch, role])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = salesh
    link.download = 'SalesHierarchyTarget.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  //  onchange getCluster
  const getCluster = async (e) => {
    setLoading(true)
    setCluster(e.target.value)
    clusterRef.current = e.target.value
    dispatch(getAllStateDetails(e.target.value))
    dispatch(getExcelByClusterDetails())

    pageRef.current = 0
    setData([])
    hasMoreRef.current = true
    dispatch(getAllSHDetails(pageRef.current, sizeRef.current, e.target.value, stateName, role))
    setLoading(false)
  }

  const handleDownloadCS = async () => {
    try {
      await dispatch(getExcelByClusterDetails(cluster, 'sales_hierarchy'))
        .then((response) => {
          if (response.data.status === true) {
            if (response.data.data.length > 0) {
              const excelUrl = UPLOAD_URL + response.data.data[0].excelName
              downloadExcel(excelUrl)
            } else {
              toast.error('No updated Excel')
            }
          } else {
            toast.error('No updated Excel')
          }
        })
        .catch((error) => {
          console.error(error)
        })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false) // Hide loading indicator if needed
    }
  }

  const downloadExcel = (url) => {
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'SalesHierarchyTarget.xlsx') // Optional: specify a file name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStateCluster = (e) => {
    setLoading(true)
    setSateName(e.target.value)
    pageRef.current = 0
    setData([])
    hasMoreRef.current = true
    dispatch(
      getAllSHDetails(pageRef.current, sizeRef.current, clusterRef.current, e.target.value, role),
    )
    setLoading(false)
  }

  return (
    <CRow>
      <ToastContainer />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Sales Hierarchy</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol>
                {cookies.role.replace(/[^A-Za-z]/g, '') === ROLE_LIST.CDMO && (
                  <CFormSelect aria-label="Choose Cluster" onChange={getCluster}>
                    <option value="All">Choose Cluster</option>
                    {Array.isArray(clusterData) &&
                      clusterData.map((cluster, index) => (
                        <option key={index} value={cluster}>
                          {cluster}
                        </option>
                      ))}
                  </CFormSelect>
                )}
              </CCol>
              <CCol>
                {cookies.role.replace(/[^A-Za-z]/g, '') === ROLE_LIST.CDMO && (
                  <CFormSelect aria-label="Choose State" onChange={getStateCluster}>
                    <option value="All">Choose State</option>
                    {Array.isArray(stateData) &&
                      stateData.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                  </CFormSelect>
                )}
              </CCol>
              <CCol className="d-flex justify-content-end">
                {cookies.role.replace(/[^A-Za-z]/g, '') === ROLE_LIST.CDMO && (
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    className="me-3"
                    onClick={handleDownloadCS}
                  >
                    <CIcon icon={cilCloudDownload} className="me-2" title="Download file" />
                    Download Excel
                  </CButton>
                )}
                {cookies.role.replace(/[^A-Za-z]/g, '') === ROLE_LIST.CLUSTERS && (
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    className="me-3"
                    onClick={handleDownload}
                  >
                    <CIcon icon={cilCloudDownload} className="me-2" title="Download file" />
                    Download Excel
                  </CButton>
                )}
                {!isImportButtonEnabled && (
                  <CButton
                    color="success"
                    variant="outline"
                    size="sm"
                    onClick={() => setVisible(true)}
                  >
                    <CIcon icon={cilCloudUpload} className="me-2" title="Download file" /> Import
                  </CButton>
                )}
              </CCol>
            </CRow>
            {/* <CTable columns={columns} items={items} /> */}
            <div className="ctmo-sales-hierarchy">
              <style>{`
                .ant-table-body {
                  scrollbar-width: thin;
                }
              `}</style>
              <Table
                columns={columns}
                dataSource={shdata}
                pagination={false}
                scroll={{ y: 250 }}
                // rowKey="id"
                loading={loading}
              />
            </div>
            {visible ? (
              <ImportModal
                visible={visible}
                setVisible={setVisible}
                clusterData={cluster}
                tabhead="Sales"
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SalesHierarchy
