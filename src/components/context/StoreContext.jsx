import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const url = "http://localhost:5000";

    // Create axios instance with default headers
    const api = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    const addToCart = async (itemId) => {
        const updatedCart = { ...cartItems };
        if (!updatedCart[itemId]) {
            updatedCart[itemId] = 1;
        } else {
            updatedCart[itemId] += 1;
        }
        setCartItems(updatedCart);

        if (token) {
            try {
                await api.post('/api/cart/add', { itemId });
            } catch (error) {
                console.error("Error adding to cart:", error);
                // Revert UI if API call fails
                setCartItems(prev => {
                    const reverted = { ...prev };
                    if (reverted[itemId] > 1) {
                        reverted[itemId] -= 1;
                    } else {
                        delete reverted[itemId];
                    }
                    return reverted;
                });
            }
        }
    };

    const removeFromCart = async (itemId) => {
        const updatedCart = { ...cartItems };
        if (updatedCart[itemId] > 1) {
            updatedCart[itemId] -= 1;
        } else {
            delete updatedCart[itemId];
        }
        setCartItems(updatedCart);

        if (token) {
            try {
                await api.post('/api/cart/remove', { itemId });
            } catch (error) {
                console.error("Error removing from cart:", error);
                // Revert UI if API call fails
                setCartItems(prev => ({
                    ...prev,
                    [itemId]: (prev[itemId] || 0) + 1
                }));
            }
        }
    };

    const getTotalCartAmount = () => {
        return food_list.reduce((total, product) => {
            const quantity = cartItems[product._id] || 0;
            return total + (product.price * quantity);
        }, 0);
    };

    const fetchFoodList = async () => {
        try {
            const response = await api.get("/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await api.post("/api/cart/get", {});
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("Failed to load cart data:", error);
            setCartItems({});
        }
    };

    useEffect(() => {
        if (token) {
            api.defaults.headers['token'] = token;
            loadCartData(token);
        }
    }, [token]);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
        fetchFoodList();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;