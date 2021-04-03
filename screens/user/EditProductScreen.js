import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../../store/actions/products'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]:action.value
        };       
         const updatedValidities = {
            ...state.inputValidities,
            [action.input]:action.isValid
        };
        let updatedFormIsValid = true;
        for(const key in updatedValidities){// if all validities are true then form is valid
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return{
            formIsValid:updatedFormIsValid,
            inputValidities:updatedValidities,
            inputValues:updatedValues
        }
    }
    return state;
}



const EditProductScreen = props => {

    const prodId = props.navigation.getParam('productId')
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));
    const dispatch = useDispatch();

    const [formState , dispatchFormState] = useReducer(formReducer,{
        inputValues:{
            title:editedProduct ? editedProduct.title : '',
            imageUrl:editedProduct ? editedProduct.imageUrl : '',
            description:editedProduct ? editedProduct.description : '',
            price:''
        },
        inputValidities:{
            title:editedProduct ? true : false,
            imageUrl:editedProduct ? true : false,
            description:editedProduct ? true : false,
            price:editedProduct ? true : false,
        },
        formIsValid : editedProduct ? true : false
    })


    // const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    // const [titleIsValid, setTitleIsValid] = useState(false);
    // const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    // // price unchangable
    // const [price, setPrice] = useState('');
    // const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');


    // useCallback insures that this function isn't recreated every time the component re-renders and therefor to avoid entering an infinite loop
    // we should add empty array as depedency to avoid recreating function after every time the component re-renders
    const submithandler = useCallback(() => {
       // if (!titleIsValid) {
           if(!formState.formIsValid){
            Alert.alert("Wrong input", "Please check the errors in the form!", [
                { text: 'Okay' }
            ])
            return;
        }
        // if editedProduct found, then we are editing else adding 
        if (editedProduct) {
            // dispatch(productActions.updateProduct(prodId, title, description, imageUrl))
             dispatch(productActions.updateProduct(prodId,formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl))
        }
        else {
            // dispatch(productActions.createProduct(title, description, imageUrl, +price))
            dispatch(productActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price))

        }
        props.navigation.goBack();
    }, [dispatch, prodId,formState /*, title, description, imageUrl, price, titleIsValid*/]);// dependencies when changed fire submithandler function 
    // useEffect used to execute a function after every render cycle
    useEffect(() => {
        props.navigation.setParams({ submit: submithandler })
    }, [submithandler])


    // const titleChangeHandler = text => {
    //     if (text.trim().length === 0) {
    //         setTitleIsValid(false)
    //     }
    //     else {
    //         setTitleIsValid(true)
    //     }
    //     setTitle(text);
    // }
    const textChangeHandler = (inputIdentifier,text) => {
        let isValid = false;
        if (text.trim().length === 0) {
            isValid = true;
        }
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: text,
            isValid: true,
            input: inputIdentifier
        });
    }


    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        // value={title}
                        value={formState.inputValues.title}
                        onChangeText={textChangeHandler.bind(this,'title')}
                       // onChangeText={text => setTitle(text)}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onEndEditing={() => console.log('onEndEditing')}
                        onSubmitEditing={() => console.log('onSubmitEditing')}
                    />
                    {/* {!titleIsValid && <Text>Please enter a valid title!</Text>} */}
                    {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>} 
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput 
                    style={styles.input} 
                    // value={imageUrl} 
                    value={formState.inputValues.imageUrl}
                    onChangeText={textChangeHandler.bind(this,'imageUrl')} />
                </View>
                {/* we cannot update price */}
                {editedProduct ? null : (
                    <View style={styles.formControl}>
                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            // value={price}
                            value={formState.inputValues.price}
                            onChangeText={textChangeHandler.bind(this,'price')}
                            keyboardType='decimal-pad'
                        />
                    </View>)
                }
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                    style={styles.input} 
                    // value={description} 
                    value={formState.inputValues.description}
                    onChangeText={textChangeHandler.bind(this,'description')}
                     />
                </View>
            </View>
        </ScrollView>
    )
}

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit')
    return {
        headerTitle: navData.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
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
    form: {
        margin: 20,
    },
    formControl: {
        width: '100%'
    },
    label: {
        // fontFamily:'open-sans-bold'
        marginHorizontal: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})

export default EditProductScreen;