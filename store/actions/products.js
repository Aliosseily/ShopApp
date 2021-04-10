import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';


export const fetchProducts = () => {
    return async (dispatch,getState) => {
        console.log(getState())
        const userId = getState().auth.userId;//get user Id of currentlly loggedin user 
        console.log("111userId",userId)

        try {
            // fetch products data then dispatch , this done using thunk 
            const response = await fetch('https://shopapp-803cc-default-rtdb.firebaseio.com/products.json');

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            console.log("resData",resData)
            let loadedProducts = [];
            for (let key in resData) {
                loadedProducts.push(new Product(
                    key,
                    //'u1',
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                ))
            }
            console.log("userId",userId)
            console.log("loadedProducts",loadedProducts)
            dispatch({ 
                type: SET_PRODUCTS, 
                products: loadedProducts, 
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId) });
        } catch (err) {
            // you can add you logic here in case if error
            throw err;
        }
    }
}



export const deleteProduct = productId => {
    // we can add another argument(getState) to get access to current state of our Redux store.
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://shopapp-803cc-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('Something went wrong!')
        }
        dispatch({ type: DELETE_PRODUCT, pid: productId });
    }
}
// export const createProduct = (title, description, imageUrl, price)=>{
//     return{
//         type:CREATE_PRODUCT, 
//         productData:{
//             title,
//             description,
//             imageUrl,
//             price
//         }
//     }
// }


export const createProduct = (title, description, imageUrl, price) => {
    // we can add another argument(getState) to get access to current state of our Redux store.
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;//get user Id of currentlly loggedin user 
        // add any async code you want
        //firebase will add folder products.js
        const response = await fetch(`https://shopapp-803cc-default-rtdb.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({//convert object to json
                title,
                description,
                imageUrl,
                price,
                ownerId:userId
            })
        })
        const redData = await response.json();
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: redData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId:userId
            }
        });
    }
}

export const updateProduct = (id, title, description, imageUrl) => {
    // we can add another argument(getState) to get access to current state of our Redux store.
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://shopapp-803cc-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, {
            //PUT : will fully override the resource with the new data.
            //PATCH : will update it in the places where you till it to update it
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({//convert object to json
                title,
                description,
                imageUrl,
            })
        })
        if (!response.ok) {
            throw new Error('Something went wrong!')
        }
        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl,
            }
        });
    }
}

