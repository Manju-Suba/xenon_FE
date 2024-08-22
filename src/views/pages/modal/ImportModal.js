import React from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import {
  SalesHierarchyImport,
  getAllRSDetails,
  getAllSHDetails,
  getAllTargetDetails,
} from 'src/redux/sales/action'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCookies } from 'react-cookie'
import { ROLE_LIST } from 'src/constants/constants'

const ImportModal = ({ visible, setVisible, tabhead, clusterData }) => {
  const dispatch = useDispatch()
  const [cookies] = useCookies(['role'])
  const [show, setShow] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef(null)
  const [selectedFile, setSelectedFile] = React.useState(null)
  const [selectedinputFile, setSelectedinputFile] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [validated, setValidated] = React.useState(false)

  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setSelectedFile(file)
        setSelectedinputFile(e.dataTransfer.files[0])
        setError(null)
      } else {
        setError('Please upload an Excel file.')
      }
    }
  }

  // triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setSelectedFile(file)
        setSelectedinputFile(file) // Corrected line to use e.target.files[0]
        setError(null)
      } else {
        setError('Please upload an Excel file.')
      }
    }
  }

  // triggers the input when the button is clicked
  React.useEffect(() => {
    setShow(visible)
  }, [visible])

  const handleClose = () => {
    setVisible(false)
    setShow(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
    } else {
      setLoading(true)
      setError('')
      if (cookies.role === ROLE_LIST.CDMO) {
        if (clusterData === 'All') {
          setError('Must select Cluster')
          setLoading(false)
          return false
        }
      }
      const formData = new FormData()
      formData.append('file', selectedinputFile)
      formData.append('cluster', clusterData)

      try {
        await dispatch(SalesHierarchyImport(formData, tabhead))
          .then((response) => {
            if (tabhead === 'Sales') {
              dispatch(getAllSHDetails())
            } else if (tabhead === 'RSwiseTarget') {
              dispatch(getAllRSDetails())
            } else if (tabhead === 'Target') {
              dispatch(getAllTargetDetails())
            }

            toast.success(response.data.message)
            setLoading(false)
            setSelectedFile()
            setSelectedinputFile()
          })
          .catch((error) => {
            toast.error(error.response.data.message)
            setLoading(false)
          })
      } catch (err) {
        console.log(err)
        setError('File upload failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    setValidated(true)
  }

  const handleLabelClick = (e) => {
    e.preventDefault()
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <CModal
      alignment="center"
      visible={show}
      onClose={handleClose}
      aria-labelledby="VerticallyCenteredExample"
    >
      <ToastContainer />
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Import Excel</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={12} className="position-relative">
            <CFormInput
              type="file"
              id="input-file-upload"
              multiple={false}
              accept=".xls, .xlsx"
              onChange={handleChange}
              ref={inputRef}
              style={{ display: 'none' }}
              required
            />
            <CFormLabel
              id="label-file-upload"
              htmlFor="input-file-upload"
              className={dragActive ? 'drag-active' : ''}
              onClick={handleLabelClick}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #aaa',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div>
                <p>Drag and drop your file here or</p>
                <p>Upload a file</p>
                {selectedFile && <p>{selectedFile.name}</p>}
              </div>
            </CFormLabel>
            {dragActive && (
              <div
                id="drag-file-element"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
              ></div>
            )}
            {error && <p className="text-danger">{error}</p>}
          </CCol>
          <CCol xs={12} className="position-relative text-lg-end">
            <CButton color="success" type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Import'}
            </CButton>
          </CCol>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

ImportModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  tabhead: PropTypes.string.isRequired,
  clusterData: PropTypes.string,
}

export default ImportModal
