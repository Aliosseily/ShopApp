import React from 'react';
import {Platform} from 'react-native';
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons  } from "@expo/vector-icons";
import Colors from '../../constants/Colors'
//solve error header button
//https://stackoverflow.com/questions/66535013/typeerror-0-native-usetheme-is-not-a-function-in-0-native-usetheme
const CustomHeaderButton = props => {
    return(
    <HeaderButton 
    {...props}
    IconComponent={Ionicons}
    iconSize={23}
    color={Platform.OS ==='android' ? 'white' : Colors.primary}
    />
    );
    };
    
    export default CustomHeaderButton;