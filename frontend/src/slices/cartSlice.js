import  {createSlice} from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {cartItems: []};

const includeDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;

            // Check if the item is already in the cart
            const existItem =state.cartItems.find((i) => i._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((i) => i._id === existItem._id ? item : i);
            } else {
                state.cartItems = [...state.cartItems, item];    
            }

            // Calculate items price.
            state.itemsPrice = includeDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
            // Calculate shipping price when order is over $900 MXN.
            state.shippingPrice = includeDecimals(state.itemsPrice > 900 ? 0 : 99);
            // Calculate tax price 
            // Calculate total amount for purchase
        }
    }    
});

export default cartSlice.reducer; 