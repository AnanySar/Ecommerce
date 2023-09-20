import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../actions/userAction'
import Swal from 'sweetalert2'

const Register = () => {


    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')


    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        // get data for the form of user registration and set them
        const formData = new FormData()
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        dispatch(register(formData))
    }

    const onChange = e => {
        if (e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }


    return (
        <Fragment>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group" >
                            <label htmlFor="email_field" style={{marginBottom:'5px'}}>Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange} 
                            />
                        </div>

                        <div className="form-group" style={{marginTop:'5px'}}>
                            <label htmlFor="email_field" style={{marginBottom:'5px'}}>Email</label>
                            <input
                                 type="email"
                                 id="email_field"
                                 className="form-control"
                                 name='email'
                                 value={email}
                                 onChange={onChange}
                            />
                        </div>

                        <div className="form-group" style={{marginTop:'5px'}}>
                            <label htmlFor="password_field" style={{marginBottom:'5px'}}>Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                            />
                        </div>

                        <div className='form-group' style={{marginTop:'18px'}}>
                            <label htmlFor='avatar_upload' style={{marginTop:'5px',marginBottom:'3px'}}>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl' style={{marginRight:'15px'}}>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    
                                </div>
                            </div>
                        </div>

                        <button
                             id="register_button"
                             type="submit"
                             style={{
                                display: 'block',
                                padding: '0.75rem 0',
                                width: '100%',        
                              }}
                             className="btn btn-block py-3"
                             disabled={loading ? true : false}
                        >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Register