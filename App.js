import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/order';
import ShopNavigator from './navigation/ShopNavigator';
import *  as Font from 'expo-font'
import AppLoading from 'expo-app-loading';
import ReduxThunk from 'redux-thunk'
import authReducer from './store/reducers/auth';

//import { composeWithDevTools } from 'redux-devtools-extension'; // use this only while development 

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders:ordersReducer,
  auth:authReducer

})
const store = createStore(rootReducer , applyMiddleware(ReduxThunk));
//const store = createStore(rootReducer,composeWithDevTools);
 const fetchFonts = () =>{
   return Font.loadAsync({
     'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
     'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf')
   })
 }
export default function App() {
  // to remove warnings from app
  console.disableYellowBox = true;
   const [fontLoaded , setFontLoaded] = useState(false);

   if(!fontLoaded){
     return <AppLoading
     startAsync = {fetchFonts}
     onFinish={() =>{setFontLoaded(true)}}
     onError = {(err) => console.log(err)}
     />
 }
  return (<Provider store={store}><ShopNavigator /></Provider>);
}

