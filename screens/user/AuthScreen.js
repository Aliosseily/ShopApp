import React, { useState, useEffect, useReducer, useCallback } from 'react'
import { ScrollView, View, KeyboardAvoidingView, Button, ActivityIndicator, Alert, StyleSheet, ProgressViewIOSComponent } from 'react-native';
import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import * as authActions from '../../store/actions/auth'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    console.log("action.input", action.input);
    console.log("state.inputValues", state.inputValues);
    console.log("action.value", action.value);
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


const AuthScreen = props => {

    const [isLodaing, setIsLodaing] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState(false);

    // initialize states
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    })


    const dispatch = useDispatch();


    useEffect(() => {
        if (error) {
            Alert, alert( error, [{
                Text: "Okay"
            }])
        }
    }, [error])


    const authHandler = async () => {
        let action;

        if (isSignup) {
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password)
        }
        else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password)
        }
        setError(null)
        setIsLodaing(true);
        try {
            await dispatch(action);
            // if login success navigae to app
            props.navigation.navigate("Shop")
        } catch (err) {
            setError(err.message)
            Alert.alert()
            setIsLodaing(false);
        }
    }


    const inputChangeHandler = useCallback((inputIdentifier, inputValid, inputValidity) => {
        console.log("inputIdentifier", inputIdentifier)
        console.log("inputValid", inputValid)
        console.log("inputValidity", inputValidity)
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValid,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Pleas enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Pleas enter a valid password address."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <View style={styles.buttonContainer}>
                            {isLodaing ?
                                <ActivityIndicator size='small' color={Colors.primary}></ActivityIndicator>
                                : <Button
                                    title={isSignup ? "Sign Up" : "Login"}
                                    color={Colors.primary}
                                    onPress={authHandler}
                                />}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                                color={Colors.accent}
                                onPress={() => {
                                    setIsSignup(prevState => !prevState)
                                }} /></View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate"
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
})

export default AuthScreen;