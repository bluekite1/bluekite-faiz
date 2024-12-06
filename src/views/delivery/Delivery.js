import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CAlert,
} from '@coreui/react'
import axiosInstance from '../../utils/axiosConfig'

const Delivery = () => {
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [deliveryChargeId, setDeliveryChargeId] = useState(null)

  // Fetch existing delivery charge (for update)
  useEffect(() => {
    const token = localStorage.getItem('token') // Retrieve token from localStorage
    const fetchDeliveryCharge = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/delivery-charges', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        })

        if (response.data && response.data.length > 0) {
          const existingCharge = response.data[0]
          setPrice(existingCharge.price)
          setDeliveryChargeId(existingCharge._id)
          setIsUpdate(true)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching delivery charge:', error)
        setLoading(false)
      }
    }

    fetchDeliveryCharge()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token') // Retrieve token from localStorage

    try {
      setLoading(true)
      const endpoint = isUpdate ? `/delivery-charges/${deliveryChargeId}` : '/delivery-charges'
      const method = isUpdate ? 'put' : 'post'

      const response = await axiosInstance[method](
        endpoint,
        { price },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        },
      )

      setAlertMessage(
        isUpdate ? 'Delivery charge updated successfully' : 'Delivery charge created successfully',
      )
      setAlertVisible(true)
      setLoading(false)
    } catch (error) {
      console.error('Error saving delivery charge:', error)
      setAlertMessage('Error saving delivery charge')
      setAlertVisible(true)
      setLoading(false)
    }
  }

  return (
    <div>
      {alertVisible && (
        <CAlert color="success" onClose={() => setAlertVisible(false)} dismissible>
          {alertMessage}
        </CAlert>
      )}
      <CCard>
        <CCardHeader>{isUpdate ? 'Update Delivery Charge' : 'Create Delivery Charge'}</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-2">
              <CFormLabel htmlFor="price">Price</CFormLabel>
              <CFormInput
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <CButton type="submit" color="primary" disabled={loading}>
              {loading ? <CSpinner color="light" size="sm" /> : 'Save Delivery Charge'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Delivery
