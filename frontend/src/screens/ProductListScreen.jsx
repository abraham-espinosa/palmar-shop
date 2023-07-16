import React from 'react'
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Table, Row, Col, Button } from 'react-bootstrap';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';



const ProductListScreen = () => {
  const {data: products, refetch, isLoading, error} = useGetProductsQuery();
  const [createProduct,{isLoading: isLoadingCreateProduct}] = useCreateProductMutation();
  const [deleteProduct,{isLoading: isLoadingDeleteProduct}] = useDeleteProductMutation();
  const deleteHandler = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully')
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };
  const createProductHandler = async () => {
    try {
      await createProduct();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createProductHandler}>
            Create New Product
          </Button>
        </Col>
      </Row>
      {isLoadingCreateProduct && <Loader />}
      {isLoadingDeleteProduct && <Loader />}
      {isLoading ? <Loader /> : error ? <Message>{error}</Message> : (
            <>
              <Table striped bordered hover responsive className='table-sm' variant="dark">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <Link to={`/admin/product/${product._id}/edit`} className='btn btn-sm mx-2 btn-primary' >
                            Edit
                        </Link>                        
                        <Button className='btn-sm mx-2' variant='danger' onClick={() => deleteHandler(product._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
    </>
  );
};
export default ProductListScreen