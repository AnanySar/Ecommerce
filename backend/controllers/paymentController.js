const config = require('../config');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);


// Process stripe payments   =>   /payment/process
exports.processPayment = async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'INR',

        metadata: {
             integration_check: 'accept_a_payment' ,
             description: 'Software development services',
             customerName:'Sam',
             address:'123 test lko '
             
            }
        
    });
    

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })

}

// Send stripe API Key  
exports.sendStripApi = async (req, res, next) => {

    res.status(200).json({
         stripeApiKey: config.STRIPE_API_KEY
    })

}