import React, { Fragment, useState, useEffect } from 'react'


import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword, clearErrors } from '../../actions/userAction'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'
import { useNavigate } from 'react-router-dom'


const UpdatePassword = ({ }) => {

    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')

    
    const dispatch = useDispatch();
    const navigate =useNavigate();

    const { error, isUpdated, loading } = useSelector(state => state.user)

    useEffect(() => {

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            dispatch(clearErrors());
        }

        if (isUpdated) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password  Updated Successful!',
            });

            navigate('/me')

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

    }, [dispatch, Swal, error,  isUpdated])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);

        dispatch(updatePassword(formData))
    }

    return (
        <Fragment>
           

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label for="old_password_field" style={{ marginBottom: '10px' }}>Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '25px', marginBottom:'30px' }}>
                            <label for="new_password_field" style={{ marginBottom: '10px' }}>New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" 
                        style={{
                            display: 'block',
                            padding: '0.50rem 0',
                            width: '100%',
                           
                        }}
                        className="btn update-btn btn-block mt-4 mb-3"
                         disabled={loading ? true : false} >Update Password</button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdatePassword