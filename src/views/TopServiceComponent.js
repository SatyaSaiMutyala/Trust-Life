import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { ms, vs } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const PADDING_HORIZONTAL = ms(16);
const MARGIN_VERTICAL = vs(20);
const CARD_GAP = ms(10);

const TOP_SERVICES_DATA = [
    {
        id: 'a1',
        title: 'My Reports',
        image: require('../assets/img/checkreports.png'),
        action: 'MyReportsHome'
    },
    {
        id: 'a2',
        title: 'Book Doctor',
        image: require('../assets/img/bookdoctor.png'),
        action: ''
    },
    {
        id: 'a3',
        title: 'Medicines',
        image: require('../assets/img/bookmedicans.png'),
        action: ''
    },
];

const HEALTH_CHECKS_DATA = [
    {
        id: 'b1',
        title: 'Full Body Check up',
        image: require('../assets/img/fullbody.png'),
        action: 'FullBodyScreen'
    },
    {
        id: 'b2',
        title: 'Vitamin & Mineral Checkup',
        image: require('../assets/img/checkup.png'),
        action: 'VitaminScreen'
    },
];

export const TopServiceComponent = () => {
    const CARD_WIDTH_3 = (width - (PADDING_HORIZONTAL * 2) - (CARD_GAP * 2)) / 3;
    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: PADDING_HORIZONTAL,
                marginBottom: MARGIN_VERTICAL,
            }}
        >
            {TOP_SERVICES_DATA.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => navigation.navigate(item.action)}
                    style={{
                        width: CARD_WIDTH_3,
                        borderRadius: ms(10),
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 5,
                        elevation: 3,
                        overflow: 'hidden',
                    }}
                >
                    {/* Image Area */}
                    <View
                        style={{
                            height: CARD_WIDTH_3 * 0.9,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={item.image}
                            style={{
                                width: '80%',
                                height: '80%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>

                    {/* Footer Block */}
                    <View
                        style={{
                            height: CARD_WIDTH_3 * 0.4,
                            backgroundColor: '#1EAE55',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: ms(12),
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                textAlign: 'center',
                            }}
                        >
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

// --- 2. HEALTH CHECKS GRID COMPONENT (2 Columns) ---

/**
 * Renders the bottom row of checkup cards (Full Body, Vitamin)
 */
export const HealthChecksGrid = () => {
    const CARD_WIDTH_2 = (width - (PADDING_HORIZONTAL * 2) - CARD_GAP) / 2;
    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: PADDING_HORIZONTAL,
                marginBottom: MARGIN_VERTICAL,
            }}
        >
            {HEALTH_CHECKS_DATA.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => navigation.navigate(item.action)}
                    style={{
                        width: CARD_WIDTH_2,
                        height: CARD_WIDTH_2 * 0.7,
                        borderRadius: ms(15),
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 5,
                        elevation: 3,
                        padding: ms(15),
                        overflow: 'hidden',
                    }}
                >
                    {/* Content (Text) Area */}
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* Title */}
                        <Text
                            style={{
                                fontSize: ms(13),
                                fontWeight: 'bold',
                                color: '#000000',
                                maxWidth: '70%',
                                zIndex: 2,
                                marginTop:'auto'
                            }}
                        >
                            {item.title}
                        </Text>
                    </View>

                    {/* Image Container */}
                    <View
                        style={{
                            position: 'absolute',
                            top: item.id === 'b1' ? ms(20) : 0,
                            right: item.id === 'b1' ? ms(-20) : ms(-50),
                            bottom: item.id === 'b2' ? 0 : undefined,
                            zIndex: 1,
                        }}
                    >
                        <Image
                            source={item.image}
                            style={{
                                width: item.id === 'b1' ? CARD_WIDTH_2 * 0.6 : CARD_WIDTH_2 * 0.7,
                                height: item.id === 'b1' ? CARD_WIDTH_2 * 0.6 : CARD_WIDTH_2 * 0.7,
                                resizeMode: 'contain',
                                transform: item.id === 'b1' ? [{ translateY: ms(10) }] : [],
                            }}
                        />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}
