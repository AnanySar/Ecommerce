const Order = require('../models/order');
const Product = require('../models/product');

exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
}

// get single order by its ids
exports.getsingleOrder=async(req,res,next)=>{
    const order= await Order.findById(req.params.id).populate('user','name email')

    if(!order){
        return res.status(404).json('no order found with this id')
    }

    res.status(200).json({
        success:true,
        order
    })
}

// get logged in user  order 
exports.myOrders=async(req,res,next)=>{
    const orders= await Order.find({ user: req.user.id})


    res.status(200).json({
        success:true,
        orders
    })
}

// get all orders for admin
exports.allOrders=async(req,res,next)=>{
    const orders= await Order.find()

    let totalAmount =0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })


    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
}


// update and process of order by admin
exports.updateOrder=async(req,res,next)=>{
    const order= await Order.findById(req.params.id)

    if(order.orderStatus === 'Delivered'){
        return res.status(400).json('you have alredy delivered this order')
    }

    order.orderItems.forEach(async item=>{
        await updateStock(item.product,item.quantity)
    })

    order.orderStatus=req.body.status,
    order.deliveredAt = Date.now()

    await order.save()


    res.status(200).json({
        success:true,
        
    })
}

// fuction to update the stock of product after order delivered 
async function updateStock(id,quantity){
    const product = await Product.findById(id);
    console.log(product);

    product.stock = product.stock - quantity;
    console.log(product.stock);

    await product.save({validateBeforeSave:false});
}

// delete order
exports.deleteOrder=async(req,res,next)=>{
    const order= await Order.findById(req.params.id)

    if(!order){
        return res.status(404).json('no order found with this id')
    }

    await order.deleteOne();

    res.status(200).json({
        success:true,
        
    })
}
