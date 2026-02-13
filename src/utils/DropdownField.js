import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { blackColor, whiteColor } from './globalColors';
import { ms, vs } from 'react-native-size-matters';

const DropdownField = ({
    label,
    placeholder,
    value,
    options = [],
    onSelect,
    containerStyle,
}) => {
    const [visible, setVisible] = useState(false);

    const handleSelect = (item) => {
        onSelect(item);
        setVisible(false);
    };

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={[styles.container, containerStyle]}
                activeOpacity={0.7}
                onPress={() => setVisible(true)}>
                <Text style={[styles.valueText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
                <Icon
                    type={Icons.Feather}
                    name="chevron-down"
                    color={blackColor}
                    size={ms(20)}
                />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{label || 'Select'}</Text>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalOption,
                                        value === item && styles.modalOptionActive,
                                    ]}
                                    onPress={() => handleSelect(item)}>
                                    <Text
                                        style={[
                                            styles.modalOptionText,
                                            value === item && styles.modalOptionTextActive,
                                        ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default DropdownField;

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
    valueText: {
        flex: 1,
        fontSize: ms(13),
        color: blackColor,
        fontFamily: regular,
    },
    placeholderText: {
        color: '#A0A0A0',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: whiteColor,
        borderRadius: ms(14),
        width: '80%',
        maxHeight: '50%',
        paddingVertical: vs(8),
    },
    modalTitle: {
        fontFamily: bold,
        fontSize: ms(15),
        color: blackColor,
        paddingHorizontal: ms(20),
        paddingVertical: vs(10),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalOption: {
        paddingVertical: vs(14),
        paddingHorizontal: ms(20),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalOptionActive: {
        backgroundColor: '#F1F5F9',
    },
    modalOptionText: {
        fontFamily: regular,
        fontSize: ms(14),
        color: blackColor,
    },
    modalOptionTextActive: {
        fontFamily: bold,
        color: blackColor,
    },
});
