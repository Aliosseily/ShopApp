import { AsyncStorage } from 'react-native';
// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const authenticate = (userId, token) => {
    return { type: AUTHENTICATE, userId: userId, token: token }
}

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCJcu-OmAi8epiuosBcIYiFLK6N45jpk-8",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({//transfer object to json
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        )
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorResData)
            console.log(errorId)
            let message = "Something went wrong!";
            if (errorId === "EMAIL_EXISTS") {
                message = "This email is already exists!"
            }
            console.log("message", message)
            throw new Error(message);
        }
        const resData = await response.json();
        console.log(resData)
        // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId })
        dispatch(authenticate(resData.localId, resData.idToken))
        //getTime() get time in seconds 
        // *1000 convert it to milliseconds
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}


export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCJcu-OmAi8epiuosBcIYiFLK6N45jpk-8",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({//transfer object to json
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        )
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorResData)
            console.log(errorId)
            let message = "Something went wrong!";
            if (errorId === "EMAIL_NOT_FOUND") {
                message = "This email could be not found!"
            }
            else if (errorId === "INVALID_PASSWORD") {
                message = "This password is not valid !"
            }
            console.log("message", message)
            throw new Error(message);
        }
        const resData = await response.json();
        console.log(resData)
        // dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId })
        dispatch(authenticate(resData.localId, resData.idToken))
        //getTime() get time in seconds 
        // *1000 convert it to milliseconds
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const logout = () => {
    return { type: LOGOUT }
}


const saveDataToStorage = (token, userId, expirationDate) => {
    // takes to string arguments
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({// convert javascript object to string
            token: token,
            userId: userId,
            expiryDate: expirationDate
        }))
}

