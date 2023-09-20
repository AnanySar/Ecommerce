import axios from 'axios';

import { ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL,
     CLEAR_ERRORS,
     PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL,
     NEW_REVIEW_REQUEST, NEW_REVIEW_SUCCESS, NEW_REVIEW_RESET, NEW_REVIEW_FAIL, 
     ADMIN_PRODUCTS_REQUEST, ADMIN_PRODUCTS_SUCCESS, ADMIN_PRODUCTS_FAIL,
     NEW_PRODUCT_REQUEST, NEW_PRODUCT_SUCCESS, NEW_PRODUCT_RESET, NEW_PRODUCT_FAIL,
     DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESS, DELETE_PRODUCT_RESET, DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_RESET, UPDATE_PRODUCT_FAIL,
} from '../constants/productConstants'

export const getProducts = (keyword='', currentPage=1)=> async(dispatch)=>{
    try {
        dispatch({type:ALL_PRODUCTS_REQUEST})
        

       

        const { data } = await axios.get(`/products?keyword=${keyword}&page=${currentPage}`)


        dispatch({
            type:ALL_PRODUCTS_SUCCESS,
            payload:data
        })
        
    } catch (error) {
        dispatch({
            type:ALL_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}

// create new product by admin
export const newProduct = (productData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_PRODUCT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/admin/products/new`, productData, config)

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// delete products only admin

export const deleteProduct = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_PRODUCT_REQUEST })

        const { data } = await axios.delete(`/admin/products/${id}`)

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update Product  only admin
export const updateProduct = (id, productData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PRODUCT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/admin/products/${id}`, productData, config)

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}



//get products details
export const getProductDetails = (id)=> async(dispatch)=>{
    try {
        dispatch({type:PRODUCT_DETAILS_REQUEST})

        const {data} = await axios.get(`/products/${id}`)

        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data.product
        })
        
    } catch (error) {
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

// new reviews 
export const newReview = (reviewData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_REVIEW_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/review`, reviewData, config)

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

// get all admin product 
export const getAdminProducts = () => async (dispatch) => {
    try {

        dispatch({ type: ADMIN_PRODUCTS_REQUEST })

        const { data } = await axios.get(`/admin/products`)

        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products
        })

    } catch (error) {

        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
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
