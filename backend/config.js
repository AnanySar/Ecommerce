const ms = require('ms')

module.exports = {
    MONGODB_URL: "mongodb://127.0.0.1:27017/ecommerce",
    JWT_SECRET: "hdjbfbzkjdbjbjsbjfbjsbiwjqiojiauehu",
    JWT_EXPIRES_TIME: ms('7d'),
    COOKIE_EXPIRES_TIME: 7,
    FRONTEND_URL:'http://localhost:3000' ,// just to chcek reset password thing after deployment it wiil be removed

    STRIPE_SECRET_KEY : 'sk_test_51NrnwhSIrn1cPQ5FuQesdsdczYBMLWe35cb90NJNY95AAM1YsqhJ0ewkxQx5ZZJ94tDkdDNn1rJbVZBknVqowF736FBJJn00ALp0fc57',
    STRIPE_API_KEY : 'pk_test_51NrnwhSIrn1cPQ5FXhDWj5JdsfsDFzo4yrMrw0EujDe1VlecGcg7msNjwTtpzqJl1wcj9HEnsCXi4iP9ml8hpxVA3z0t4Oz00jgCFP34n'
    
    

}