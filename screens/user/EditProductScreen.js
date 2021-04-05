import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import { useSelector, useDispatch } from 'react-redux';
import * as productActions from '../../store/actions/products'
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {// if all validities are true then form is valid
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }
    return state;
}



const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId')
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
    })


    // const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    // const [titleIsValid, setTitleIsValid] = useState(false);
    // const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    // // price unchangable
    // const [price, setPrice] = useState('');
    // const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');


    // useCallback insures that this function isn't recreated every time the component re-renders and therefor to avoid entering an infinite loop
    // we should add empty array as depedency to avoid recreating function after every time the component re-renders

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured!', error, [{
                text: 'OKAY'
            }])
        }

    }, [error])

    const submithandler = useCallback(async () => {
        // if (!titleIsValid) {
        if (!formState.formIsValid) {
            Alert.alert("Wrong input", "Please check the errors in the form!", [
                { text: 'Okay' }
            ])
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            // if editedProduct found, then we are editing else adding 
            if (editedProduct) {
                // dispatch(productActions.updateProduct(prodId, title, description, imageUrl))
                await dispatch(productActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl))
            }
            else {
                // dispatch(productActions.createProduct(title, description, imageUrl, +price))
                await dispatch(productActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price))
            }
            props.navigation.goBack();

        } catch (err) {
            setError(err.message);
        }

        setIsLoading(false);

    }, [dispatch, prodId, formState /*, title, description, imageUrl, price, titleIsValid*/]);// dependencies when changed fire submithandler function 
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
    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        // let isValid = false;
        // if (text.trim().length === 0) {
        //     isValid = true;
        // }
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);


    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size='large' color={Colors.primary}></ActivityIndicator></View>
    }

    return (
        <KeyboardAvoidingView /*style={{flex:1}}*/ behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    // onEndEditing={() => console.log('onEndEditing')}
                    // onSubmitEditing={() => console.log('onSubmitEditing')}
                    />
                    <Input
                        id='imageUrl'
                        label='Image Url'
                        errorText='Please enter a valid image url!'
                        keyboardType='default'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {/* we cannot update price */}
                    {editedProduct ? null : (
                        <Input
                            id='price'
                            label='Price'
                            errorText='Please enter a valid price!'
                            keyboardType='decimal-pad'
                            returnKeyType='next'
                            onInputChange={inputChangeHandler}
                            required
                            moi={0.1}
                        />
                    )
                    }
                    <Input
                        id='description'
                        label='Description'
                        errorText='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}

                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default EditProductScreen;