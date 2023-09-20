import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from './components/layout/Header';
import './App.css';
import Footer from './components/layout/Footer';

import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';

// cart imports
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';

// order imports
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';


// auth or user imports
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgetPassword from './components/user/ForgetPassword';
import ResetPassword from './components/user/ResetPassword';

// Admin imports
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';

import { loadUser } from './actions/userAction'
import store from './store'
import axios from 'axios';

//payment
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';






function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/stripeapi');
      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey()

  }, [])


  return (
    <Router>
      <div className="App">
        <Header />
        {/* added div class of  bootstrap to make page responsive or which is center part of page  */}
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/search/:keyword' Component={Home}></Route>
            <Route exact path='/product/:id' Component={ProductDetails} />

            <Route exact path='/cart' Component={Cart}></Route>
            <Route exact path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
            <Route exact path='/order/confirm' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
            <Route exact path='/success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            {stripeApiKey &&
              <Route path="/payment"
                element={
                  <ProtectedRoute>
                    <Elements stripe={loadStripe(stripeApiKey)}>
                      <Payment />
                    </Elements>
                  </ProtectedRoute>
                }
              />
            }

            <Route path='/login' Component={Login}></Route>
            <Route path='/register' Component={Register}></Route>
            <Route exact path='/password/forget' Component={ForgetPassword}></Route>
            <Route exact path='/password/reset/:token' Component={ResetPassword}></Route>
            <Route exact path='/me' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route exact path='/me/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
            <Route exact path='/password/update' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />

            <Route exact path='/orders/me' element={<ProtectedRoute><ListOrders /></ProtectedRoute>} />
            <Route exact path='/order/:id' element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />


          </Routes>
        </div>
        <Routes>
          <Route exact path="/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route exact path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductsList /></ProtectedRoute>} />
          <Route exact path="/admin/product" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
          <Route exact path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
          <Route exact path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrdersList /></ProtectedRoute>} />
          <Route exact path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>} />
          <Route exact path="/admin/users" element={<ProtectedRoute isAdmin={true}><UsersList/></ProtectedRoute>} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
