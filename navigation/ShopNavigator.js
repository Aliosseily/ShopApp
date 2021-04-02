import React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import { Platform } from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
//https://www.npmjs.com/package/react-navigation-drawer
import { createDrawerNavigator } from 'react-navigation-drawer';
import Colors from '../constants/Colors'; 
import {Ionicons} from '@expo/vector-icons';
const defaultNavoptions = {
    headerStyle:{
        backgroundColor:Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor:Platform.OS === 'android' ? 'white': Colors.primary 
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview : ProductsOverviewScreen,
    ProductDetail : ProductDetailScreen,
    Cart : CartScreen
},{
    navigationOptions:{
        drawerIcon : drawerConfig => (
            <Ionicons
            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            size={23}
            color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavoptions
})

const OrdersNavigator = createStackNavigator({
    Orders : OrdersScreen
},{
    navigationOptions:{
        drawerIcon : drawerConfig => (
            <Ionicons
            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
            size={23}
            color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavoptions
})
// add the two stack navigators above in the drawer here
const ShopNavigator = createDrawerNavigator({
    Products:ProductsNavigator,
    Orders: OrdersNavigator
},{
    contentOptions : {
        activeTintColor:Colors.primary
    }
})

// export default createAppContainer(ProductsNavigator);
 export default createAppContainer(ShopNavigator);