import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { ms, vs } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { Icons } from './Icons';
import { bold, regular } from '../config/Constants';
import { primaryColor, whiteColor, blackColor, globalGradient } from '../utils/globalColors';

const { width } = Dimensions.get('window');

const SuccessModal = ({
    visible,
    onClose,
    title = "Success!",
    message = "Operation completed successfully.",
    buttonText = "Done",
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            checkmarkAnim.setValue(0);
            fadeAnim.setValue(0);

            // Start animations
            Animated.sequence([
                // Fade in backdrop
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                // Scale up modal
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                // Animate checkmark
                Animated.spring(checkmarkAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const checkmarkScale = checkmarkAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1.2, 1],
    });

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Success Icon Circle */}
                    <LinearGradient
                        colors={globalGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.iconCircle}
                    >
                        <Animated.View
                            style={{
                                transform: [{ scale: checkmarkScale }],
                            }}
                        >
                            <Icon
                                type={Icons.Feather}
                                name="check"
                                size={ms(45)}
                                color={whiteColor}
                            />
                        </Animated.View>
                    </LinearGradient>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={handleClose}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={globalGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: whiteColor,
        borderRadius: ms(20),
        paddingVertical: vs(30),
        paddingHorizontal: ms(25),
        alignItems: 'center',
        elevation: 10,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    iconCircle: {
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(20),
        elevation: 5,
        shadowColor: primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    title: {
        fontSize: ms(22),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(10),
        textAlign: 'center',
    },
    message: {
        fontSize: ms(14),
        fontFamily: regular,
        color: '#666',
        textAlign: 'center',
        marginBottom: vs(25),
        lineHeight: ms(20),
    },
    buttonWrapper: {
        width: '100%',
    },
    button: {
        width: '100%',
        height: vs(45),
        borderRadius: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: ms(16),
        fontFamily: bold,
        color: whiteColor,
    },
});

export default SuccessModal;
