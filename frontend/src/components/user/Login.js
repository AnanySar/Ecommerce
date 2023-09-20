import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Loader from '../layout/Loader'
import { login, } from '../../actions/userAction'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location=useLocation();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth)

    

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        } else if (error) {
            // Display the error  with SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
        }
    }, [isAuthenticated, error, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    


    


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>

                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group" style={{margin:'10px'}}>
                                    <label htmlFor="email_field" style={{marginBottom:'5px'}}>Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group" style={{margin:'10px'}}>
                                    <label htmlFor="password_field" style={{marginBottom:'5px'}}>Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        
                                        className="form-control"
                                        value={password}
                                        onChange={(e)=>setPassword(e.target.value)}
                                    />
                                </div>

                                <Link to="/password/forget" style={{float:'right', marginBottom:'4',marginTop:'5px'}} className="float-right mb-4">Forgot Password?</Link>

                                <button
                                    id="login_button"
                                    type="submit"
                                    style={{
                                        display: 'block',
                                        padding: '0.75rem 0',
                                        width: '100%',        
                                      }}
                                    className="btn"
                                >
                                    LOGIN
                                </button>

                                <Link to="/register" style={{float:'right', marginTop:'3'}} className="float-right mt-3">New User?</Link>
                            </form>
                        </div>
                    </div>



                </Fragment>
            )}
        </Fragment>
    )
}

export default Login