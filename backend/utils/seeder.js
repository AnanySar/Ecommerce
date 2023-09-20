const mongoose =require('mongoose');
const Product=require('../models/product')
const products=require('../data/products.json')




const {MONGODB_URL}=require('../config');

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected',()=>{
    console.log('Database Connected');
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})



const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(products)
        console.log('All Products are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts()