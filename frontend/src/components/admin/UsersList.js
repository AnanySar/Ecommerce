import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'


import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { allUsers, clearErrors } from '../../actions/userAction'
//import { DELETE_USER_RESET } from '../../constants/userConstants'

const UsersList = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, users } = useSelector(state => state.allUsers);
    // const { isDeleted } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error
            })
            dispatch(clearErrors())
        }

        // if (isDeleted) {
        //     alert.success('User deleted successfully');
        //     navigate('/admin/users');
        //     dispatch({ type: DELETE_USER_RESET })
        // }

    }, [dispatch, error])

    // const deleteUserHandler = (id) => {
    //     dispatch(deleteUser(id))
    // }

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },

            ],
            rows: []
        }

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,


            })
        })

        return data;
    }


    return (
        <Fragment>

            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-8">
                    <Fragment>
                        <h1 className="my-5">All Users</h1>

                        <div className="table-responsive">
                            {loading ? <Loader /> : (
                                <MDBDataTable
                                    data={setUsers()}
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

export default UsersList