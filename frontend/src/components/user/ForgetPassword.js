import React, { Fragment, useState, useEffect } from 'react'


import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearErrors } from '../../actions/userAction'



const ForgetPassword = () => {

    const [email, setEmail] = useState('')

   
    const dispatch = useDispatch();
    

    const { error, loading, message } = useSelector(state => state.forgotPassword)

    useEffect(() => {

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            dispatch(clearErrors());
        }

        if (message) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: message,
            });
        }

    }, [dispatch, Swal, error, message])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', email);

        dispatch(forgotPassword(formData))
    }

    return (
        <Fragment>
           

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Forget Password</h1>
                        <div className="form-group" >
                            <label htmlFor="email_field" style={{marginBottom:'10px'}}>Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            style={{
                                display: 'block',
                                width: '100%',        
                              }}
                            className="btn btn-block py-3"
                            disabled={loading ? true : false} >
                            Send Email
                    </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default ForgetPassword