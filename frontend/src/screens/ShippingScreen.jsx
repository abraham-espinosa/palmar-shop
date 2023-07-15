import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {saveShippingAddress} from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps';


const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch()
    const navigate = useNavigate()



    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
      }

  return (
  <FormContainer>
    <CheckoutSteps step1 step2/>
    <h1>Shipping</h1>
    <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-3'>
            <Form.Control
                type='text'
                placeholder='Address'
                value={address}
                onChange={(e)=> setAddress(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city' className='my-3'>
            <Form.Control
                type='text'
                placeholder='City'
                value={city}
                onChange={(e)=> setCity(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode' className='my-3'>
            <Form.Control
                type='text'
                placeholder='Postal Code'
                value={postalCode}
                onChange={(e)=> setPostalCode(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country' className='my-3'>
            <Form.Control
                type='text'
                placeholder='Country'
                value={country}
                onChange={(e)=> setCountry(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3'>
          Next
        </Button>
    </Form>

 
 
 
 </FormContainer>
  )
};

export default ShippingScreen