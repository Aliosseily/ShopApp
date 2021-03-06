import React, { useState, useEffect,useCallback } from 'react';
import { FlatList, Button, Platform, View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import * as productActions from '../../store/actions/products'
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Colors'
const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const Products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();


    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        // setIsLoading(true); remove it from here because of refreshing 
        try {
            await dispatch(productActions.fetchProducts())
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false);

        // setIsLoading(false);

    },[dispatch,setIsLoading,setError]);


     useEffect(()=>{
        const willFocusSub =  props.navigation.addListener('willFocus',loadProducts);
        return()=>{
            willFocusSub.remove(); // this will get rid of the subscription once this component is basically unmounted or whenever it will rerun 
        }
     },[loadProducts])
    // fire this whenever this component loads
    useEffect(() => {
        setIsLoading(true)
        loadProducts().then(()=>{
            setIsLoading(false)
        });
    }, [dispatch,loadProducts])

    const selectItemHandler = (id, title) => {
        // props.navigation.navigate('ProductDetail')
        props.navigation.navigate('ProductDetail',
            {
                productId: id,
                productTitle: title,
            }
        )
    }
console.log("error",error)
    if (error) {
        return <View style={styles.centered}>
            <Text>An error occured!</Text>
            <Button title='Try again' onPress={loadProducts} color={Colors.primary}/>
        </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if (!isLoading && Products.length === 0) {
        return <View style={styles.centered}>
            <Text>No products found. Maybe start adding some!</Text>
        </View>
    }

    return <FlatList
    onRefresh={loadProducts}
        data={Products}
        refreshing={isRefreshing}
        keyExtractor={item => item.id}
        renderItem={itemData =>
            <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }}
            >
                <Button color={Colors.primary} title='Details'
                    onPress={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }} />
                <Button color={Colors.primary} title='To Cart'
                    onPress={() => {
                        dispatch(cartActions.addToCart(itemData.item));
                    }} />
            </ProductItem>
        }
    />
}
ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title='Menu'
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
        </HeaderButtons>,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title='Cart'
                iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {
                    navData.navigation.navigate('Cart')
                }}
            />
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default ProductsOverviewScreen;