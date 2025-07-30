import React, { useContext, useEffect, useMemo, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, clearCart, setToken } = useContext(StoreContext);
  
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate shipping per product based on quantity
  const calculateShippingForProduct = (quantity) => {
    return 550 + (quantity - 1) * 55;
  };

  // Calculate total shipping for all items
  const totalShipping = useMemo(() => {
    let total = 0;
    for (const itemId in cartItems) {
      const qty = cartItems[itemId];
      total += calculateShippingForProduct(qty);
    }
    return total;
  }, [cartItems]);

  // Calculate total amount including shipping
  const totalAmount = useMemo(() => {
    return getTotalCartAmount() + totalShipping;
  }, [getTotalCartAmount, totalShipping]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Validate phone number
      if (!/^\d{10}$/.test(data.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Prepare order items
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
          image: item.image,
          shippingCharge: calculateShippingForProduct(cartItems[item._id])
        }));

      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount(),
        shippingCharge: totalShipping,
        totalAmount: totalAmount
      };

      // Step 1: Create order on backend
      const orderResponse = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { orderId, razorpayOrderId, amount, key } = orderResponse.data;

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please refresh the page.');
      }

      // Step 3: Initialize Razorpay payment
      const options = {
        key: key || process.env.RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: "INR",
        name: "Fortune India",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function(response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(`${url}/api/order/verify`, {
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            }, { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (verifyResponse.data.success) {
              toast.success('Payment successful! Order placed.');
              clearCart();
              navigate('/order-success', { state: { orderId } });
            } else {
              toast.error(verifyResponse.data.message || 'Payment verification failed');
              navigate('/order-failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            if (error.response?.status === 401) {
              localStorage.removeItem('token');
              setToken('');
              navigate('/login');
              toast.error('Session expired. Please login again.');
            } else {
              toast.error('Error verifying payment. Please contact support.');
              navigate('/order-failed');
            }
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        notes: {
          address: `${data.street}, ${data.city}, ${data.state} - ${data.zipcode}`
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment window closed. Your order is still pending.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function(response) {
        toast.error(`Payment failed: ${response.error.description}`);
        console.error(response.error);
      });

    } catch (error) {
      console.error('Order error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken('');
        navigate('/login');
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(error.message || 'Failed to process order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <>
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input 
            required 
            name='firstName' 
            onChange={onChangeHandler} 
            value={data.firstName} 
            type="text" 
            placeholder='First Name'
          />
          <input 
            required 
            name='lastName' 
            onChange={onChangeHandler} 
            value={data.lastName} 
            type="text" 
            placeholder='Last Name'
          />
        </div>
        <input 
          required 
          name='email' 
          onChange={onChangeHandler} 
          value={data.email} 
          type="email" 
          placeholder='Email address'
        />
        <input 
          required 
          name='street' 
          onChange={onChangeHandler} 
          value={data.street} 
          type="text" 
          placeholder='Street'
        />
        <div className="multi-fields">
          <input 
            required 
            name='city' 
            onChange={onChangeHandler} 
            value={data.city} 
            type="text" 
            placeholder='City'
          />
          <input 
            required 
            name='state' 
            onChange={onChangeHandler} 
            value={data.state} 
            type="text" 
            placeholder='State'
          />
        </div>
        <div className="multi-fields">
          <input 
            required 
            name='zipcode' 
            onChange={onChangeHandler} 
            value={data.zipcode} 
            type="text" 
            placeholder='Zip code'
            pattern="[0-9]{6}"
            title="6-digit zip code"
          />
          <input 
            required 
            name='country' 
            onChange={onChangeHandler} 
            value={data.country} 
            type="text" 
            placeholder='Country' 
            readOnly 
          />
        </div>
        <input 
          required 
          name='phone' 
          onChange={onChangeHandler} 
          value={data.phone} 
          type="tel" 
          placeholder='Phone' 
          pattern="[0-9]{10}"
          title="10-digit phone number"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount().toLocaleString('en-IN')}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Shipping & Packaging</p>
              <p>₹{totalShipping.toLocaleString('en-IN')}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total Amount</b>
              <b>₹{totalAmount.toLocaleString('en-IN')}</b>
            </div>
          </div>
          <div className="shipping-notice">
            <p>Shipping calculation: ₹550 base + ₹55 per additional item</p>
          </div>
          <button 
            type='submit' 
            className='payment-btn' 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              'PROCEED TO PAYMENT'
            )}
          </button>
        </div>
        
      </div>
     
      
    </form>
     <div>
        For Outside INDIA order , please Contact us
      </div>
      </>
  );
};

export default PlaceOrder;