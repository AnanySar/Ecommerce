import React, { Fragment, useState, useEffect } from 'react'
import {useNavigate,useParams} from 'react-router-dom'


import Swal from 'sweetalert2'

import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearErrors } from '../../actions/userAction'

const ResetPassword = ({  }) => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const {token} =useParams();

    const { error, success } = useSelector(state => state.forgotPassword)

    useEffect(() => {

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            dispatch(clearErrors());
        }

        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password reset successfully',
            });
           navigate('/login')
        }

    }, [dispatch,  error, success, ])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(token, formData))
    }

    return (
        <Fragment>

            
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field" style={{marginBottom:'10px'}}>Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '25px', marginBottom:'30px' }}>
                            <label htmlFor="confirm_password_field" style={{ marginBottom: '10px' }}>Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            id="new_password_button"
                            type="submit"
                            style={{
                                display: 'block',
                                width: '100%',        
                              }}
                            className="btn btn-block py-3">
                            Set Password
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default ResetPassword