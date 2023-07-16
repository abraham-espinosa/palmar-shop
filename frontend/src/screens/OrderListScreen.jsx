import React from 'react'
import Message from '../components/Message';
import Loader from '../components/Loader';
import {Table} from 'react-bootstrap';
import { useGetAllOrdersQuery } from '../slices/ordersApiSlice';
import { Link } from 'react-router-dom'

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  return <>
    <h1>All Orders</h1>
    {isLoading ? <Loader /> : error ? <Message variant ='danger'>{error}
    </Message>: (
      <Table striped bordered hover responsive className='table-sm' variant="dark">
        <thead>
          <tr>
            <th>ID Order</th>
            <th>User</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) =>
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.user && order.user.name}</td>
            <td>{order.createdAt.substring(0,10)}</td>
            <td>{order.totalPrice}</td>
            <td>{order.isPaid ? (
              order.paidAt.substring(0,10)
              ) : ( 
                'Pending'
              )}</td>
            <td>{order.isDelivered ? (
              order.deliveredAt.substring(0,10)
              ) : ( 
                'In process'
              )}</td>
            <td>
              <Link to={`/order/${order._id}`}>
                      Details
              </Link>
            </td>
          </tr>)}
        </tbody>
      </Table>
    )}
  </>;
}

export default OrderListScreen