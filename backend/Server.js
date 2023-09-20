const express = require('express');
const mongoose =require('mongoose');
const Port =4002;
const app=express();
const cors = require('cors');
const cookieParser=require('cookie-parser');
const bodyparser=require('body-parser');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload')




const {MONGODB_URL}=require('./config');

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected',()=>{
    console.log('Database Connected');
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})

app.use(express.json({limit: '50mb'}));

app.use(bodyparser.json({limit: '50mb'}));

app.use(bodyparser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

app.use(cookieParser());

app.use(fileUpload())



// setting up cloudinary configuration
// this is wrong key and secrer to show on github u can use yours
          
cloudinary.config({ 
  cloud_name: 'dddyvhqddzdfc', 
  api_key: '31872543551489sdAS32', 
  api_secret: 'MPMgrvrQhKQk4BsdaSdsdASrYngxqij19rw' 
});


//import all routes
app.use(require('./routes/product_route'));
app.use(require('./routes/auth'));
app.use(require('./routes/order'));
app.use(require('./routes/payment'));





app.listen(Port,()=>{
    console.log('Server has started')
    console.log(Port)
})