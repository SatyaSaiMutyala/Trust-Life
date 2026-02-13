import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import * as colors from '../assets/css/Colors';

import Icon, { Icons } from './Icons';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms, mvs } from 'react-native-size-matters';

const SearchInput = ({
    label,
    iconName,
    bg,
    onFocus = () => { },
    ...props
}) => {

    const [isFocused, setIsFocused] = useState(false);

    // Voice Search Consts
    const [voiceText, setVoiceText] = useState('');
    const [pitch, setPitch] = useState('');
    const [voiceError, setVoiceError] = useState('');
    const [end, setEnd] = useState('');
    const [started, setStarted] = useState('');
    const [results, setResults] = useState([]);
    const [partialResults, setPartialResults] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [data] = useState([
        { id: '1', name: 'Thyroid' },
        { id: '2', name: 'Lungs' },
        { id: '3', name: 'Kidney' },
        { id: '5', name: 'Heart' },
    ]);
    const navigation = useNavigation();


    const view_all_packages = (id) => {
        navigation.navigate("Packages", { lab_id: 1, relevance_id: id })
    }

    const handleSearchChange = (text) => {

        setSearchText(text);
        setShowResults(text.length > 0);
    };

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'col' }}>
                <View style={[styles.inpContainer, { borderColor: isFocused ? '#ffffff' : 'transparent', paddingVertical: 5 },
                { backgroundColor: isFocused ? '#ffffff' : '#ffffff' }]}>


                    <TouchableOpacity >
                        <Icon type={Icons.Ionicons} name="search-outline" style={{ fontSize: ms(20), color: colors.grey, paddingLeft: ms(8), paddingRight: ms(4) }} />
                    </TouchableOpacity>

                    <TextInput
                        {...props}
                        placeholderTextColor={colors.grey}
                        style={[styles.input]}
                        returnKeyType="search"
                        value={searchText}
                        onChangeText={handleSearchChange}
                        onFocus={() => {
                            onFocus();
                            setIsFocused(true);
                        }}
                        onBlur={() => { console.log('false', false); setIsFocused(false); }}
                    />


                </View>
                <View style={searchText ? styles.suggestionsContainer : null}>


                    {searchText.length > 0 && (
                        <FlatList
                            data={filteredData}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.resultItem} onPress={view_all_packages.bind(this, item.id)}>
                                    <Text style={styles.resultText} >{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={styles.noResults}>No results found</Text>}
                        />
                    )}

                    {/* {searchText && 
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                            setSearchText('');
                            setShowResults(false);
                            }}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    } */}
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    inpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        backgroundColor: 'white',
        paddingHorizontal: ms(10),
        borderRadius: 10,
        paddingRight: 0,
        marginHorizontal: ms(10),
    },
    input: {
        flex: 1,
        color: 'black',
        letterSpacing: 0.8,
        paddingVertical: 5,
        fontWeight: "bold",
        height: vs(26),
        position: 'relative'

    },
    suggestionsContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginHorizontal: ms(15),
        marginTop: 5,
        padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        // position: 'absolute',
        // top: 50,
        // zIndex: 10000

    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    resultText: {
        fontSize: 16,
        color: 'black',
    },
    noResults: {
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
    },

    closeButton: {
        marginTop: 10,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#ff0000',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

})


export default SearchInput;












