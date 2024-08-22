import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormSelect, CRow } from '@coreui/react'
import ImportModal from './modal/ImportModal'
import { Table } from 'antd'
import SalesTarget from '../../assets/sample/SalesTarget.xlsx'
import {
  getAllTargetDetails,
  getAllClusterDetails,
  getAllStateDetails,
  getExcelTSCluster,
  getExcelByClusterDetails,
} from '../../redux/sales/action'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCloudUpload } from '@coreui/icons'
import { ROLE_LIST, UPLOAD_URL } from 'src/constants/constants'
import { ToastContainer, toast } from 'react-toastify'
import debounce from 'lodash.debounce'

const Target = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const hasMoreRef = useRef(true)
  const tableBodyRef = useRef(null)
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const clusterRef = useRef('All')

  const [cookies] = useCookies(['role'])
  const [visible, setVisible] = useState(false)
  const salesmanTarget = useSelector(
    (state) => state.saleshierarchyData && state.saleshierarchyData.TargetData,
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
  const role = cookies.role.replace(/[^A-Za-z]/g, '')
  const columns = [
    {
      title: '#',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'ASE Name',
      dataIndex: 'ase_name',
      key: 'ase_name',
    },
    {
      title: 'ASM EmpId',
      dataIndex: 'asm_emp_id',
      key: 'asm_emp_id',
    },
    {
      title: 'BC Daily',
      dataIndex: 'bc_daily',
      key: 'bc_daily',
    },
    {
      title: 'Bill Cuts Tgt JC',
      dataIndex: 'bill_cuts_tgt_jc',
      key: 'bill_cuts_tgt_jc',
    },
    {
      title: 'Focus Brand Name',
      dataIndex: 'focus_brand_name',
      key: 'focus_brand_name',
    },
    {
      title: 'Focus Brand UBO Target',
      dataIndex: 'focus_brand_ubo_tgt',
      key: 'focus_brand_ubo_tgt',
    },
    {
      title: 'FS UBO',
      dataIndex: 'fs_ubo',
      key: 'fs_ubo',
    },
    {
      title: 'JC',
      dataIndex: 'jc',
      key: 'jc',
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
    if (salesmanTarget && salesmanTarget.length > 0) {
      const dataWithSerialNumbers = addSerialNumbers(salesmanTarget)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
    } else {
      hasMoreRef.current = false
    }
    setLoading(false)
  }, [salesmanTarget])

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
        getAllTargetDetails(pageRef.current, sizeRef.current, clusterRef.current, stateName, role),
      )
    }
  }

  useEffect(() => {
    const tableBody = document.querySelector('.ctmo-salesman-target .ant-table-body')
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

  const [isImportEnabled, setIsImportEnabled] = useState(false)

  useEffect(() => {
    setLoading(true)
    pageRef.current = 0
    setData([])
    hasMoreRef.current = true

    dispatch(getAllClusterDetails())
    dispatch(getAllTargetDetails(pageRef.current, sizeRef.current, cluster, stateName, role))
    const today = new Date().getDate()
    if (today === 18 || today === 19 || today === 20) {
      setIsImportEnabled(true)
    } else {
      setIsImportEnabled(false)
    }
  }, [dispatch, role])

  const handleDownload = async () => {
    try {
      await dispatch(getExcelTSCluster())
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'SalesTarget.xlsx')
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link) // Clean up
        })
        .catch((error) => {
          console.error(error)
        })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownloadCS = async () => {
    try {
      await dispatch(getExcelByClusterDetails(cluster, 'salesman_target'))
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
    link.setAttribute('download', 'SalesmanTarget.xlsx') // Optional: specify a file name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCluster = (e) => {
    setLoading(true)
    pageRef.current = 0
    setData([])
    hasMoreRef.current = true
    setCluster(e.target.value)
    setSateName('All')
    clusterRef.current = e.target.value
    dispatch(getAllStateDetails(e.target.value))
    dispatch(getAllTargetDetails(pageRef.current, sizeRef.current, e.target.value, 'All', role))
    setLoading(false)
  }

  const getStateCluster = (e) => {
    setLoading(true)
    pageRef.current = 0
    setData([])
    hasMoreRef.current = true

    setLoading(true)
    setSateName(e.target.value)
    dispatch(
      getAllTargetDetails(
        pageRef.current,
        sizeRef.current,
        clusterRef.current,
        e.target.value,
        role,
      ),
    )
    setLoading(false)
  }

  return (
    <CRow>
      <ToastContainer />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Target</strong>
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
                {!isImportEnabled && (
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
            <div className="ctmo-salesman-target">
              <style>{`
                .ant-table-body {
                  scrollbar-width: thin;
                }
              `}</style>
              <Table
                columns={columns}
                dataSource={data}
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
                tabhead="Target"
                clusterData={cluster}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Target
