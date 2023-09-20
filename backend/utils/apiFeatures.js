const { deleteOne } = require("../models/product");

class APIFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;

    }

    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex :this.queryStr.keyword,
                $options:'i'
            }

        } :{}

        console.log(keyword) //to check what is keyword or user searched 


        this.query =this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={ ...this.queryStr};
        console.log(queryCopy);

        //removing fields from the query
        const removefields=['keyword','limit','page']
        removefields.forEach(e1=>delete queryCopy[e1]);

        console.log(queryCopy);

        // advanced filter for price rating etc
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=> `$${match}` )



        
        this.query=this.query.find(JSON.parse(queryStr));
        return this;

    }
    // no of product shown in every page 
    pagination(resPerPage){
        const currentPage= Number(this.queryStr.page) ||1;
        const skip=resPerPage*(currentPage-1);

        this.query=this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports=APIFeatures;