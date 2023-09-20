import React, { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import CheckoutSteps from './CheckoutSteps'

import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder, clearErrors } from '../../actions/orderAction'

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

import axios from 'axios'

// css for card expire 
const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}

const Payment = () => {


    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth)
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { error } = useSelector(state => state.newOrder)

    useEffect(() => {

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            dispatch(clearErrors())
        }

    }, [dispatch, error])

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }


    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }


    const submitHandler = async (e) => {
        e.preventDefault();

        document.querySelector('#pay_btn').disabled = true;

        let res;
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            res = await axios.post('/payment/process', paymentData, config)

            const clientSecret = res.data.client_secret;

            console.log(clientSecret);

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });
            console.log(result);

            if (result.error) {
                // alert.error(result.error.message); todo chance with swal
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error.message,
                });
                document.querySelector('#pay_btn').disabled = false;
            } else {
                // the payment is proccesed or not
                if (result.paymentIntent.status === 'succeeded') {

                    Swal.fire({
                        icon:'success',
                        title:'Success',
                        text:'Payment Done  Successfully'
                    })

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }

                    dispatch(createOrder(order)) 

                    
                    navigate('/success')

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'there is Some issue while payment proccessing',
                    });
                }
            }



        } catch (error) {
            document.querySelector('#pay_btn').disabled = false;
            console.log(error);
            console.log(error.response.data)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }


    }

    return (
        <Fragment>


            <CheckoutSteps shipping confirmOrder payment />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} >
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group" >
                            <label htmlFor="card_num_field" style={{ marginBottom: '5px' }}>Card Number</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '5px' }}>
                            <label htmlFor="card_exp_field" style={{ marginBottom: '5px' }}>Card Expiry</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '5px' }}>
                            <label htmlFor="card_cvc_field" style={{ marginBottom: '5px' }}>Card CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                options={options}
                            />
                        </div>


                        <button
                            id="pay_btn"
                            type="submit"
                            style={{
                                display: 'block',
                                width: '100%'
                            }}
                            className="btn btn-block py-3"
                        >
                            Pay {` - ${orderInfo && orderInfo.totalPrice}`}
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Payment