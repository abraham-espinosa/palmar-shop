import {useState, useEffect} from 'react'
import {Form, Table, Row, Col, Button, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast} from 'react-toastify';
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDetailsMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { Link } from 'react-router-dom'

const DetailsScreen = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    const [updateDetails, {isLoading:loadingUpdateDetails}] = useDetailsMutation();

    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo, userInfo.name, userInfo.email]);

    const submitHandler = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
        } else {
          try {
            const res = await updateDetails({_id: userInfo._id, name, email, password}).unwrap();
            dispatch(setCredentials(res));
            toast.success('Updated');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }
    }

  return (
    <Row>
      <Col md={4}>
        

        <Card>
          <Card.Body>
            <Card.Title>User Details</Card.Title>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type='text' placeholder='Name' value={name} onChange={(event) => setName(event.target.value)}></Form.Control> 
                  </Form.Group>
                  <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}></Form.Control> 
                  </Form.Group>
                  <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}></Form.Control> 
                  </Form.Group>
                  <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}></Form.Control> 
                  </Form.Group>
                  <Button type='submit' variant='primary' className='my-2'>Update information</Button>
                  {loadingUpdateDetails && <Loader/>}        
                </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={5}>
        {isLoading ? <Loader/>: error ? (<Message variant='danger'>
        {error?.data?.message || error.error}
        </Message>) : (
          <Card>
            <Card.Body>
            <Card.Title>My Orders</Card.Title>
              {orders.map((order) => (
                <Card.Body>
                    <Card.Title>{order._id}</Card.Title>
                    
                    <p>
                    <strong>Created At: </strong>{order.createdAt.substring(0,10)}
                  </p>
                  <p>
                    <strong>Total Price: </strong>${order.totalPrice}
                  </p>
                  <p>
                    <strong>Paid At: </strong>{order.isPaid ? (
                   `${order.paidAt.substring(0,10)}`
                  ) : (
                    'Pending payment'
                  )}
                  </p>
                  <p>
                    <strong>Delivered At: </strong>{order.isDelivered ? (
                   `${order.deliveredAt.substring(0,10)}`
                  ) : (
                    'In process'
                  )}
                  </p>
                  <p>
                    <Link to={`/order/${order._id}`}>
                      Details
                    </Link>
                  </p>
                  
                </Card.Body>
              ))}
            </Card.Body>
          </Card>
        ) }
      </Col>
    </Row>
  )
}

export default DetailsScreen