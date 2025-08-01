const BASE_URL = 'https://api.fortune-india.co.in/api';

const GlobalApi = {
  // Category APIs
  CATEGORY_ALL: `${BASE_URL}/category/all`,

  // Product APIs
  PRODUCT_ALL: `${BASE_URL}/product/all`,

  // User APIs
  USER_LOGIN: `${BASE_URL}/user/login`,
  USER_REGISTER: `${BASE_URL}/user/register`,

  // Food APIs
  FOOD_LIST: `${BASE_URL}/food/list`,

  // Cart APIs
  CART_ADD: `${BASE_URL}/cart/add`,
  CART_REMOVE: `${BASE_URL}/cart/remove`,
  CART_GET: `${BASE_URL}/cart/get`,
  CART_CLEAR: `${BASE_URL}/cart/clear`,

  CONTACT_SUBMIT: `${BASE_URL}/contact/submit`,

   // ✅ Orders
  USER_ORDERS: `${BASE_URL}/order/userorders`,

   // User
  USER_LOGIN: `${BASE_URL}/user/login`,
  USER_REGISTER: `${BASE_URL}/user/register`,

};

export default GlobalApi;
