import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import PrimaryButton from '../../utils/primaryButton';
import { heading, interMedium, interRegular } from '../../config/Constants';
import {
    blackColor,
    whiteColor,
    primaryColor,
    globalGradient,
} from '../../utils/globalColors';

const UploadMedicalBill = () => {
    const navigation = useNavigation();
    const [files, setFiles] = useState([null, null]);

    const pickFile = async (index) => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                copyTo: 'cachesDirectory',
            });
            if (result && result[0]) {
                const file = result[0];
                const updated = [...files];
                updated[index] = {
                    uri: file.fileCopyUri || file.uri,
                    type: file.type || 'image/jpeg',
                    name: file.name || `bill_${Date.now()}`,
                };
                setFiles(updated);
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.log('Picker error:', err);
            }
        }
    };

    const removeFile = (index) => {
        const updated = [...files];
        updated[index] = null;
        setFiles(updated);
    };

    const hasAnyFile = files.some((f) => f !== null);

    const handleSave = () => {
        navigation.navigate('SuccessScreen', {
            title: 'Successfully Medical Bills Saved',
            subtitle: '',
            delay: 2000,
            targetScreen: 'MedicalBills',
            useNavigate: true,
        });
    };

    const renderUploadBox = (index) => {
        const file = files[index];

        if (file) {
            const isImage = file.type && file.type.startsWith('image/');
            return (
                <View style={styles.uploadBox} key={index}>
                    {isImage ? (
                        <Image source={{ uri: file.uri }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.pdfPreview}>
                            <Icon type={Icons.AntDesign} name="pdffile1" color={primaryColor} size={ms(30)} />
                            <Text style={styles.fileNameText} numberOfLines={1}>{file.name}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeFile(index)}>
                        <Icon type={Icons.Ionicons} name="close-circle" color="#EF4444" size={ms(22)} />
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <TouchableOpacity
                key={index}
                style={styles.uploadBox}
                activeOpacity={0.7}
                onPress={() => pickFile(index)}
            >
                <Icon type={Icons.Feather} name="upload" color={blackColor} size={ms(22)} />
                <Text style={styles.uploadText}>Upload Medical Bills</Text>
                <Text style={styles.uploadFormat}>PNG,JPG</Text>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={globalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.45]}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <StatusBar2 />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(20)} />
                    </TouchableOpacity>

                    {/* Title & Description */}
                    <Text style={styles.title}>Upload Medical Bill</Text>
                    <Text style={styles.description}>
                        Add your medical bills to keep them safe and{'\n'}accessible anytime.
                    </Text>

                    {/* Upload Boxes */}
                    <View style={styles.uploadContainer}>
                        {renderUploadBox(0)}
                        {renderUploadBox(1)}
                    </View>

                    {/* Save Button */}
                    <PrimaryButton
                        title="Save Bills"
                        onPress={handleSave}
                        disabled={!hasAnyFile}
                    />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(40),
        flexGrow: 1,
    },

    // Back Button
    backButton: {
        width: ms(34),
        height: ms(34),
        borderRadius: ms(17),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: vs(25),
    },

    // Title
    title: {
        fontSize: ms(18),
        fontFamily: heading,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(8),
    },
    description: {
        fontSize: ms(13),
        fontFamily: interRegular,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(20),
        marginBottom: vs(30),
    },

    // Upload Boxes
    uploadContainer: {
        gap: vs(15),
        marginBottom: vs(20),
    },
    uploadBox: {
        width: '100%',
        height: vs(120),
        borderRadius: ms(12),
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadText: {
        fontSize: ms(14),
        fontFamily: interMedium,
        color: blackColor,
        marginTop: vs(6),
    },
    uploadFormat: {
        fontSize: ms(11),
        fontFamily: interRegular,
        color: '#6B7280',
        marginTop: vs(2),
    },

    // Preview
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: ms(12),
    },
    pdfPreview: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileNameText: {
        fontSize: ms(12),
        fontFamily: interRegular,
        color: blackColor,
        marginTop: vs(4),
        paddingHorizontal: ms(20),
    },
    removeBtn: {
        position: 'absolute',
        top: ms(8),
        right: ms(8),
        backgroundColor: whiteColor,
        borderRadius: ms(11),
    },
});

export default UploadMedicalBill;
