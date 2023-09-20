import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Swal from 'sweetalert2'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants'

const ProductsList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error
            })
            dispatch(clearErrors())
        }

        if (deleteError) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: deleteError
            })
            dispatch(clearErrors())
        }

        if (isDeleted) {

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product deleted successfully'
            })
            navigate('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

    }, [dispatch, error, deleteError, isDeleted])

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions: <Fragment>
                    <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2" style={{ margin: '2px' }}>
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(product._id)} style={{ margin: '2px' }} >
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }


    return (
        <Fragment>

            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>
                        {/* used class of table-responisve to make mdbdattable responsive */}
                        <div className="table-responsive">
                            {loading ? <Loader /> : (
                                <MDBDataTable
                                    data={setProducts()}
                                    className="px-3"
                                    bordered
                                    striped
                                    hover
                                />
                            )}
                        </div>

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )


}

export default ProductsList