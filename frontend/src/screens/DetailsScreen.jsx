import {useState, useEffect} from 'react'
import {Form, Table, Row, Col, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast} from 'react-toastify';
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDetailsMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const DetailsScreen = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo.name, userInfo.email]);

    const submitHandler = (event) => {
        event.preventDefault();
        console.log('submit');
    }

  return (
    <div>DetailsScreen</div>
  )
}

export default DetailsScreen