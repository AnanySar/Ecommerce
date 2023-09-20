import React, { Fragment, useState, useEffect } from 'react'


import Sidebar from './Sidebar'

import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { newProduct, clearErrors } from '../../actions/productActions'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'
import { useNavigate } from 'react-router-dom'

const NewProduct = ( ) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    const navigate =useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(state => state.newProduct);

    useEffect(() => {

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            dispatch(clearErrors())
        }

        if (success) {
            navigate('/admin/products');
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product created successfully'
            });
            dispatch({ type: NEW_PRODUCT_RESET })
        }

    }, [dispatch, error, success])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);
        formData.set('seller', seller);

        images.forEach(image => {
            formData.append('images', image)
        })

        dispatch(newProduct(formData))
    }

    const onChange = e => {

        const files = Array.from(e.target.files)

        setImagesPreview([]);
        setImages([])

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <Fragment>
            
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5" style={{marginLeft:'15px',marginRight:'35px' ,display:'block'}}>
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field" style={{marginBottom:'5px'}}>Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group" style={{marginTop:'5px'}}>
                                    <label htmlFor="price_field" style={{marginBottom:'5px'}}>Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group" style={{marginTop:'5px'}}>
                                    <label htmlFor="description_field" style={{marginBottom:'5px'}}>Description</label>
                                    <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                <div className="form-group" style={{marginTop:'5px'}}>
                                    <label htmlFor="category_field" style={{marginBottom:'5px'}}>Category</label>
                                    <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        {categories.map(category => (
                                            <option key={category} value={category} >{category}</option>
                                        ))}

                                    </select>
                                </div>
                                <div className="form-group" style={{marginTop:'5px'}}>
                                    <label htmlFor="stock_field" style={{marginBottom:'5px'}}>Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>

                                <div className="form-group"style={{marginTop:'5px'}}>
                                    <label htmlFor="seller_field" style={{marginBottom:'5px'}}>Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                </div>

                                <div className='form-group' style={{marginTop:'10px'}}>
                                    <label  style={{marginBottom:'5px'}}>Images</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        
                                    </div>

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}

                                </div>


                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    style={{
                                        display:'block',
                                        width:'100%'
                                    }}
                                    disabled={loading ? true : false}
                                >
                                    CREATE
                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default NewProduct