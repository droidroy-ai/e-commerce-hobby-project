import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'

import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstant'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'


function ProductScreen() {
    const match = useParams()
    const navigate = useNavigate()
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comments, setComments] = useState('')

    // const [product, setProduct] = useState([])

    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading: loadingReview, error: errorReview, success: successReview } = productReviewCreate

    useEffect(() => {
        if(successReview || errorReview) {
            setRating(0)
            setComments('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }
        dispatch(listProductDetails(match.id))
    }, [dispatch, successReview, match])

    const addToCartHandler = () => {
        navigate(`/cart/${match.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(
            match.id,
            {rating, comments}
        ))
    }

    return (
        <div>
            <Link to='/' className='btn btn-outline-dark my-3'>Go Back</Link>
            {loading ? <Loader />
                : error ? <Message variant="danger">{error}</Message>
                    : (
                        <div>
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
                                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
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

                            <Row className="mt-2">
                                <Col md={6}>
                                    <h4>REVIEWS</h4>
                                    {product.reviews.length === 0 && <Message variant="info">No Reviews</Message>}

                                    <ListGroup variant="flush">
                                        {product.reviews.map((review) => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color="#f8e825"/>
                                                <p>{review.createdAt.substring(0, 10)}</p>
                                                <p>{review.comments}</p>
                                            </ListGroup.Item>
                                        ))}

                                        <ListGroup.Item>
                                            <h4>Write a review</h4>
                                            {loadingReview && <Loader />}
                                            {successReview && <Message variant="success">Review Submitted</Message>}
                                            {errorReview && <Message variant="danger">{errorReview}</Message>}
                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId="rating">
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as="select"
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="1">1 - Poor</option>
                                                            <option value="2">2 - Fair</option>
                                                            <option value="3">3 - Good</option>
                                                            <option value="4">4 - Very Good</option>
                                                            <option value="5">5 - Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId="comments" className="mb-3">
                                                        <Form.Label>Review</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            row="5"
                                                            value={comments}
                                                            onChange={(e) => setComments(e.target.value)}
                                                        >
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Button 
                                                        disabled={loadingReview} 
                                                        type="submit"
                                                        variant="primary"
                                                    >Submit
                                                    </Button>
                                                </Form>
                                            ): (
                                                <Message variant="info">Please <Link to='/login'>login</Link> to write a review</Message>
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </div>
                    )
            }

        </div>
    )
}

export default ProductScreen