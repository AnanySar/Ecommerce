import React, { Fragment, useState, useEffect } from 'react'


import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, loadUser, clearErrors } from '../../actions/userAction'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = ({  }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const { error, isUpdated, loading } = useSelector(state => state.user)

    useEffect(() => {

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url)
        }

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            dispatch(clearErrors());
        }

        if (isUpdated) {
            // For displaying a success message
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User Updated Successful!',
            });
            dispatch(loadUser());

            navigate('/me')

            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }

    }, [dispatch, Swal, error, isUpdated])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);

        dispatch(updateProfile(formData))
    }

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])

    }
    return (
        <Fragment>


            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field" style={{ marginBottom: '5px' }}>Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '5px' }}>
                            <label htmlFor="email_field" style={{ marginBottom: '5px' }}>Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className='form-group' style={{ marginTop: '18px' }}>
                            <label htmlFor='avatar_upload' style={{ marginTop: '5px', marginBottom: '3px' }}>Avatar</label>
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
                                        accept='image/*'
                                        onChange={onChange}
                                    />
                                    
                                </div>
                            </div>
                        </div>

                        <button type="submit"
                            style={{
                                display: 'block',
                                padding: '0.75rem 0',
                                width: '100%',
                            }}
                            className="btn update-btn btn-block mt-4 mb-3"
                            disabled={loading ? true : false} >Update</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile