import React, { useEffect , useRef } from 'react';

import ShopNavigator from './ShopNavigator';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

const NavigationContainer = props => {
    // !! will force isAuth variable to be true or false if we have no token
    const isAuth = useSelector(state => !!state.auth.token)
    //we can use useRef to get access to the navigation functionality with the help of this component when we use it in our jsx code
    const navRef = useRef();
    useEffect(() => {
        if (!isAuth) { // if not authenticated 
            // the navigator is here and only inm components that are rendered  with the help of the navigator we have access to props.navigation.navigate
            // this is how we navigate from inside this component even though it's outside os the navigator
            navRef.current.dispatch(
                 NavigationActions.navigate({
                     routeName:"Auth"
                 })
             )
        }
    }, [isAuth]);

    return (
        <ShopNavigator ref={navRef} /> // this will establish a connection between navRef constant and this element which in the end is rednered here
    )
}

export default NavigationContainer;