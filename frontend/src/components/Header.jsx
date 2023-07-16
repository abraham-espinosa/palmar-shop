import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Navbar, NavDropdown, Nav, Container, Badge} from 'react-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap'
import logo from '../assets/logo.png'
import { useLogoutMutation } from '../slices/usersApiSlice';
import {logout} from '../slices/authSlice'

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/login');
    } catch (error) {
        console.log(error);
    }

    }
  return (
    <header>
        <Navbar bg='black' variant='dark' expand='sm' collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand >
                        <img src={logo} alt='logo'/>
                        Palmar
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <LinkContainer to='/cart'>
                            <Nav.Link>
                                <FaShoppingCart /> Cart
                                {
                                    cartItems.length > 0 && (
                                        <Badge pill style={{marginLeft:'5px'}}> 
                                            {cartItems.reduce((acc, item) =>  acc + item.qty, 0)}
                                        </Badge>
                                    )
                                }
                            </Nav.Link>
                        </LinkContainer>
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/details'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : ( <LinkContainer to='/login'>
                            <Nav.Link>
                                <FaUser /> Sign In
                            </Nav.Link>
                        </LinkContainer> )}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='admindropdown'>
                                <LinkContainer to='/admin/orderlist'>
                                    <NavDropdown.Item>Orders List</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/productlist'>
                                    <NavDropdown.Item>Products</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/userlist'>
                                    <NavDropdown.Item>Users</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header