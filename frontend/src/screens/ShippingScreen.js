import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'

import FormContainer from '../components/FormContainer'

import { saveShippingAddress } from '../actions/cartActions'

function ShippingScreen() {
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)


    const dispatch = useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
        console.log("Submitted")
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/payment')
    }
    return (
        <FormContainer>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId='address'>
                    <Form.Label>Address: </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder="Enter address"
                        value={address ? address : ''}
                        onChange={(e) => setAddress(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='city'>
                    <Form.Label>City: </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder="Enter city"
                        value={city ? city : ''}
                        onChange={(e) => setCity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='postalCode'>
                    <Form.Label>Postal Code: </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder="Enter postal code"
                        value={postalCode ? postalCode : ''}
                        onChange={(e) => setPostalCode(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='country'>
                    <Form.Label>Country: </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder="Enter country"
                        value={country ? country : ''}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen