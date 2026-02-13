import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { whiteColor } from "../utils/globalColors";
import { Text } from "react-native";
import PrimaryButton from "../utils/primaryButton";
import { useNavigation } from "@react-navigation/native";
import Icon, { Icons } from "../components/Icons";
import { s, vs, ms } from 'react-native-size-matters';
import { bold, regular } from "../config/Constants";
import { Image } from "react-native";

const EmptyCart = () => {
    const navigation = useNavigation();
    return (
        <>
            <View style={{ flex: 1, backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ marginHorizontal: ms(30) }}>
                    <View style={{justifyContent:'center', alignItems:'center', marginVertical:ms(20), paddingVertical:ms(10)}}>
                        <Image resizeMode="contain" source={require('../assets/img/emptycart.png')} style={{ width: s(140), height: vs(120) }}  />
                    </View>
                    <View>
                        <Text style={{ fontSize: ms(18), color: '#000', fontFamily: bold, textAlign: 'center' }}>No Tests Added</Text>
                        <Text style={{ fontSize: ms(12), color: '#374151', textAlign: 'center',marginVertical:ms(10) }}>Browse our test packages and add the ones you need to proceed.</Text>
                    </View>
                    <View>
                        <PrimaryButton title="Explore Tests" onPress={() => navigation.navigate(("LabDetails", { lab_id: 1, lab_name: 'Newlab', name: 'Home' }))} />
                    </View>
                </View>
            </View>
        </>
    )
}

export default EmptyCart;

const styles = StyleSheet.create({
    headerButton: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(17.5),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(30),
    },
})

