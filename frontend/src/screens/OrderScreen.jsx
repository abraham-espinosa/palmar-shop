import React from 'react'
import {Link, useParams} from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap';
import { useEffect} from 'react';
import { PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation} from '../slices/ordersApiSlice'
import Loader from '../components/Loader';
import Message from '../components/Message';
import {toast} from 'react-toastify'
import { UseSelector, useSelector } from 'react-redux';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
  const [payOrder, {isLoading:isLoadingPay}] = usePayOrderMutation();
  const [deliverOrder, {isLoading:isLoadingDeliver}] = useDeliverOrderMutation();
  const [ {isPending}, paypalDispatch] =usePayPalScriptReducer();
  const { data: paypal, isLoading: isLoadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();
  const {userInfo} = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !isLoadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
          currency: 'MXN'
          }
        });
        paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
      } 
      if (order && !order.isPaid){
        if (!window.paypal){
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, isLoadingPayPal, errorPayPal]);

  //FUNCTIONS
  function onApprove(data, actions){
    return actions.order.capture().then(async function(details){
      try {
        await payOrder({orderId, details});
        refetch();
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }
  async function onApproveTest(){
    await payOrder({orderId, details: {payer: {}}});
    refetch();
    toast.success('Payment successful');
  }

  function onError(err){
    toast.error(err.message);
  }

  function createOrder(data, actions){
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          },
        },
      ],
    }).then((orderId) =>{
      return orderId;
    });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err.data.message || err.message);
    }
  } 
  
  return isLoading ? <Loader /> : error ? <Message variant='danger' /> : (
    <>
      <Row>
        <ListGroup.Item>
        </ListGroup.Item>
        <Col md={8}>
          <ListGroup variant='flush'>
          <Card>
            <ListGroup.Item>
            <h3>Order Details</h3>
              <p>
                <strong>Order Number: </strong>{order._id}
              </p>
              <p>
                <strong>Name: </strong>{order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <p>
                <strong>Delivered: </strong>{order.isDelivered ? (`Delivered on ${order.deliveredAt.substring(0,10)}`
                ) : ( 'Not delivered, estimated date in 7 days after purchase'
                )}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
            <h3>Payment Details</h3>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Payment: </strong>{order.isPaid ? (`Paid on ${order.paidAt}`
                ) : ( 'Pending'
                )}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Products</h3>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                      <Link to={`/product/${item.product}`}>
                        {item.name} (1)
                      </Link>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2}>
                       ${item.price*item.qty}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </Card>
        </ListGroup>
        </Col>
        <Col>
        <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Payment Order</h2>  
                <p>
                <strong>Items price: </strong>${order.itemsPrice}
              </p>
              <p>
                <strong>Shipping price: </strong>${order.shippingPrice}
              </p>
              <p>
                <strong>Tax price: </strong>${order.taxPrice}
              </p>
              <p>
                <strong>Total Amount: </strong>${order.totalPrice}
              </p>
              </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                  {isLoadingPay && <Loader/>}
                  {isPending ?<Loader/> : (
                      <div>
                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                      </div>
                  )}
                  </ListGroup.Item>
                )}
                {isLoadingDeliver && <Loader/>}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverOrderHandler}>
                        Order Has Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen;