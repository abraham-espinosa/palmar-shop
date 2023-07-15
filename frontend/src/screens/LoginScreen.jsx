import { useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'
import {toast} from 'react-toastify'
import { useLoginMutation } from '../slices/usersApiSlice'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading}] = useLoginMutation();

  const { userInfo} = useSelector((state)=> state.auth);

  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo){
        navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const res = await login({email, password}).unwrap();
        dispatch(setCredentials({...res,}));
        navigate(redirect);
    } catch (error) {
        toast.error(error?.data?.message || error.error);
    }
};

  return (
    <FormContainer>
      <h1>Log into Palmar</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Control
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
       
        <Button type='submit' variant='primary' className='my-3' disabled={isLoading}>
          Log In
        </Button>
        {isLoading && <Loader/>}
      </Form>
    
      <Row>
        <Col>
          <Link to={redirect ? `/signup?redirect=${redirect}` : '/signup'}>
            Create New Account
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen