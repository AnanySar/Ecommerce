const Product = require('../models/product')
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')


// create new product only admin
exports.newProduct = async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}


exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 4;



        const apiFeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(resPerPage);

        // Execute the query once and store the result
        const products = await apiFeatures.query;

        // Count documents separately
        const productsCount = await Product.countDocuments();
        const filteredProductsCount = products.length;

        res.status(200).json({
            success: true,
            resPerPage,
            productsCount,
            filteredProductsCount,
            products
        });
    } catch (error) {
        // Handle errors here
        next(error);
    }
};

// Get all products (Admin) 
exports.getAdminProducts = async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

}

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    res.status(200).json({
        success: true,
        product
    })
}


// update product admin
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.image.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.image[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.image = imagesLinks

    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true

    })

    res.status(200).json({
        success: true,
        product

    })

}


// delete product admin
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    await product.deleteOne();

    // Deleting images associated with the product
    for (let i = 0; i < product.image.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.image[i].public_id)
    }

    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })
}

// create new review and update review 
exports.createProductReview = async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment

    }

    const product = await Product.findById(productId);
    // check product is review or not
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    // if reviewed by same user before updating the comment and rating
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
        /// if not reviewed than pushing the review to database
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    // now updating the overall rating of particular product

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // saving the product and also validation is off so that review is updated in datbase and then validation can activated
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

}

// get one product all reviews 
exports.getProductsReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}

// delete the review of product
exports.deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId)


    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());


    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length


    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        success: true,

    })
}