import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Image,
    ScrollView,
    TextInput,
    Platform,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { s, vs, ms } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';

// Project utilities
import { StatusBar2 } from '../components/StatusBar';
import { bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { blackColor, globalGradient, whiteColor, primaryColor, grayColor } from '../utils/globalColors';
import PrimaryButton from '../utils/primaryButton';
import UploadReportAction, { UploadReportReset } from '../redux/actions/UploadReportActions';

const { width } = Dimensions.get('window');

const familyMembersData = [
    { id: 1, name: 'Myself', image: require('../assets/img/n.png') },
    { id: 2, name: 'Father', image: require('../assets/img/m.png') },
    { id: 3, name: 'Mother', image: require('../assets/img/w.png') },
    { id: 4, name: 'Son', image: require('../assets/img/boys.png') },
    { id: 5, name: 'Daughter', image: require('../assets/img/girl.png') },
];

const UploadHealthReport = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, status, error, data } = useSelector(state => state.upload_report);

    const [selectedMember, setSelectedMember] = useState(1);
    const [reportFile, setReportFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Modal states
    const [pickerModalVisible, setPickerModalVisible] = useState(false);
    const [alertModal, setAlertModal] = useState({
        visible: false,
        type: 'success', // 'success' | 'error'
        title: '',
        message: '',
        onClose: null,
    });

    // Show custom alert
    const showAlert = (type, title, message, onClose = null) => {
        setAlertModal({
            visible: true,
            type,
            title,
            message,
            onClose,
        });
    };

    // Close alert modal
    const closeAlertModal = () => {
        const callback = alertModal.onClose;
        setAlertModal({ ...alertModal, visible: false });
        if (callback) {
            setTimeout(callback, 300);
        }
    };

    // Handle upload status changes
    useEffect(() => {
        if (status === 'success') {
            showAlert(
                'success',
                'Success',
                data?.message || 'Report uploaded successfully',
                () => {
                    dispatch(UploadReportReset());
                    navigation.navigate('Home', {
                        screen: 'Reports',
                        params: { activeTab: 'Lab' }
                    });
                }
            );
        } else if (status === 'error') {
            showAlert('error', 'Error', error || 'Failed to upload report');
            dispatch(UploadReportReset());
        }
    }, [status]);

    // Reset state when unmounting
    useEffect(() => {
        return () => {
            dispatch(UploadReportReset());
        };
    }, []);

    // Request camera permission for Android
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission to take photos',
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

    // Show picker options
    const showImagePickerOptions = () => {
        setPickerModalVisible(true);
    };

    // Open camera
    const openCamera = async () => {
        setPickerModalVisible(false);
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            showAlert('error', 'Permission Denied', 'Camera permission is required');
            return;
        }

        const options = {
            mediaType: 'mixed',
            quality: 0.8,
            maxWidth: 1200,
            maxHeight: 1200,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                showAlert('error', 'Error', response.errorMessage);
            } else if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                setReportFile({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || `report_${Date.now()}.jpg`,
                });
            }
        });
    };

    // Open gallery
    const openGallery = () => {
        setPickerModalVisible(false);
        const options = {
            mediaType: 'mixed',
            quality: 0.8,
            maxWidth: 1200,
            maxHeight: 1200,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled gallery');
            } else if (response.errorCode) {
                console.log('Gallery Error: ', response.errorMessage);
                showAlert('error', 'Error', response.errorMessage);
            } else if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                setReportFile({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || `report_${Date.now()}.jpg`,
                });
            }
        });
    };

    // Open document picker for PDFs and other files
    const openDocumentPicker = async () => {
        setPickerModalVisible(false);
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
                copyTo: 'cachesDirectory',
            });

            if (result && result[0]) {
                const file = result[0];
                setReportFile({
                    uri: file.fileCopyUri || file.uri,
                    type: file.type || 'application/pdf',
                    name: file.name || `report_${Date.now()}.pdf`,
                });
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.log('Document Picker Error: ', err);
                showAlert('error', 'Error', 'Failed to pick document');
            }
        }
    };

    // Get member name by id
    const getMemberName = (memberId) => {
        const member = familyMembersData.find(m => m.id === memberId);
        return member ? member.name : 'Myself';
    };

    // Upload report using Redux
    const uploadReport = () => {
        // Validation
        if (!name.trim()) {
            showAlert('error', 'Required', 'Please enter patient name');
            return;
        }

        if (!reportFile) {
            showAlert('error', 'Required', 'Please upload a report file');
            return;
        }

        if (!global.id) {
            showAlert('error', 'Login Required', 'Please login to upload reports', () => {
                navigation.navigate('CheckPhone');
            });
            return;
        }

        // Dispatch upload action
        dispatch(UploadReportAction({
            customer_id: global.id,
            patient_name: name.trim(),
            member: getMemberName(selectedMember),
            file: reportFile,
        }));
    };

    const renderFamilyMember = (member) => {
        const isSelected = selectedMember === member.id;
        return (
            <TouchableOpacity
                key={member.id}
                style={styles.memberItem}
                onPress={() => setSelectedMember(member.id)}
            >
                <View style={[styles.memberCard, isSelected && styles.memberCardSelected]}>
                    <Image source={member.image} style={styles.memberAvatar} resizeMode="contain" />
                    {isSelected && (
                        <View style={styles.checkBadge}>
                            <Icon type={Icons.Ionicons} name="checkmark-circle" color={primaryColor} size={ms(18)} />
                        </View>
                    )}
                </View>
                <Text style={styles.memberLabel}>{member.name}</Text>
            </TouchableOpacity>
        );
    };

    // Check if file is an image
    const isImageFile = (file) => {
        if (!file || !file.type) return false;
        return file.type.startsWith('image/');
    };

    // Render Alert Modal
    const renderAlertModal = () => (
        <Modal
            isVisible={alertModal.visible}
            onBackdropPress={closeAlertModal}
            onBackButtonPress={closeAlertModal}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.5}
            style={styles.modalCenter}
        >
            <View style={styles.alertModalContainer}>
                {/* Icon */}
                <View style={[
                    styles.alertIconCircle,
                    { backgroundColor: alertModal.type === 'success' ? '#E8F5E9' : '#FFEBEE' }
                ]}>
                    <Icon
                        type={Icons.MaterialIcons}
                        name={alertModal.type === 'success' ? 'check-circle' : 'error'}
                        color={alertModal.type === 'success' ? '#4CAF50' : '#F44336'}
                        size={ms(40)}
                    />
                </View>

                {/* Title */}
                <Text style={styles.alertTitle}>{alertModal.title}</Text>

                {/* Message */}
                <Text style={styles.alertMessage}>{alertModal.message}</Text>
                <View style={{width:'100%'}}>
                <PrimaryButton onPress={closeAlertModal }  title='OK'/>
                    </View>
            </View>
        </Modal>
    );

    // Render Picker Modal
    const renderPickerModal = () => (
        <Modal
            isVisible={pickerModalVisible}
            onBackdropPress={() => setPickerModalVisible(false)}
            onBackButtonPress={() => setPickerModalVisible(false)}
            style={styles.bottomModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
        >
            <View style={styles.pickerModalContainer}>
                {/* Handle bar */}
                <View style={styles.modalHandle} />

                {/* Title */}
                <Text style={styles.pickerTitle}>Upload Report</Text>
                <Text style={styles.pickerSubtitle}>Choose an option to upload your report</Text>

                {/* Options */}
                <View style={styles.pickerOptions}>
                    <TouchableOpacity style={styles.pickerOption} onPress={openCamera}>
                        <View style={[styles.pickerIconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <Icon type={Icons.Feather} name="camera" color="#2196F3" size={ms(24)} />
                        </View>
                        <Text style={styles.pickerOptionText}>Camera</Text>
                        <Text style={styles.pickerOptionSubtext}>Take a photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pickerOption} onPress={openGallery}>
                        <View style={[styles.pickerIconCircle, { backgroundColor: '#F3E5F5' }]}>
                            <Icon type={Icons.Feather} name="image" color="#9C27B0" size={ms(24)} />
                        </View>
                        <Text style={styles.pickerOptionText}>Gallery</Text>
                        <Text style={styles.pickerOptionSubtext}>Choose from gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pickerOption} onPress={openDocumentPicker}>
                        <View style={[styles.pickerIconCircle, { backgroundColor: '#FFF3E0' }]}>
                            <Icon type={Icons.AntDesign} name="pdffile1" color="#FF9800" size={ms(24)} />
                        </View>
                        <Text style={styles.pickerOptionText}>Files</Text>
                        <Text style={styles.pickerOptionSubtext}>PDF & Documents</Text>
                    </TouchableOpacity>
                </View>
                <PrimaryButton title='Cancel' onPress={() => setPickerModalVisible(false)} />
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButtonCircle}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" color={primaryColor} size={ms(20)} />
                    </TouchableOpacity>

                    <Text style={styles.headerMainTitle}>Family's Health{"\n"}Records in One Place</Text>
                    <Text style={styles.headerDesc}>
                        Keep all medical documents organized, add reports effortlessly, and access updates whenever you need.
                    </Text>
                </View>

                <View style={styles.body}>
                    {/* Family Member Selection */}
                    <Text style={styles.sectionTitle}>Which family member's report are you adding</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersList}>
                        {familyMembersData.map(renderFamilyMember)}
                    </ScrollView>

                    {/* Upload Box */}
                    <Text style={styles.sectionTitle}>Upload Reports</Text>
                    <TouchableOpacity style={styles.dashedUploadBox} onPress={showImagePickerOptions}>
                        {reportFile ? (
                            <View style={styles.uploadedFileContainer}>
                                {isImageFile(reportFile) ? (
                                    <Image source={{ uri: reportFile.uri }} style={styles.fullImage} />
                                ) : (
                                    <View style={styles.pdfPreview}>
                                        <Icon type={Icons.AntDesign} name="pdffile1" color={primaryColor} size={ms(40)} />
                                        <Text style={styles.fileName} numberOfLines={1}>{reportFile.name}</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.removeFileBtn}
                                    onPress={() => setReportFile(null)}
                                >
                                    <Icon type={Icons.Ionicons} name="close-circle" color="#FF4444" size={ms(24)} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ alignItems: 'center' }}>
                                <Icon type={Icons.Feather} name="upload" color={blackColor} size={ms(24)} />
                                <Text style={styles.uploadTitle}>Upload Reports</Text>
                                <Text style={styles.uploadFormat}>PDF, PNG, JPG, JPEG</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Inputs */}
                    <Text style={styles.inputLabel}>Patient Name</Text>
                    <TextInput
                        style={styles.styledInput}
                        placeholder="Enter patient name"
                        placeholderTextColor='#ccc'
                        value={name}
                        onChangeText={setName}
                    />

                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>Description </Text>
                        <Text style={styles.optionalText}>Optional *</Text>
                    </View>
                    <TextInput
                        style={[styles.styledInput, styles.styledTextArea]}
                        placeholder="Write about Reports"
                        placeholderTextColor='#ccc'
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />

                    <View style={styles.saveBtnContainer}>
                        {loading ? (
                            <View style={styles.loadingBtn}>
                                <ActivityIndicator size="small" color={whiteColor} />
                                <Text style={styles.loadingText}>Uploading...</Text>
                            </View>
                        ) : (
                            <PrimaryButton onPress={uploadReport} title="Save" />
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            {renderAlertModal()}
            {renderPickerModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: whiteColor },

    // Header
    headerContainer: {
        paddingTop: vs(20),
        paddingBottom: vs(40),
        paddingHorizontal: ms(20),
        borderBottomLeftRadius: ms(20),
        borderBottomRightRadius: ms(20),
        alignItems: 'center',
        backgroundColor: primaryColor
    },
    backButtonCircle: {
        width: ms(35),
        height: ms(35),
        borderRadius: ms(20),
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: vs(15),
    },
    headerMainTitle: {
        fontSize: ms(22),
        fontFamily: bold,
        color: whiteColor,
        textAlign: 'center',
        lineHeight: ms(28),
    },
    headerDesc: {
        fontSize: ms(12),
        color: whiteColor,
        textAlign: 'center',
        marginTop: vs(10),
        lineHeight: ms(18),
        paddingHorizontal: ms(10),
    },

    body: { paddingHorizontal: ms(20), paddingTop: vs(25) },

    sectionTitle: {
        fontSize: ms(15),
        fontFamily: regular,
        color: blackColor,
        marginBottom: vs(15),
    },

    // Member Selection
    membersList: { paddingBottom: vs(20), gap: ms(15) },
    memberItem: { alignItems: 'center' },
    memberCard: {
        width: ms(85),
        height: ms(85),
        borderRadius: ms(15),
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberCardSelected: {
        backgroundColor: '#D1D1D1',
        borderWidth: 1,
        borderColor: 'transparent'
    },
    memberAvatar: { width: ms(60), height: ms(60) },
    memberLabel: { marginTop: vs(8), fontSize: ms(13), color: blackColor },
    checkBadge: {
        position: 'absolute',
        top: ms(5),
        right: ms(5),
        backgroundColor: whiteColor,
        borderRadius: ms(10),
    },

    // Upload Box
    dashedUploadBox: {
        width: '100%',
        height: vs(120),
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: '#999',
        borderStyle: 'dashed',
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(20),
        overflow: 'hidden',
    },
    uploadTitle: { fontSize: ms(14), fontWeight: '500', color: blackColor, marginTop: vs(5) },
    uploadFormat: { fontSize: ms(11), color: blackColor },
    uploadedFileContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        borderRadius: ms(15)
    },
    pdfPreview: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
    },
    fileName: {
        marginTop: vs(8),
        fontSize: ms(12),
        color: blackColor,
        paddingHorizontal: ms(20),
    },
    removeFileBtn: {
        position: 'absolute',
        top: ms(5),
        right: ms(5),
        backgroundColor: whiteColor,
        borderRadius: ms(12),
    },

    // Styled Inputs
    inputLabel: { fontSize: ms(15), fontFamily: regular, color: blackColor, marginBottom: vs(8) },
    styledInput: {
        backgroundColor: '#F2F4F7',
        borderRadius: ms(10),
        paddingHorizontal: ms(15),
        height: vs(48),
        fontSize: ms(14),
        color: blackColor,
        marginBottom: vs(20),
    },
    labelRow: { flexDirection: 'row', justifyContent: 'flex-start' },
    optionalText: { color: '#6366F1', fontSize: ms(12), fontWeight: '600' },
    styledTextArea: { height: vs(100), textAlignVertical: 'top', paddingTop: vs(12) },

    saveBtnContainer: { marginTop: vs(10), marginBottom: vs(30) },
    loadingBtn: {
        backgroundColor: primaryColor,
        borderRadius: ms(25),
        height: vs(50),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: ms(10),
    },
    loadingText: {
        color: whiteColor,
        fontFamily: bold,
        fontSize: ms(16),
    },

    // Modal Styles
    modalCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },

    // Alert Modal
    alertModalContainer: {
        backgroundColor: whiteColor,
        borderRadius: ms(20),
        padding: ms(25),
        alignItems: 'center',
        width: width * 0.85,
    },
    alertIconCircle: {
        width: ms(70),
        height: ms(70),
        borderRadius: ms(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(15),
    },
    alertTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
        marginBottom: vs(10),
        textAlign: 'center',
    },
    alertMessage: {
        fontSize: ms(14),
        fontFamily: regular,
        color: blackColor,
        textAlign: 'center',
        marginBottom: vs(20),
        lineHeight: ms(20),
    },
    alertButton: {
        width: '100%',
        height: vs(45),
        borderRadius: ms(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertButtonText: {
        color: whiteColor,
        fontFamily: bold,
        fontSize: ms(16),
    },

    // Picker Modal
    pickerModalContainer: {
        backgroundColor: whiteColor,
        borderTopLeftRadius: ms(25),
        borderTopRightRadius: ms(25),
        paddingHorizontal: ms(20),
        paddingTop: vs(10),
        paddingBottom: vs(30),
    },
    modalHandle: {
        width: ms(40),
        height: vs(4),
        backgroundColor: '#E0E0E0',
        borderRadius: ms(2),
        alignSelf: 'center',
        marginBottom: vs(15),
    },
    pickerTitle: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
        textAlign: 'center',
    },
    pickerSubtitle: {
        fontSize: ms(13),
        fontFamily: regular,
        color: blackColor,
        textAlign: 'center',
        marginTop: vs(5),
        marginBottom: vs(20),
    },
    pickerOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(20),
    },
    pickerOption: {
        alignItems: 'center',
        width: width * 0.27,
        paddingVertical: vs(15),
        backgroundColor: '#F9FAFB',
        borderRadius: ms(15),
    },
    pickerIconCircle: {
        width: ms(55),
        height: ms(55),
        borderRadius: ms(27.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    pickerOptionText: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },
    pickerOptionSubtext: {
        fontSize: ms(11),
        fontFamily: regular,
        color: grayColor,
        marginTop: vs(2),
    },
    cancelButton: {
        height: vs(45),
        borderRadius: ms(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cancelButtonText: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },
});

export default UploadHealthReport;
