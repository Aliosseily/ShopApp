import React ,{useState , useEffect, useCallback} from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import {useSelector} from 'react-redux';
const EditProductScreen = props => {

    const prodId = props.navigation.getParam('productId') 
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const [title , setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [imageUrl , setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    // price unchangable
    const [price , setPrice] = useState('');
    const [description , setDescription] = useState(editedProduct ? editedProduct.description : '');
    // useCallback insures that this function isn't recreated every time the component re-renders and therefor to avoid entering an infinite loop
    // we should add empty array as depedency to avoid recreating function after every time the component re-renders
    const submithandler = useCallback(() =>{
        console.log("Submitting!")
    },[]);
    // useEffect used to execute a function after every render cycle
    useEffect(() => {
        props.navigation.setParams({submit:submithandler})
    },[submithandler])
    return (
        <ScrollView>
            <View style={styles.form}>
            <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} value={title} onChangeText={text => setTitle(text)}/>
            </View>
            <View style={styles.formControl}>
                <Text style={styles.label}>Image URL</Text>
                <TextInput style={styles.input} value={imageUrl} onChangeText={text => setImageUrl(text)}/>
            </View>
            {/* we cannot update price */}
            {editedProduct ? null : (
            <View style={styles.formControl}>
                <Text style={styles.label}>Price</Text>
                <TextInput style={styles.input} value={price} onChangeText={text => setPrice(text)}/>
            </View>)
            }
            <View style={styles.formControl}>
                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input} value={description} onChangeText={text => setDescription(text)}/>
            </View>
            </View>
        </ScrollView>
    )
}

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit') 
    return {
        headerTitle:navData.navigation.getParam('productId') 
        ? 'Edit Product'
        : 'Add Product' ,
                headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>,
    }
}
const styles = StyleSheet.create({
form:{
    margin:20,  
},
formControl:{
    width:'100%'
},
label:{
    // fontFamily:'open-sans-bold'
    marginHorizontal:8
},
input:{
    paddingHorizontal:2,
    paddingVertical:5,
    borderBottomColor:'#ccc',
    borderBottomWidth:1
}
})

export default EditProductScreen;