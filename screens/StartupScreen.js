import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth'
import { useDispatch } from 'react-redux';

const StartupScreen = props => {
    const dispatch = useDispatch();
    // we can't use async await on useEffect hook so we creeate function inside to use async await 
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData') // usec the key you used for storing in auth.js saveDataToStorage function
            if (!userData) { // if token not found then redirect to Auth screen to add username and password again
                props.navigation.navigate("Auth");
                return;
            }
            const transformedData = JSON.parse(userData); //convert string json to jaVASCRIPT OBJECT OR ARRAY
            const { token, userId, expiryDate } = transformedData; // destruturing syntax 
            const expirationDate = new Date(expiryDate);
            if (expirationDate <= new Date() || !token, !userId) { // if token date is expires or token or userdId not foundthen redirect to Auth screen to add username and password again
                props.navigation.navigate("Auth");
                return;
            }

            //getTime() give timestamp in milliseconds
            const expirationTime = expirationDate.getTime() - new Date().getTime();

            props.navigation.navigate("Shop");
            dispatch(authActions.authenticate(userId, token, expirationTime))
        }
        tryLogin()
    }, [dispatch])


    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.primary}></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen;