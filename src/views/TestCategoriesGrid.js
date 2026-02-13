import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

// Data structure for the four cards, using your specified image paths
const TEST_CATEGORIES_DATA = [
    { 
        id: '1', 
        title: 'Home Lab', 
        subTitle: 'Certified staff collects samples at your doorstep—safe & quick.', 
        image: require('../assets/img/home.png'), 
        isSpecial: false 
    },
    { 
        id: '2', 
        title: 'Walk- in', 
        subTitle: 'Walk into our lab at your convenience and get accurate test results.', 
        image: require('../assets/img/walk.png'), 
        isSpecial: false 
    },
    { 
        id: '3', 
        title: 'Book a Test', 
        specialText: '30 mins',
        subTitle: 'Speak with our experts for personalized guidance', 
        image: require('../assets/img/personcall.png'), 
        isSpecial: true 
    },
    { 
        id: '4', 
        title: 'Upload Prescription', 
        subTitle: 'Upload your prescription for quick test booking', 
        image: require('../assets/img/prescription.png'), 
        isSpecial: false 
    },
];

// Calculate responsive width for each card (48% of screen width to allow for spacing)
const CARD_WIDTH = width * 0.45;
const CARD_MARGIN = width * 0.025; // Spacing between cards

/**
 * Reusable component for a single category card.
 */
const TestCard = ({ item, onPress }) => {

    /**
     * Determines the specific size and absolute position for the image 
     * based on the card ID to match the visual design.
     */
    const getImagePositioning = (id) => {
        // Base styles for the absolute parent View container
        const containerBase = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            zIndex: 1, // Image should be behind the text content
        };

        // Base styles for the Image component
        const imageBase = {
            resizeMode: 'contain',
        };

        switch (id) {
            case '1': // Home Lab (Large image, top right)
            case '2': // Walk-in (Large image, top right)
                return {
                    container: { 
                        ...containerBase,
                        top: -15, 
                        right: -10, 
                    },
                    image: {
                        ...imageBase,
                        width: CARD_WIDTH * 0.8, 
                        height: CARD_WIDTH * 0.8,
                    }
                };
            case '3': // Book a Test (Smaller image, lower right, beside text)
                return {
                    container: {
                        ...containerBase,
                        top: CARD_WIDTH * 0.4, 
                        right: -5,
                    },
                    image: {
                        ...imageBase,
                        width: CARD_WIDTH * 0.7, 
                        height: CARD_WIDTH * 0.7,
                    }
                };
            case '4': // Upload Prescription (Large image, bottom right)
                return {
                    container: {
                        ...containerBase,
                        top: CARD_WIDTH * 0.4, 
                        right: -15, 
                    },
                    image: {
                        ...imageBase,
                        width: CARD_WIDTH * 0.85, 
                        height: CARD_WIDTH * 0.85, 
                    }
                };
            default:
                // Fallback style
                return { container: containerBase, image: { ...imageBase, width: CARD_WIDTH * 0.6, height: CARD_WIDTH * 0.6 } };
        }
    };

    const styles = getImagePositioning(item.id);

    return (
        <TouchableOpacity
            key={item.id}
            onPress={onPress}
            style={{
                width: CARD_WIDTH,
                height: CARD_WIDTH * 1.25, // Aspect ratio to accommodate text and image
                backgroundColor: '#FFFFFF',
                borderRadius: 15,
                padding: 15,
                marginBottom: CARD_MARGIN * 2, // Space below the card
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 5,
                overflow: 'hidden', 
            }}
        >
            {/* Image Container (Positioned absolutely and specific to the card ID) */}
            <View style={styles.container}>
                <Image source={item.image} style={styles.image} />
            </View>

            {/* Content Area (Placed on a higher zIndex so text appears over the image) */}
            <View style={{ flex: 1, justifyContent: 'flex-start', zIndex: 10 }}>
                {/* Title */}
                <Text 
                    style={{
                        fontSize: width * 0.045, 
                        fontWeight: 'bold',
                        color: '#000000',
                        marginBottom: 5,
                    }}
                >
                    {item.title}
                </Text>

                {/* Special Text (30 mins) */}
                {item.isSpecial && (
                    <Text 
                        style={{
                            fontSize: width * 0.055, 
                            fontWeight: 'bold',
                            color: '#0194A5', // Placeholder color, adjust to exact green
                            marginBottom: 10,
                        }}
                    >
                        {item.specialText}
                    </Text>
                )}

                {/* Subtitle/Description */}
                <Text 
                    style={{
                        fontSize: width * 0.032,
                        color: '#666666',
                        lineHeight: 18,
                        // Constrain width to the left side to avoid image overlap
                        maxWidth: CARD_WIDTH * 0.65, 
                    }}
                >
                    {item.subTitle}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

/**
 * Main component rendering the 2x2 grid of test categories.
 */
const TestCategoriesGrid = () => {
    
    const handleCardPress = (category) => {
        console.log(`Navigating to ${category} screen.`);
        // Add navigation logic here, e.g., navigation.navigate(category);
    };

    return (
        <View 
            style={{ 
                // Full width container with horizontal padding
                width: width,
                paddingHorizontal: CARD_MARGIN,
                marginTop: 20, 
            }}
        >
            <View
                style={{
                    // Use flexWrap to enable the 2x2 grid layout
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                }}
            >
                {TEST_CATEGORIES_DATA.map((item) => (
                    <TestCard 
                        key={item.id} 
                        item={item} 
                        onPress={() => handleCardPress(item.title)} 
                    />
                ))}
            </View>
        </View>
    );
}

export default TestCategoriesGrid;
