import React from 'react'
import {useState, useEffect } from 'react'
import { Link, useNavigate, useParams} from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {toast} from 'react-toastify'
import { useGetProductQuery, useUpdateProductMutation, useUploadProductImageMutation} from '../slices/productsApiSlice'

const ProductEditScreen = () => {
    const {id: productId} = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const {
        data: product,
        isLoading,
        refetch,
        error,
    } = useGetProductQuery(productId);
    
    const[updateProduct, {isLoading: isLoadingUpdate}] = useUpdateProductMutation();

    const [uploloadProductImage,{isLoading: isLoadingUpload}] = useUploadProductImageMutation();
    
    const navigate = useNavigate();

    useEffect(() =>{
        if(product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);
    const submitHandler = async (event) => {
        event.preventDefault();
        const updatedProduct = {
            _id:productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }; 

        const result = await updateProduct(updatedProduct);
        refetch();
        if (result.error){
            toast.error(result.error);

        }else {
            toast.success('Information updated');
            navigate('/admin/productlist');
        }
    }

    const uploadFileHandler = async (event) => {
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
        try {
            const res = await uploloadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || error.error);
        }
    }
  return (
    <>
        <Link to='/admin/productlist' className='btn my-3 btn-primary' >
            Return
        </Link>
        <FormContainer>
            <h1>
                Edit Product
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
                    <Form.Group controlId='price' className='my-3'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                        type='number'
                        placeholder='Price'
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='brand' className='my-3'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Brand'
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countInStock' className='my-3'>
                        <Form.Label>Availability</Form.Label>
                        <Form.Control
                        type='number'
                        placeholder='Availability'
                        value={countInStock}
                        onChange={(event) => setCountInStock(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category' className='my-3'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Category'
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description' className='my-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Description'
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='image' className='my-3'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='Image URL'
                        value={image}
                        onChange={(event) => setImage}>
                        </Form.Control>
                        <Form.Control type='file' label='Choose filel' onChange={uploadFileHandler}>
                        </Form.Control>
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

export default ProductEditScreen