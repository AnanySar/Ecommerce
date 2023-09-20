import React, { Fragment, useState } from 'react'
//install package countries-list it has all country and city details
import {countries} from 'countries-list'

import CheckoutSteps from './CheckoutSteps'
import {useNavigate} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartAction'

const Shipping = ({  }) => {

    const navigate =useNavigate();
    const countriesList = Object.values(countries)
    

    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode)
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)
    const [country, setCountry] = useState(shippingInfo.country)

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }))
        navigate('/order/confirm')
    }

    return (
        <Fragment>

            

            <CheckoutSteps shipping />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group" >
                            <label htmlFor="address_field" style={{marginBottom:'5px'}}>Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group"style={{marginTop:'5px'}}>
                            <label htmlFor="city_field" style={{marginBottom:'5px'}}>City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group"style={{marginTop:'5px'}}>
                            <label htmlFor="phone_field"style={{marginBottom:'5px'}}>Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group"style={{marginTop:'5px'}}>
                            <label htmlFor="postal_code_field"style={{marginBottom:'5px'}}>Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group"style={{marginTop:'5px'}}>
                            <label htmlFor="country_field" style={{marginBottom:'5px'}}>Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >

                                {countriesList.map(country => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                            style={{
                                display: 'block',
                                width: '100%'       
                            }}
                        >
                            CONTINUE
                            </button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Shipping