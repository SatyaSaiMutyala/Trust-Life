import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { blackColor, whiteColor } from './globalColors';
import { ms, vs } from 'react-native-size-matters';

const InputField = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    isSecure = false,
    iconType,
    iconName,
    onPressIn,
    maxLength,
    suffixText,
    editable = true,
    containerStyle,
    disabled = false,
}) => {
    const [secure, setSecure] = useState(isSecure);

    const handleIconPress = () => {
        if (isSecure) {
            setSecure((prev) => !prev);
        } else if (onPressIn) {
            onPressIn();
        }
    };

    const Wrapper = onPressIn ? TouchableOpacity : View;
    const wrapperProps = onPressIn
        ? { onPress: onPressIn, activeOpacity: 0.7 }
        : {};

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Wrapper
                {...wrapperProps}
                style={[styles.container, containerStyle, disabled && styles.disabledContainer]}>
                {onPressIn ? (
                    <Text style={[styles.input, !value && { color: '#A0A0A0' }]}>
                        {value || placeholder}
                    </Text>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor="#A0A0A0"
                        underlineColorAndroid="transparent"
                        onChangeText={onChangeText}
                        value={value}
                        keyboardType={keyboardType}
                        secureTextEntry={secure}
                        editable={editable}
                        maxLength={maxLength}
                    />
                )}

                {suffixText && (
                    <Text style={styles.suffixText}>{suffixText}</Text>
                )}

                {iconType && (
                    <TouchableOpacity
                        onPress={handleIconPress}
                        activeOpacity={0.7}
                        disabled={!isSecure && !onPressIn}
                    >
                        <Icon
                            type={iconType}
                            name={
                                isSecure
                                    ? secure
                                        ? 'eye-off'
                                        : 'eye'
                                    : iconName
                            }
                            size={ms(20)}
                            color="#A0A0A0"
                        />
                    </TouchableOpacity>
                )}
            </Wrapper>
        </View>
    );
};

export default InputField;

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: vs(10),
    },
    label: {
        fontFamily: bold,
        fontSize: ms(13),
        color: blackColor,
        marginBottom: vs(6),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: ms(10),
        height: vs(40),
        paddingHorizontal: ms(15),
    },
    disabledContainer: {
        backgroundColor: '#F3F4F6',
    },
    input: {
        flex: 1,
        fontSize: ms(14),
        color: blackColor,
        paddingVertical: 0,
        fontFamily: regular,
    },
    suffixText: {
        fontSize: ms(14),
        color: '#A0A0A0',
        fontFamily: bold,
        marginRight: ms(5),
    },
});
