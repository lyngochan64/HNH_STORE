import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ProductPreview from "../components/ProductPreview";
import "./CategoryPage.css";
import Pagination from "../components/Pagination";


function CategoryPage() {
    const { category } = useParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");

    useEffect(() => {
        setLoading(true);
        axios
            .get(`/products/category/${category}`)
            .then(({ data }) => {
                setLoading(false);
                setProducts(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e.message);
            });
    }, [category]);

    if (loading) {
        <Loading />;
    }
    const priceRanges = ["All", "0-50", "50-100", "100-200", "200+"]; // Define your price ranges
    const filterProductsByPrice = () => {
        setLoading(true);
        if (selectedPriceRange === "All") {
            // Reset to all products
            axios
                .get(`/products/category/${category}`)
                .then(({ data }) => {
                    setLoading(false);
                    setProducts(data);
                })
                .catch((e) => {
                    setLoading(false);
                    console.log(e.message);
                });
        } else {
            // Filter by the selected price range
            const [min, max] = selectedPriceRange.split("-");
            axios
                .get(`/products/category/${category}?minPrice=${min}&maxPrice=${max}`)
                .then(({ data }) => {
                    setLoading(false);
                    setProducts(data);
                })
                .catch((e) => {
                    setLoading(false);
                    console.log(e.message);
                });
        }
    };

    const handlePriceRangeChange = (event) => {
        setSelectedPriceRange(event.target.value);
    };


    const productsSearch = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    function ProductSearch({ _id, category, name, pictures, price }) {
        return <ProductPreview _id={_id} category={category} name={name} pictures={pictures} price={price} />;
    }
    return (
        <div className="category-page-container">
            <div className={`pt-3 ${category}-banner-container category-banner-container`}>
                <h1 className="text-center">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            </div>

            <div className="filters-container d-flex justify-content-center pt-4 pb-4">
                <input type="search" placeholder="Tìm kiếm" onChange={(e) => setSearchTerm(e.target.value)} />
                <select style={{ marginLeft : "20px"}} className="price-dropdown" value={selectedPriceRange} onChange={handlePriceRangeChange}>
        {priceRanges.map((range) => (
            <option key={range} value={range}>
                {range}
            </option>
        ))}
    </select>
    
    {/* Styled button to trigger filtering */}
    <button className="filter-button" onClick={filterProductsByPrice}>Lọc</button>

            
            </div>
            {productsSearch.length === 0 ? (
                <h1>No products to show</h1>
            ) : (
                <Container>
                    <Row>
                        <Col md={{ span: 10, offset: 1 }}>
                            <Pagination data={productsSearch} RenderComponent={ProductSearch} pageLimit={1} dataLimit={16} tablePagination={false} />
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}

export default CategoryPage;