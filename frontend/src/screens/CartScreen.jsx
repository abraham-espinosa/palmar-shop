import React from 'react'
//import React, { useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import {FaTrash} from 'react-icons/fa';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems} = cart;  

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({...product, qty}))
    };

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };

    const buyNowHandler =  () => {
        navigate('/login?redirect=/shipping');
    }

    return <Row>
        <Row>
        <Col className='text-center'>        
        <Link to='/' className='btn btn-sm mx-2 btn-primary' >
                            Return
        </Link>  
        </Col>

        </Row>
        <Col md={8}>
            <h1 style={{marginBottom: '20px'}}>Cart</h1>
            { cartItems.length === 0 ? (
                <Message>
                    The cart is empty. Please go back to the main page and add at least one item.
                </Message>
            ) : (
                <ListGroup variant='flush'>
                    {cartItems.map((i) => (
                        <ListGroup.Item key={i._id}>
                            <Row>
                                <Col md={2}>
                                    <Image src={i.image} alt={i.name} fluid rounded/>
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${i._id}`}>
                                        {i.name }
                                    </Link>
                                </Col>
                                <Col md={2}>
                                    ${i.price}
                                </Col>
                                <Col md={2}>
                                <Form.Control 
                                        as='select'
                                        value={i.qty}
                                        onChange= {(ev)=> addToCartHandler(i, Number(ev.target.value))}> 
                                    { [...Array(i.countInStock).keys()].map((i) =>(
                                        <option key={i +1} value={i+1}> 
                                            { i + 1 }
                                        </option>
                                    ) )}
                                    </Form.Control>     
                                </Col>
                                <Col md={2}>
                                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(i._id)}>
                                        <FaTrash/>
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )
                    )}
                </ListGroup>
            )}
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>
                            Subtotal({cartItems.reduce((acc, i) => acc + i.qty, 0)})
                        </h2>
                        <p>
                            Price: { cartItems.reduce((acc, i) => acc + i.qty * i.price, 0).toFixed(2)}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button type='button' className='btn-block' disabled={ cartItems.length ===  0} onClick={buyNowHandler}>
                            Buy Now
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
    };
export default CartScreen