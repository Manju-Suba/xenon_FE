import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import ImportModal from './modal/ImportModal'
import { Space, Table } from 'antd'
import { getAllHistoryDetails } from '../../redux/sales/action'
import { useDispatch, useSelector } from 'react-redux'
import { UPLOAD_URL } from '../../constants/constants'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import debounce from 'lodash.debounce'
import { CSpinner } from '@coreui/react'

const Historylog = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const hasMoreRef = useRef(true)
  const tableBodyRef = useRef(null)
  const [commonLoader, setCommonLoader] = useState(true)

  const [visible, setVisible] = useState(false)
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const HistoryLogData = useSelector(
    (state) => state.saleshierarchyData && state.saleshierarchyData.HistoryData,
  )

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current // Calculate the start index based on the page number
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1, // Generating serial number with the correct offset
    }))
  }

  useEffect(() => {
    if (HistoryLogData && HistoryLogData.length > 0) {
      const dataWithSerialNumbers = addSerialNumbers(HistoryLogData)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
    }
    setCommonLoader(false)
  }, [HistoryLogData])

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
      dispatch(getAllHistoryDetails(pageRef.current, sizeRef.current))
    }
  }

  useEffect(() => {
    const tableBody = document.querySelector('.history-log .ant-table-body')
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

  useEffect(() => {
    setCommonLoader(true)
    pageRef.current = 0
    setData([])
    hasMoreRef.current = true
    dispatch(getAllHistoryDetails(pageRef.current, sizeRef.current))
  }, [dispatch])

  // dayjs.extend(advancedFormat)
  // dayjs.extend(customParseFormat)
  const columns = [
    {
      title: '#',
      dataIndex: 'sno',
    },
    {
      title: 'Cluster',
      dataIndex: 'clusterName',
      key: 'clusterName',
    },
    {
      title: 'Type',
      dataIndex: 'excelType',
      key: 'excelType',
      render: (_, record) => {
        // Function to format the excelType string
        const formatExcelType = (type) => {
          return type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        }

        return formatExcelType(record.excelType)
      },
    },
    {
      title: 'Excel',
      dataIndex: 'smSysName',
      key: 'smSysName',
      render: (_, record) => {
        if (record.clusterExcel) {
          return (
            <Space size="middle">
              <a
                href={UPLOAD_URL + record.clusterExcel}
                className="btn text-success"
                alt={'Current'}
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <CIcon
                  icon={cilCloudDownload}
                  className="me-1"
                  title="Download file"
                /> Download{' '}
              </a>
            </Space>
          )
        } else {
          return <Space size="middle">No Excel</Space>
        }
      },
    },
    {
      title: 'CTMO Excel',
      dataIndex: 'smSysName',
      key: 'smSysName',
      render: (_, record) => {
        if (record.ctmoExcel) {
          return (
            <Space size="middle">
              <a
                href={UPLOAD_URL + record.ctmoExcel}
                className="btn text-success"
                alt={'Current'}
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <CIcon
                  icon={cilCloudDownload}
                  className="me-1"
                  title="Download file"
                /> Download{' '}
              </a>
            </Space>
          )
        } else {
          return <Space size="middle">No Excel</Space>
        }
      },
    },
    {
      title: 'Date',
      dataIndex: 'zm',
      key: 'zm',
      render: (_, record) => {
        return dayjs(record.createdat).format('DD MMM YYYY h.mmA')
      },
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>History Log</strong>
          </CCardHeader>
          <CCardBody>
            {/* <CTable columns={columns} items={items} /> */}
            <div className="history-log">
              <style>{`
                .ant-table-body {
                  scrollbar-width: thin;
                }
              `}</style>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: 300 }}
                loading={{
                  spinning: commonLoader,
                  indicator: <CSpinner color="danger" />,
                }}
                // rowKey="id"
              />
            </div>

            {visible ? (
              <ImportModal visible={visible} setVisible={setVisible} tabhead="Sales" />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Historylog
