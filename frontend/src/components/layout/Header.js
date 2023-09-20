import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'



import Search from './Search'
import { Link, NavLink } from 'react-router-dom'

import { logout } from '../../actions/userAction'


const Header = () => {
    const dispatch = useDispatch()

    const { cartItems } = useSelector(state => state.cart)


    const logoutHandler = () => {
        Swal.fire({
            icon:'success',
            title:'Success',
            text :'Logged Out Successfully'
        })
        dispatch(logout());
       
    }


    const { user, loading } = useSelector(state => state.auth)
    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <div className='col' style={{ marginLeft: '40px' }}>

                            <NavLink className="company-name" style={{ fontSize: '23px', fontStyle: 'italic', color: 'yellow' }} to='/' >Samanaya</NavLink>
                        </div>

                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Search />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to="/cart" style={{ textDecoration: 'none' }} >
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-1" id="cart_count">{cartItems.length}</span>
                    </Link>

                    {user ? (
                        <div className='ml-4 dropdown d-inline' >
                            <Link to="#!" className="btn dropdown-toggle text-white" style={{marginRight:'20px'}} type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                                {user && user.role === 'admin' && (
                                    <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                                )}
                                <Link className="dropdown-item" to="/orders/me">Orders</Link>
                                <Link className="dropdown-item" to="/me">Profile</Link>
                                <Link className="dropdown-item text-danger" to="/"  onClick={logoutHandler} >
                                    Logout
                                </Link>

                            </div>
                        </div>

                    ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>}




                </div>
            </nav>
        </Fragment>
    )
}

export default Header