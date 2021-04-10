import React from 'react'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator, DrawerItems } from "react-navigation";
import { Platform, SafeAreaView, Button, View } from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import AuthScreen from '../screens/user/AuthScreen';
import UserProductScreen from '../screens/user/UserProductsScreen'
import EditProductScreen from '../screens/user/EditProductScreen';
import StartupScreen from '../screens/StartupScreen';
//https://www.npmjs.com/package/react-navigation-drawer
import { createDrawerNavigator } from 'react-navigation-drawer';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth'
const defaultNavoptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
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
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavoptions
})

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavoptions
})
// add all the above stack navigators above in the drawer here
const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    // this allow u to add your own content for the side drawer instead of the default content
    contentComponent: props => {
        const dispatch = useDispatch();
        return (<View style={{ flex: 1, paddingTop: 30 }}>
            {/* tjis control how this layed out*/}
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <DrawerItems {...props} />
                <Button
                    title="Logout"
                    color={Colors.primary}
                    onPress={() => {
                        dispatch(authActions.logout())
                        //props.navigation.navigate('Auth')
                    }} />

            </SafeAreaView>
        </View>
        )
    }
})

const AuthNavigtor = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavoptions
    }
)

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigtor,
    Shop: ShopNavigator
})


// export default createAppContainer(ProductsNavigator);
//  export default createAppContainer(ShopNavigator);
export default createAppContainer(MainNavigator);