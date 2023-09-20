import axios from 'axios'

import {
    LOGIN_SUCCESS,LOGIN_REQUEST,LOGIN_FAIL,
    REGISTER_USER_REQUEST,REGISTER_USER_SUCCESS,REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,LOAD_USER_SUCCESS,LOAD_USER_FAIL,
    ALL_USERS_REQUEST, ALL_USERS_SUCCESS, ALL_USERS_FAIL,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS,UPDATE_PROFILE_RESET,UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_RESET, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,FORGOT_PASSWORD_SUCCESS,FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,NEW_PASSWORD_SUCCESS,NEW_PASSWORD_FAIL,
    LOGOUT_SUCCESS, LOGOUT_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'

// login
export const login =(email,password)=> async(dispatch)=>{
    try {

        dispatch({type:LOGIN_REQUEST})

        const config ={
            headers:{
                'Content-Type':'application/json'
            }
        }

        const  {data} =await axios.post('/login',{email,password},config)

        dispatch({
            type:LOGIN_SUCCESS,
            payload:data.user
        })
        
    } catch (error) {
        // added console to check how to get the error to display by payload means used to check error.response.data.error output55555
        console.error('Complete Axios Error:', error);
        dispatch({
            type:LOGIN_FAIL,
            payload:error.response.data.error
        })
        
    }
}

// register user
export const register = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                //here contenttype is multipart bcz user/admin can upload files images that why
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/register', userData, config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.error
        })
    }
}

// load user which register newly or logged in 
export const loadUser = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_USER_REQUEST })

        const { data } = await axios.get('/me')

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.error
        })
    }
}


// logout user
export const logout = () => async (dispatch) => {
    try {

        await axios.get('/logout')

        dispatch({
            type: LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.error
        })
    }
}

// update user profile 
export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put('/me/update', userData, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.error
        })
    }
}

//  update password 
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put('/password/update', passwords, config)

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.error
        })
    }
}

// forget password

export const forgotPassword = (email) => async (dispatch) => {
    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/password/forget', email, config)

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {

        dispatch({ type: NEW_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/password/reset/${token}`, passwords, config)

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// get all users of our site
export const allUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get('/admin/users')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}


// clear  Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}