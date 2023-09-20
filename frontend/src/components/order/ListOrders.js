import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import Loader from '../layout/Loader'

import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { myOrders, clearErrors } from '../../actions/orderAction'

const ListOrders = () => {


    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.myOrders);

    useEffect(() => {
        dispatch(myOrders());

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error
            })
            dispatch(clearErrors())
        }
    }, [dispatch, error])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Num of Items',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                },
            ],
            rows: []
        }

        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions:
                    <Link to={`/order/${order._id}`} className="btn btn-primary">
                        <i className="fa fa-eye"></i>
                    </Link>
            })
        })

        return data;
    }

    return (
        <Fragment>



            <h1 className="my-5">My Orders</h1>

            {/* used class of table-responisve to make mdbdattable responsive */}
            <div className="table-responsive">

                {loading ? <Loader /> : (
                    <MDBDataTable
                        data={setOrders()}
                        className="px-3"
                        bordered
                        striped
                        hover
                    />
                )}
            </div>

        </Fragment>
    )
}

export default ListOrders