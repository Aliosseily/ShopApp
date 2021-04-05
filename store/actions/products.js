import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';


export const fetchProducts = () => {
    return async dispatch => {
        try {
            // fetch products data then dispatch , this done using thunk 
            const response = await fetch('https://shopapp-803cc-default-rtdb.firebaseio.com/products.json');

            if (!response.ok){
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            let loadedProducts = [];
            for (let key in resData) {
                loadedProducts.push(new Product(
                    key,
                    'u1',
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price,
                ))
            }
            dispatch({ type: SET_PRODUCTS, products: loadedProducts });
        } catch (err) {
            // you can add you logic here in case if error
            throw err;
        }
    }
}



export const deleteProduct = productId => {
    return { type: DELETE_PRODUCT, pid: productId }
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
    return async dispatch => {
        // add any async code you want
        //firebase will add folder products.js
        const respone = await fetch('https://shopapp-803cc-default-rtdb.firebaseio.com/products.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({//convert object to json
                title,
                description,
                imageUrl,
                price
            })
        })
        const redData = await respone.json();
        return ({
            type: CREATE_PRODUCT,
            productData: {
                id: redData.name,
                title,
                description,
                imageUrl,
                price
            }
        });
    }
}

export const updateProduct = (id, title, description, imageUrl) => {
    return {
        type: UPDATE_PRODUCT,
        pid: id,
        productData: {
            title,
            description,
            imageUrl,
        }
    }
}

