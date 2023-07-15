export const includeDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
            // Calculate items price.
            state.itemsPrice = includeDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
            // Calculate shipping price when order is over $900 MXN.
            state.shippingPrice = includeDecimals(state.itemsPrice > 999 ? 0 : 99);
            // Calculate tax price 
            state.taxPrice = includeDecimals(Number ((0.15*state.itemsPrice).toFixed(2)));
            // Calculate total amount for purchase
            state.totalPrice = (
                Number(state.itemsPrice)+Number(state.shippingPrice)+Number(state.taxPrice)
                ).toFixed(2);
                localStorage.setItem('cart', JSON.stringify(state));

            return state;
            
}