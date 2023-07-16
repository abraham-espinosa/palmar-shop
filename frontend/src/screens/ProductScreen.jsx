
import { useState } from 'react' 
import {Link, useParams, useNavigate} from 'react-router-dom'
import React from 'react'
import { Form, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'   
import { useDispatch } from 'react-redux'
import {useGetProductQuery} from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {addToCart} from  '../slices/cartSlice';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {data: product, isLoading, error } = useGetProductQuery(productId);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty}));
        navigate('/cart');
    }
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

                        {product.countInStock > 0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Qty
                                    </Col>
                                    <Col>
                                    <Form.Control 
                                        as='select'
                                        value={qty}
                                        onChange= {(ev)=> setQty(Number(ev.target.value))}> 
                                    { [...Array(product.countInStock).keys()].map((i) =>(
                                        <option key={i +1} value={i+1}> 
                                            { i + 1 }
                                        </option>
                                    ) )}
                                    </Form.Control>                                   
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}

                        <ListGroup.Item>
                            <Button className='btn-block' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
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