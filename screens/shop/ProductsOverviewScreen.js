import React from 'react';
import { FlatList, Text } from 'react-native'
import { useSelector } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
const ProductsOverviewScreen = props => {
    const Products = useSelector(state => state.products.availableProducts);

    return <FlatList
        data={Products}
        keyExtractor={item => item.id}
        renderItem={itemData =>
            <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onViewDetail={() => {
                    // props.navigation.navigate('ProductDetail')
                    props.navigation.navigate({ routeName: 'ProductDetail' })
                }}
                onAddToCart={() => { }}
            />
        }
    />
}
ProductsOverviewScreen.navigationOptions = {
    headerTitle: 'All Products'
}
export default ProductsOverviewScreen;