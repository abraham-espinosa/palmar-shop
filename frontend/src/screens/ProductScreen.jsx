import {Link, useParams} from 'react-router-dom'
import React from 'react'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'   
import Rating from '../components/Rating'
import {useGetProductQuery} from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProductScreen = () => {
    const { id: productId } = useParams();
    const {data: product, isLoading, error } = useGetProductQuery(productId);

    return <>
        <Link className='btn btn-light my-3' to='/'>Return</Link>
        {isLoading ? (
            <Loader/>
        ) : error ? (
            <Message variant='danger'>
                {error?.data?.message || error.error}        
            </Message>
        ) : (
            <Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroup.Item>
                    <ListGroup.Item>Price: ${product.price} MXN</ListGroup.Item>
                    <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Price:
                                </Col>
                                <Col>
                                    <strong>${product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Status:
                                </Col>
                                <Col>
                                    <strong>{product.countInStock>0?'Available':'No Currently Available'}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button className='btn-block' type='button' disabled={product.countInStock === 0}>
                                Add to Card
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        )}
    </>;
}
export default ProductScreen