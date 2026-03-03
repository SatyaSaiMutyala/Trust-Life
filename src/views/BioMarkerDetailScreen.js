import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Dimensions,
    Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { StatusBar2 } from '../components/StatusBar';
import Icon, { Icons } from '../components/Icons';
import { bold, regular } from '../config/Constants';
import { blackColor, whiteColor } from '../utils/globalColors';

const { width: SCREEN_W } = Dimensions.get('window');

// --- Dummy data ---
const DUMMY_DATA = [
    { date: '12 Feb 2026', value: 110, unit: 'mg/dL', method: 'CL₁A', lab: 'Vijaya Diagnostic' },
    { date: '12 Feb 2026', value: 110, unit: 'mg/dL', method: 'CL₁A', lab: 'Vijaya Diagnostic' },
    { date: '12 Feb 2026', value: 110, unit: 'mg/dL', method: 'CL₁A', lab: 'Vijaya Diagnostic' },
    { date: '12 Feb 2026', value: 110, unit: 'mg/dL', method: 'CL₁A', lab: 'Vijaya Diagnostic' },
    { date: '12 Feb 2026', value: 110, unit: 'mg/dL', method: 'CL₁A', lab: 'Vijaya Diagnostic' },
];

// --- Graph config ---
const GRAPH_DATA = [
    { label: '12 Feb', value: 20 },
    { label: '12 Mar', value: 150 },
    { label: '12 Apr', value: 140 },
    { label: '12 May', value: 230 },
];

const CHART_PAD_L = ms(40);
const CHART_PAD_R = ms(20);
const CHART_PAD_T = vs(15);
const CHART_PAD_B = vs(30);
const CHART_W = SCREEN_W - ms(40);
const CHART_H = vs(250);
const PLOT_W = CHART_W - CHART_PAD_L - CHART_PAD_R;
const PLOT_H = CHART_H - CHART_PAD_T - CHART_PAD_B;
const Y_MAX = 250;
const Y_STEPS = [0, 50, 100, 150, 200, 250];

const toX = (i) => CHART_PAD_L + (i / (GRAPH_DATA.length - 1)) * PLOT_W;
const toY = (v) => CHART_PAD_T + ((Y_MAX - v) / Y_MAX) * PLOT_H;

const buildSmoothPath = (data) => {
    if (data.length < 2) return '';
    let d = `M ${toX(0)} ${toY(data[0].value)}`;
    for (let i = 1; i < data.length; i++) {
        const x0 = toX(i - 1), y0 = toY(data[i - 1].value);
        const x1 = toX(i), y1 = toY(data[i].value);
        const cpx1 = x0 + (x1 - x0) / 3;
        const cpx2 = x1 - (x1 - x0) / 3;
        d += ` C ${cpx1} ${y0}, ${cpx2} ${y1}, ${x1} ${y1}`;
    }
    return d;
};

const BioMarkerDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { name = 'Glucose', code = 'GLU002' } = route.params || {};

    const [viewMode, setViewMode] = useState('Data'); // 'Data' or 'Graph'
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const renderDataRow = ({ item }) => (
        <View style={styles.dataCard}>
            <View style={styles.dataRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <View style={{ flex: 0.5, alignItems: 'center' }}>
                    <Text style={styles.valueText}>{item.value}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.unitText}>{item.unit}</Text>
                </View>
            </View>
            <View style={styles.dataRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.methodText}>Method : {item.method}</Text>
                </View>
                <View style={{ flex: 0.5 }} />
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.labText}>{item.lab}</Text>
                </View>
            </View>
        </View>
    );

    const renderGraph = () => {
        const pathD = buildSmoothPath(GRAPH_DATA);
        return (
            <View style={styles.graphContainer}>
                <Svg width={CHART_W} height={CHART_H}>
                    {/* Y-axis labels and horizontal grid lines */}
                    {Y_STEPS.map((step) => {
                        const y = toY(step);
                        return (
                            <React.Fragment key={step}>
                                <Line
                                    x1={CHART_PAD_L}
                                    y1={y}
                                    x2={CHART_W - CHART_PAD_R}
                                    y2={y}
                                    stroke="#E5E7EB"
                                    strokeWidth={0.8}
                                />
                                <SvgText
                                    x={CHART_PAD_L - ms(8)}
                                    y={y + vs(3)}
                                    fontSize={ms(11)}
                                    fill="#9CA3AF"
                                    textAnchor="end"
                                    fontFamily={regular}
                                >
                                    {step}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}

                    {/* Smooth curve line */}
                    <Path
                        d={pathD}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth={2.5}
                    />

                    {/* Data point dots */}
                    {GRAPH_DATA.map((pt, i) => (
                        <Circle
                            key={i}
                            cx={toX(i)}
                            cy={toY(pt.value)}
                            r={ms(5)}
                            fill="#EF4444"
                        />
                    ))}

                    {/* X-axis labels */}
                    {GRAPH_DATA.map((pt, i) => (
                        <SvgText
                            key={`x-${i}`}
                            x={toX(i)}
                            y={CHART_H - vs(5)}
                            fontSize={ms(11)}
                            fill="#6B7280"
                            textAnchor="middle"
                            fontFamily={regular}
                        >
                            {pt.label}
                        </SvgText>
                    ))}
                </Svg>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" color={blackColor} size={ms(22)} />
                </TouchableOpacity>

                <View style={styles.titleWrap}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.subtitle}>{code}</Text>
                </View>

                {/* Dropdown Toggle */}
                <TouchableOpacity
                    style={styles.dropdownBtn}
                    onPress={() => setDropdownVisible(true)}
                >
                    <Text style={styles.dropdownBtnText}>{viewMode}</Text>
                    <Icon type={Icons.Ionicons} name="chevron-down" color={whiteColor} size={ms(16)} />
                </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={styles.description}>
                Keeping your test records updated helps you understand trends and avoid potential health risks over time.
            </Text>

            {/* Content */}
            {viewMode === 'Data' ? (
                <>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
                        <Text style={[styles.tableHeaderText, { flex: 0.5, textAlign: 'center' }]}>Values</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Units</Text>
                    </View>

                    <FlatList
                        data={DUMMY_DATA}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderDataRow}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: vs(30), paddingHorizontal: ms(20) }}
                    />
                </>
            ) : (
                renderGraph()
            )}

            {/* Dropdown Modal */}
            <Modal
                visible={dropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        {['Data', 'Graph'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.dropdownItem,
                                    viewMode === option && styles.dropdownItemActive,
                                ]}
                                onPress={() => {
                                    setViewMode(option);
                                    setDropdownVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.dropdownItemText,
                                    viewMode === option && styles.dropdownItemTextActive,
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default BioMarkerDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: ms(50),
        paddingBottom: vs(15),
    },
    backBtn: {
        marginRight: ms(12),
    },
    titleWrap: {
        flex: 1,
    },
    title: {
        fontSize: ms(20),
        fontFamily: bold,
        color: blackColor,
    },
    subtitle: {
        fontSize: ms(12),
        fontFamily: regular,
        color: '#6B7280',
        marginTop: vs(2),
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingHorizontal: ms(16),
        paddingVertical: vs(8),
        borderRadius: ms(20),
        gap: ms(4),
    },
    dropdownBtnText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: whiteColor,
    },
    description: {
        fontSize: ms(13),
        fontFamily: regular,
        color: '#6B7280',
        lineHeight: ms(20),
        paddingHorizontal: ms(20),
        marginBottom: vs(20),
    },
    // Table header
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: ms(20),
        marginBottom: vs(10),
    },
    tableHeaderText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: '#374151',
    },
    // Data card
    dataCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: ms(12),
        paddingVertical: vs(14),
        paddingHorizontal: ms(16),
        marginBottom: vs(10),
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: blackColor,
    },
    valueText: {
        fontSize: ms(15),
        fontFamily: bold,
        color: blackColor,
    },
    unitText: {
        fontSize: ms(13),
        fontFamily: bold,
        color: '#374151',
    },
    methodText: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#6B7280',
        marginTop: vs(4),
    },
    labText: {
        fontSize: ms(11),
        fontFamily: regular,
        color: '#6B7280',
        marginTop: vs(4),
    },
    // Graph
    graphContainer: {
        alignItems: 'center',
        paddingTop: vs(10),
    },
    // Dropdown modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: ms(100),
        paddingRight: ms(20),
    },
    dropdownMenu: {
        backgroundColor: whiteColor,
        borderRadius: ms(12),
        paddingVertical: vs(4),
        minWidth: ms(120),
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    dropdownItem: {
        paddingHorizontal: ms(20),
        paddingVertical: vs(12),
    },
    dropdownItemActive: {
        backgroundColor: '#F3F4F6',
    },
    dropdownItemText: {
        fontSize: ms(14),
        fontFamily: regular,
        color: '#374151',
    },
    dropdownItemTextActive: {
        fontFamily: bold,
        color: blackColor,
    },
});
