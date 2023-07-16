import React from 'react'
import {useState, useEffect } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {toast} from 'react-toastify'
import { useGetUserDetailsQuery, useUpdateUserMutation} from '../slices/usersApiSlice'

const UserEditScreen = () => {
    const {id: userId} = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);


    const {
        data: user,
        isLoading,
        refetch,
        error,
    } = useGetUserDetailsQuery(userId);
    
    const[updateUser, {isLoading: isLoadingUpdate}] = useUpdateUserMutation();
    
    const navigate = useNavigate();

    useEffect(() =>{
        if(user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);


    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            await updateUser({userId, name, email, isAdmin});
            toast.success('Updated user');
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }    }

  return (
    <>
        <Link to='/admin/userlist' className='btn my-3 btn-primary' >
            Return
        </Link>
        <FormContainer>
            <h1>
                Edit User
            </h1>
            {isLoadingUpdate && <Loader/>}
            {isLoading ? <Loader/> : error ? <Message>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Name'
                        value={name}
                        onChange={(event) => setName(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='my-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isAdmin' className='my-3'>
                        <Form.Check
                        type='checkbox'
                        label='Administrator'
                        value={isAdmin}
                        onChange={(event) => setIsAdmin(event.target.checked)}>
                        </Form.Check>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='my-3'>
                        Update information
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
  );
};

export default UserEditScreen