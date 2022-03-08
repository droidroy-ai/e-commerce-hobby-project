import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'

import { register } from '../actions/userActions'


function RegisterScreen() {
    const navigate = useNavigate()
    const location = useLocation()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { loading, userInfo, error } = userRegister

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage("Passwords do not match")
        }
        else {
            dispatch(register(name, email, password))
        }
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId='name'>
                    <Form.Label>Name: </Form.Label>
                    <Form.Control
                        required
                        type='text'
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='email'>
                    <Form.Label>Email Address: </Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='password'>
                    <Form.Label>Password: </Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='passwordConfirm'>
                    <Form.Label>Confirm Password: </Form.Label>
                    <Form.Control
                        required
                        type='password'
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">Register</Button>
            </Form>
            <Row className="py-3">
                <Col>
                    Have an account?<Link
                        to={redirect ? `/login?redirect=${redirect}` : `/login`}>
                        Sign In</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen