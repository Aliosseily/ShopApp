import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrder = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;//get user Id of currentlly loggedin user 

        try {
            // fetch products data then dispatch , this done using thunk 
            const response = await fetch(`https://shopapp-803cc-default-rtdb.firebaseio.com/orders/${userId}.json`);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            console.log(resData)
            let loadedOrders = [];
            for (let key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)

                ))
            }
            dispatch({ type: SET_ORDERS, orders: loadedOrders })
        } catch (err) {
            // you can add you logic here in case if error
            throw err;
        }
    }
}

export const addOrder = (cartItems, totalAmount) => {
    // we can add another argument(getState) to get access to current state of our Redux store.
    return async (dispatch, getState) => {
        const token = getState().auth.token;//get user token       
        const userId = getState().auth.userId;//get user Id of currentlly logedin user 
        const date = new Date();
        const response = await fetch(`https://shopapp-803cc-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({//convert object to json
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        })
        if (!response.ok) {
            throw new Error('Some thing went wrong')
        }
        const resData = await response.json();
        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        })
    }
}
