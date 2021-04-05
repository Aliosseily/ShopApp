import React , {useEffect,useState} from 'react';
import {View, FlatList, Text, Platform, ActivityIndicator, StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/order'
import Colors from '../../constants/Colors';



const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false); 
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders);
// you can use .then also instead of async await 
useEffect(()=>{
    setIsLoading(true);
        dispatch(orderActions.fetchOrder()).then(()=>{
        setIsLoading(false);
       })
},[dispatch])

if(isLoading){
    return(
    <View style={styles.centered}>
<ActivityIndicator size="large" color={Colors.primary} ></ActivityIndicator>
    </View>
    )
}

    return(
        <FlatList 
        data={orders}
        keyExtractor={item => item.id}
        renderItem={itemData => <OrderItem
        amount={itemData.item.totalAmount}
        date={itemData.item.readableDate}
        items={itemData.item.items}
        />}
        />
    )
}
// OrdersScreen.navigationOptions = {
//     headerTitle:"Your Orders"
// }
OrdersScreen.navigationOptions = navData => {
    return{
        headerLeft : ()=><HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
        title='Menu'
         iconName={Platform.OS==='android' ? 'md-menu' : 'ios-menu'}
         onPress={() => {
            navData.navigation.toggleDrawer();
         }}
         />
    </HeaderButtons>,
    headerTitle:"Your Orders"
    }
}

const styles= StyleSheet.create({
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default OrdersScreen;    