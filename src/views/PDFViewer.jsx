import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    PermissionsAndroid,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'rn-fetch-blob';
import { ms, vs } from 'react-native-size-matters';

import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, img_url } from '../config/Constants';
import { blackColor, globalGradient, whiteColor, primaryColor } from '../utils/globalColors';

const { width: screenWidth } = Dimensions.get('window');

const PDFViewer = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { pdfUrl, title } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Construct the full file URL
    const fullFileUrl = pdfUrl?.startsWith('http') ? pdfUrl : `${img_url}${pdfUrl}`;

    // Check if the file is an image based on extension
    const isImageFile = (url) => {
        if (!url) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const lowerUrl = url.toLowerCase();
        return imageExtensions.some(ext => lowerUrl.includes(ext));
    };

    const isImage = isImageFile(fullFileUrl);

    // Use Google Docs viewer for PDF rendering
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullFileUrl)}&embedded=true`;

    // Get file extension for download
    const getFileExtension = (url) => {
        if (!url) return 'pdf';
        const match = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|pdf)(\?|$)/);
        return match ? match[1] : 'pdf';
    };

    // Get MIME type for download
    const getMimeType = (extension) => {
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
        };
        return mimeTypes[extension] || 'application/octet-stream';
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                // For Android 13+ (API 33+), we don't need READ/WRITE_EXTERNAL_STORAGE
                if (Platform.Version >= 33) {
                    return true;
                }

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'This app needs access to your storage to download files',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const handleDownload = async () => {
        const hasPermission = await requestStoragePermission();

        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Storage permission is required to download files');
            return;
        }

        setDownloading(true);

        const { dirs } = RNFetchBlob.fs;
        const fileExtension = getFileExtension(fullFileUrl);
        const fileName = `report_${Date.now()}.${fileExtension}`;
        const mimeType = getMimeType(fileExtension);
        const downloadPath = Platform.OS === 'ios'
            ? dirs.DocumentDir
            : dirs.DownloadDir;
        const filePath = `${downloadPath}/${fileName}`;

        try {
            const res = await RNFetchBlob.config({
                fileCache: true,
                path: filePath,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: filePath,
                    description: 'Downloading report...',
                    title: fileName,
                    mime: mimeType,
                },
            }).fetch('GET', fullFileUrl);

            setDownloading(false);

            if (Platform.OS === 'ios') {
                RNFetchBlob.ios.openDocument(res.path());
            } else {
                Alert.alert(
                    'Download Complete',
                    `File saved to Downloads folder as ${fileName}`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            setDownloading(false);
            console.error('Download error:', error);
            Alert.alert('Download Failed', 'Unable to download the file. Please try again.');
        }
    };

    const renderContent = () => {
        if (isImage) {
            return (
                <ScrollView
                    style={styles.imageScrollView}
                    contentContainerStyle={styles.imageScrollContent}
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    showsVerticalScrollIndicator={false}
                >
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={primaryColor} />
                            <Text style={styles.loadingText}>Loading Image...</Text>
                        </View>
                    )}
                    <Image
                        source={{ uri: fullFileUrl }}
                        style={styles.imageView}
                        resizeMode="contain"
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setImageError(true);
                        }}
                    />
                    {imageError && (
                        <View style={styles.errorContainer}>
                            <Icon
                                type={Icons.MaterialIcons}
                                name="broken-image"
                                color={primaryColor}
                                size={ms(60)}
                            />
                            <Text style={styles.errorText}>Failed to load image</Text>
                        </View>
                    )}
                </ScrollView>
            );
        }

        // PDF Viewer
        return (
            <>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={primaryColor} />
                        <Text style={styles.loadingText}>Loading PDF...</Text>
                    </View>
                )}
                <WebView
                    source={{ uri: googleDocsUrl }}
                    style={styles.webview}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                        setLoading(false);
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={primaryColor} />
                            <Text style={styles.loadingText}>Loading PDF...</Text>
                        </View>
                    )}
                />
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <LinearGradient
                colors={globalGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.35]}
                style={styles.headerGradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Icon
                            type={Icons.Feather}
                            name="arrow-left"
                            color={blackColor}
                            size={ms(20)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title || 'View Report'}
                    </Text>
                    <TouchableOpacity
                        onPress={handleDownload}
                        style={styles.downloadButton}
                        disabled={downloading}
                    >
                        {downloading ? (
                            <ActivityIndicator size="small" color={primaryColor} />
                        ) : (
                            <Icon
                                type={Icons.Feather}
                                name="download"
                                color={primaryColor}
                                size={ms(20)}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Content Viewer */}
                <View style={styles.contentContainer}>
                    {renderContent()}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default PDFViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    headerGradient: {
        flex: 1,
        paddingTop: ms(50),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(20),
        marginBottom: vs(15),
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        flex: 1,
        fontSize: ms(18),
        fontFamily: bold,
        color: whiteColor,
        textAlign: 'center',
        marginHorizontal: ms(10),
    },
    downloadButton: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
    },
    imageScrollView: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    imageScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: ms(10),
    },
    imageView: {
        width: screenWidth - ms(20),
        height: '100%',
        minHeight: 400,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: whiteColor,
        zIndex: 10,
    },
    loadingText: {
        marginTop: vs(10),
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: whiteColor,
    },
    errorText: {
        marginTop: vs(15),
        fontSize: ms(16),
        fontFamily: regular,
        color: blackColor,
    },
});
