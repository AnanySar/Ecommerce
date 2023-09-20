import React, { Fragment, useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { getProducts } from '../actions/productActions';
import Product from './product/Product';
import Loader from './layout/Loader';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
   
   

    const dispatch = useDispatch();

    const { loading, products, error, productsCount, resPerPage,filteredProductsCount } = useSelector(state => state.products);
    const { keyword } = useParams();

    useEffect(() => {
        dispatch(getProducts( keyword,currentPage));
    }, [dispatch,keyword, currentPage]);

    

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber);
    }
    
   
   

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product key={product._id} product={product}/>
                            ))}
                        </div>
                          
                    </section>
                    
                    {resPerPage < productsCount  && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;
