import React from 'react'
// Check shipping fields
import { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem  } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import {toast} from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {useCreateOrderMutation} from '../slices/ordersApiSlice'; 
import { clearCartItems } from '../slices/cartSlice'


const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [createOrder, {isLoading, error}] = useCreateOrderMutation();
    useEffect(()=> {
        if(!cart.shippingAddress.address){
            navigate('/shipping');
        }else if (!cart.paymentMethod){
            navigate('/payment');
        }

    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);
    console.log(cart.itemsPrice);
    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice
            }).unwrap();
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            toast.error(error); 
        }

    }
  return <>
    <CheckoutSteps step1 step2 step3 step4 />
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Address: </strong>
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <strong>Method: </strong>
                    {cart.paymentMethod}
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Items</h2>
                    {cart.cartItems.length === 0 ? (
                        <Message>Ups, cart empty</Message>
                    ): (
                        <ListGroup variant='flush'>
                            {cart.cartItems.map((item, index) =>(
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded/>      
                                        </Col>
                                        <Col>
                                            <Link to={`/products/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col >
                                        <Col md={2}>
                                            Qty: {item.qty}
                                        </Col>
                                        <Col md={2}>
                                            Price: {item.price}
                                        </Col>
                                        <Col md={2}>
                                            <strong>
                                                Total: {item.qty * item.price}
                                            </strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )
                            )}
                        </ListGroup>
                    )}
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items: </Col>
                            <Col>${cart.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping: </Col>
                            <Col>{cart.shippingPrice > 0 ? "$"+cart.shippingPrice : 'Free'}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Taxes: </Col>
                            <Col>${cart.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Total: </Col>
                            <Col>${cart.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button
                        type='button'
                        className='btn-block'
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}>
                            Placer Order
                        </Button>
                        {isLoading && <Loader />}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
  </>;
}

export default PlaceOrderScreen