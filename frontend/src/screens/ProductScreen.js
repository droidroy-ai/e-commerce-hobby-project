import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'

import { listProductDetails } from '../actions/productActions'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'


function ProductScreen() {
    const match = useParams()
    const navigate = useNavigate()
    const [qty, setQty] = useState(1)
    // const [product, setProduct] = useState([])
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    useEffect(() => {
        dispatch(listProductDetails(match.id))
    }, [dispatch, match])

    const addToCartHandler = () => {
        navigate(`/cart/${match.id}?qty=${qty}`)
    }
    // console.log("Called", match)
    return (
        <div>
            <Link to='/' className='btn btn-outline-dark my-3'>Go Back</Link>
            {loading ? <Loader />
                : error ? <Message variant="danger">{error}</Message>
                    : (
                        <Row>
                            <Col md={6}>
                                <Image src={product.image} alt={product.name} fluid />
                            </Col>
                            <Col md={3}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h3>{product.name}</h3>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        Price: ${product.price}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        Description: {product.description}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>
                                                    <strong>${product.price}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty</Col>
                                                    <Col xs="auto" className="my-1">
                                                        <Form.Select 
                                                            as="select" 
                                                            value={qty}
                                                            onChange={(e) => setQty(e.target.value)}
                                                            >
                                                                {
                                                                    [...Array(product.countInStock).keys()].map((x) => (
                                                                        <option key={x + 1} value={x+1}>{x + 1}</option>
                                                                    ))
                                                                }
                                                            </Form.Select>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}

                                        <ListGroup.Item>
                                            <div className="d-grid gap-2">
                                                <Button
                                                    onClick={addToCartHandler}
                                                    size="md"
                                                    disabled={product.countInStock === 0}
                                                    >Add to Cart
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    )
            }

        </div>
    )
}

export default ProductScreen