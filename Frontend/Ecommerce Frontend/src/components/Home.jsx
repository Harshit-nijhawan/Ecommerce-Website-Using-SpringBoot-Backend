import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [ads, setAds] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  // Fetch product images
  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };
      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  // Fetch advertisements
  useEffect(() => {
    const fetchAds = async () => {
  try {
    // Use the new environment variable for the ads service
    const response = await axios.get(`${import.meta.env.VITE_ADS_API_URL}/ads` || "http://localhost:8083/ads");
    setAds(response.data);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
  }
};
fetchAds();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img
          src={unplugged}
          alt="Error"
          style={{ width: "100px", height: "100px" }}
        />
      </h2>
    );
  }

  return (
  <div style={{ paddingTop: "60px" }}> {/* <-- Add padding equal to navbar height */}
    {/* Advertisement Section */}
{ads.length > 0 && (
  <div
    style={{
      overflow: "hidden",
      // background: "#f8f8f8",
      padding: "20px 0",
      // borderBottom: "1px solid #eaeaea",
    }}
  >
    <div
      style={{
        display: "inline-flex",
        gap: "20px",
        paddingLeft: "10px",
        animation: "scrollAds 25s linear infinite",
      }}
    >
      {[...ads, ...ads].map((ad, index) => (
        <a
          key={index}
          href={ad.redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: "0 0 auto",
            display: "inline-block",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <img
            src={ad.imageUrl}
            alt={ad.title}
            style={{
              height: "170px",
              width: "260px",
              objectFit: "fill",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
            }}
          />
        </a>
      ))}
    </div>
  </div>
)}



    {/* Products Grid */}
    <div
  className="grid"
  style={{
    marginTop: "20px",      // current
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px",
    paddingTop: "40px",     // <-- add this to push the cards lower
  }}
    >
      {filteredProducts.length === 0 ? (
        <h2
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No Products Available
        </h2>
      ) : (
        filteredProducts.map((product) => {
          const { id, brand, name, price, productAvailable, imageUrl } =
            product;
          return (
            <div
              className="card mb-3"
              style={{
                width: "250px",
                height: "360px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: productAvailable ? "#fff" : "#ccc",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
              key={id}
            >
              <Link
                to={`/product/${id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    padding: "5px",
                    margin: "0",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                />
                <div
                  className="card-body"
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div>
                    <h5
                      className="card-title"
                      style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                    >
                      {name.toUpperCase()}
                    </h5>
                    <i
                      className="card-brand"
                      style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                    >
                      {"~ " + brand}
                    </i>
                  </div>
                  <hr className="hr-line" style={{ margin: "10px 0" }} />
                  <div className="home-cart-price">
                    <h5
                      className="card-text"
                      style={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        marginBottom: "5px",
                      }}
                    >
                      <i className="bi bi-currency-rupee"></i>
                      {price}
                    </h5>
                  </div>
                  <button
                    className="btn-hover color-9"
                    style={{ margin: "10px 25px 0px " }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    disabled={!productAvailable}
                  >
                    {productAvailable ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  </div>
);
};

export default Home;
