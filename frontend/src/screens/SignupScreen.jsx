import { useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'
import {toast} from 'react-toastify'
import { useSignupMutation } from '../slices/usersApiSlice'

const SignupScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [signup, { isLoading}] = useSignupMutation();

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
    if (password !== confirmPassword){
      toast.error('Password is incorrect');
      return;
    }else{
        try {
        const res = await signup({name, email, password}).unwrap();
        dispatch(setCredentials({...res,}));
        navigate(redirect);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

};

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group controlId='name' className='my-3'>
          <Form.Control
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
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

        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
       
        <Button type='submit' variant='primary' className='my-3' disabled={isLoading}>
          Sign Up
        </Button>
        {isLoading && <Loader/>}
      </Form>
    
      <Row>
        <Col>
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login if you already have an account
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default SignupScreen