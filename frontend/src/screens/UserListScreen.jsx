import React from 'react'
import Message from '../components/Message';
import Loader from '../components/Loader';
import {Form, Table, Row, Col, Button, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import { useGetUsersQuery, useDeleteUserMutation } from '../slices/usersApiSlice';
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {toast} from 'react-toastify'

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const[deleteUser, {isLoading: isLoadingDeleteProduct}] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
try {
    await deleteUser(id);
    toast.success('User deleted successfully');
    refetch();
} catch (err) {
    toast.error(err?.data?.message || err.error);
}  }

  return <>
    <h1>All Users</h1>
    {isLoadingDeleteProduct && <Loader />}
    {isLoading ? <Loader /> : error ? <Message variant ='danger'>{error}
    </Message>: (
      <Table striped bordered hover responsive className='table-sm' variant="dark">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.isAdmin ? (
               'True'
              ) : ( 
                'False'
              )}</td>
            <td>
            <Link to={`/admin/user/${user._id}/edit`} className='btn btn-sm mx-2 btn-primary' >
                Edit
            </Link>                        
            <Button className='btn-sm mx-2' variant='danger' onClick={() => deleteHandler(user._id)}>
                Delete
            </Button>
            </td>
          </tr>)}
        </tbody>
      </Table>
    )}
  </>;
}

export default UserListScreen