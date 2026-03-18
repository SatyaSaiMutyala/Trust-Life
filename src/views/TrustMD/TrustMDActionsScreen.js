import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2, StatusBar4 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';

const { width } = Dimensions.get('window');

// ── Data ──────────────────────────────────────────────────────────────────────

const PATIENT = {
    name: 'Arjun Reddy',
    age: 42,
    id: 'PT-20847',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    allergies: ['Penicillin'],
};

const NOTE_TAGS = ['Follow-up', 'Chronic', 'Acute', 'Emergency', 'Preventive', 'Referral'];

const SOAP_TEMPLATES = [
    {
        id: 'diabetes',
        label: 'Diabetes',
        subjective: 'Patient reports increased thirst and frequent urination. HbA1c reviewed. Current medications: Metformin 500mg BD.',
        objective: 'FBS: 180 mg/dL. BP: 130/85 mmHg. Weight: 78 kg. Foot examination: Normal.',
        assessment: 'Type 2 Diabetes – Suboptimal glycemic control. Continue current regimen with dietary modifications.',
        plan: 'Increase Metformin to 1000mg BD. Order HbA1c in 3 months. Refer to dietitian. Follow-up in 4 weeks.',
    },
    {
        id: 'ckd',
        label: 'CKD',
        subjective: 'Patient reports fatigue and mild ankle swelling. On Amlodipine 5mg. Last creatinine: 1.8 mg/dL.',
        objective: 'BP: 145/90. Bilateral pitting edema 1+. eGFR: 42 mL/min.',
        assessment: 'CKD Stage 3b. Blood pressure not at target. Fluid retention noted.',
        plan: 'Add Furosemide 20mg OD. Dietary protein restriction. Nephrology referral. Repeat labs in 1 month.',
    },
    {
        id: 'cardiac',
        label: 'Cardiac',
        subjective: 'Patient reports occasional chest tightness on exertion. No syncope. On Atorvastatin 10mg.',
        objective: 'HR: 78 bpm regular. BP: 125/80. Lungs: Clear. No JVP elevation.',
        assessment: 'Stable angina – lipid management ongoing. Low-moderate cardiovascular risk.',
        plan: 'Increase Atorvastatin to 20mg. Add Aspirin 75mg OD. Stress ECG ordered. Follow-up in 6 weeks.',
    },
];

const SUGGESTED_TESTS = [
    { id: '1', name: 'HbA1c',                category: 'Diabetes',      priority: 'High'   },
    { id: '2', name: 'Fasting Blood Sugar',  category: 'Diabetes',      priority: 'High'   },
    { id: '3', name: 'Lipid Profile',        category: 'Cardiac',       priority: 'Medium' },
    { id: '4', name: 'Serum Creatinine',     category: 'Kidney',        priority: 'High'   },
    { id: '5', name: 'eGFR',                 category: 'Kidney',        priority: 'Medium' },
    { id: '6', name: 'Urine Microalbumin',   category: 'Kidney',        priority: 'Medium' },
    { id: '7', name: 'TSH',                  category: 'Thyroid',       priority: 'Low'    },
    { id: '8', name: 'CBC',                  category: 'General',       priority: 'Medium' },
    { id: '9', name: 'Liver Function Tests', category: 'Liver',         priority: 'Low'    },
    { id: '10', name: '2D Echo',             category: 'Cardiac',       priority: 'High'   },
];

const DRUG_DB = [
    { id: '1', name: 'Metformin',     strengths: ['500mg', '850mg', '1000mg'], interactions: []                   },
    { id: '2', name: 'Amlodipine',    strengths: ['2.5mg', '5mg', '10mg'],    interactions: []                   },
    { id: '3', name: 'Atorvastatin',  strengths: ['10mg', '20mg', '40mg'],    interactions: ['Warfarin']         },
    { id: '4', name: 'Losartan',      strengths: ['25mg', '50mg', '100mg'],   interactions: ['Potassium']        },
    { id: '5', name: 'Aspirin',       strengths: ['75mg', '150mg', '325mg'],  interactions: ['Warfarin', 'NSAIDs'] },
    { id: '6', name: 'Furosemide',    strengths: ['20mg', '40mg', '80mg'],    interactions: []                   },
    { id: '7', name: 'Glibenclamide', strengths: ['2.5mg', '5mg'],            interactions: ['Fluconazole']      },
    { id: '8', name: 'Insulin Glargine', strengths: ['100U/mL'],              interactions: []                   },
];

const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Thrice daily', 'At bedtime', 'SOS'];
const DURATION_UNITS    = ['Days', 'Weeks', 'Months'];

// ── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'notes',    label: 'Notes',    icon: 'document-text-outline' },
    { id: 'tests',    label: 'Tests',    icon: 'flask-outline'         },
    { id: 'prescribe', label: 'Prescribe', icon: 'medkit-outline'    },
];

// ── ConsultationNotes ─────────────────────────────────────────────────────────

const ConsultationNotes = () => {
    const [mode, setMode]           = useState('free'); // 'free' | 'soap'
    const [freeText, setFreeText]   = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [soap, setSoap] = useState({ subjective: '', objective: '', assessment: '', plan: '' });

    const applyTemplate = (tmpl) => {
        setSoap({
            subjective: tmpl.subjective,
            objective:  tmpl.objective,
            assessment: tmpl.assessment,
            plan:       tmpl.plan,
        });
        setSelectedTemplate(tmpl.id);
        setMode('soap');
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
                <TouchableOpacity
                    style={[styles.modeBtn, mode === 'free' && styles.modeBtnActive]}
                    onPress={() => setMode('free')}
                >
                    <Text style={[styles.modeBtnText, mode === 'free' && styles.modeBtnTextActive]}>Free Text</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeBtn, mode === 'soap' && styles.modeBtnActive]}
                    onPress={() => setMode('soap')}
                >
                    <Text style={[styles.modeBtnText, mode === 'soap' && styles.modeBtnTextActive]}>SOAP Format</Text>
                </TouchableOpacity>
            </View>

            {/* SOAP Templates */}
            <Text style={styles.sectionLabel}>Templates</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                {SOAP_TEMPLATES.map(tmpl => (
                    <TouchableOpacity
                        key={tmpl.id}
                        style={[styles.templateChip, selectedTemplate === tmpl.id && styles.templateChipActive]}
                        onPress={() => applyTemplate(tmpl)}
                    >
                        <Text style={[styles.templateChipText, selectedTemplate === tmpl.id && styles.templateChipTextActive]}>
                            {tmpl.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {mode === 'free' ? (
                <View style={styles.textAreaWrap}>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={8}
                        placeholder="Write consultation notes here..."
                        placeholderTextColor="#AAAAAA"
                        value={freeText}
                        onChangeText={setFreeText}
                        textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{freeText.length} characters</Text>
                </View>
            ) : (
                <View style={styles.soapContainer}>
                    {[
                        { key: 'subjective',  label: 'S — Subjective',  placeholder: 'Chief complaint, history, symptoms...' },
                        { key: 'objective',   label: 'O — Objective',   placeholder: 'Vitals, physical exam findings...'       },
                        { key: 'assessment',  label: 'A — Assessment',  placeholder: 'Diagnosis, clinical impression...'       },
                        { key: 'plan',        label: 'P — Plan',        placeholder: 'Treatment, follow-up, referrals...'      },
                    ].map(field => (
                        <View key={field.key} style={styles.soapField}>
                            <Text style={styles.soapFieldLabel}>{field.label}</Text>
                            <TextInput
                                style={styles.soapInput}
                                multiline
                                numberOfLines={3}
                                placeholder={field.placeholder}
                                placeholderTextColor="#AAAAAA"
                                value={soap[field.key]}
                                onChangeText={val => setSoap(prev => ({ ...prev, [field.key]: val }))}
                                textAlignVertical="top"
                            />
                        </View>
                    ))}
                </View>
            )}

            {/* Note Tags */}
            <Text style={styles.sectionLabel}>Note Tags</Text>
            <View style={styles.tagsWrap}>
                {NOTE_TAGS.map(tag => (
                    <TouchableOpacity
                        key={tag}
                        style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
                        onPress={() => toggleTag(tag)}
                    >
                        <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>
                            {tag}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                <Icon type={Icons.Ionicons} name="save-outline" size={ms(16)} color={whiteColor} />
                <Text style={styles.actionBtnText}>Save Note</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// ── OrderTests ────────────────────────────────────────────────────────────────

const OrderTests = () => {
    const [selected, setSelected]       = useState([]);
    const [customTest, setCustomTest]   = useState('');
    const [priority, setPriority]       = useState('High');
    const [filterCat, setFilterCat]     = useState('All');

    const categories = ['All', ...new Set(SUGGESTED_TESTS.map(t => t.category))];

    const filtered = filterCat === 'All'
        ? SUGGESTED_TESTS
        : SUGGESTED_TESTS.filter(t => t.category === filterCat);

    const toggleTest = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const addCustom = () => {
        if (customTest.trim()) {
            setCustomTest('');
        }
    };

    const priorityColor = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                {categories.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.templateChip, filterCat === cat && styles.templateChipActive]}
                        onPress={() => setFilterCat(cat)}
                    >
                        <Text style={[styles.templateChipText, filterCat === cat && styles.templateChipTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Suggested Tests */}
            <Text style={styles.sectionLabel}>Suggested Diagnostics</Text>
            {filtered.map(test => {
                const isSelected = selected.includes(test.id);
                const pc = priorityColor[test.priority] || '#888';
                return (
                    <TouchableOpacity
                        key={test.id}
                        style={[styles.testRow, isSelected && styles.testRowSelected]}
                        onPress={() => toggleTest(test.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                            {isSelected && <Icon type={Icons.Ionicons} name="checkmark" size={ms(12)} color={whiteColor} />}
                        </View>
                        <View style={{ flex: 1, marginLeft: ms(10) }}>
                            <Text style={styles.testName}>{test.name}</Text>
                            <Text style={styles.testCategory}>{test.category}</Text>
                        </View>
                        <View style={[styles.priorityBadge, { backgroundColor: pc + '20' }]}>
                            <Text style={[styles.priorityBadgeText, { color: pc }]}>{test.priority}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}

            {/* Custom Test */}
            <Text style={styles.sectionLabel}>Add Custom Test</Text>
            <View style={styles.customTestRow}>
                <TextInput
                    style={styles.customTestInput}
                    placeholder="Enter test name..."
                    placeholderTextColor="#AAAAAA"
                    value={customTest}
                    onChangeText={setCustomTest}
                />
                <TouchableOpacity style={styles.addCustomBtn} onPress={addCustom}>
                    <Icon type={Icons.Ionicons} name="add" size={ms(20)} color={whiteColor} />
                </TouchableOpacity>
            </View>

            {/* Priority Selection */}
            <Text style={styles.sectionLabel}>Default Priority</Text>
            <View style={styles.priorityRow}>
                {['High', 'Medium', 'Low'].map(p => (
                    <TouchableOpacity
                        key={p}
                        style={[styles.priorityChip, priority === p && { backgroundColor: priorityColor[p], borderColor: priorityColor[p] }]}
                        onPress={() => setPriority(p)}
                    >
                        <Text style={[styles.priorityChipText, priority === p && { color: whiteColor }]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order Summary */}
            {selected.length > 0 && (
                <View style={styles.orderSummary}>
                    <Text style={styles.orderSummaryTitle}>{selected.length} test{selected.length > 1 ? 's' : ''} selected</Text>
                </View>
            )}

            <TouchableOpacity style={[styles.actionBtn, selected.length === 0 && styles.actionBtnDisabled]} activeOpacity={0.85}>
                <Icon type={Icons.Ionicons} name="flask-outline" size={ms(16)} color={whiteColor} />
                <Text style={styles.actionBtnText}>Place Order</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// ── Prescription ─────────────────────────────────────────────────────────────

const Prescription = () => {
    const [drugSearch, setDrugSearch]     = useState('');
    const [drugResults, setDrugResults]   = useState([]);
    const [rxList, setRxList]             = useState([]);
    const [interactionWarning, setInteractionWarning] = useState('');
    const [showPreview, setShowPreview]   = useState(false);

    const searchDrug = (text) => {
        setDrugSearch(text);
        if (text.length > 1) {
            const results = DRUG_DB.filter(d => d.name.toLowerCase().includes(text.toLowerCase()));
            setDrugResults(results);
        } else {
            setDrugResults([]);
        }
    };

    const selectDrug = (drug) => {
        const entry = {
            id:        Date.now().toString(),
            drug,
            strength:  drug.strengths[0],
            frequency: 'Once daily',
            duration:  7,
            durationUnit: 'Days',
            refills:   0,
        };
        const newList = [...rxList, entry];
        setRxList(newList);
        setDrugSearch('');
        setDrugResults([]);

        // Interaction check
        const allDrugNames = newList.map(rx => rx.drug.name);
        const warnings = [];
        newList.forEach(rx => {
            rx.drug.interactions.forEach(inter => {
                if (allDrugNames.some(n => n.toLowerCase().includes(inter.toLowerCase()))) {
                    warnings.push(`${rx.drug.name} ↔ ${inter}`);
                }
            });
        });
        setInteractionWarning(warnings.length > 0 ? warnings.join(', ') : '');
    };

    const removeDrug = (id) => {
        setRxList(prev => prev.filter(rx => rx.id !== id));
        setInteractionWarning('');
    };

    const updateRx = (id, field, value) => {
        setRxList(prev => prev.map(rx => rx.id === id ? { ...rx, [field]: value } : rx));
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {/* Drug Search */}
            <Text style={styles.sectionLabel}>Search Drug</Text>
            <View style={styles.drugSearchWrap}>
                <Icon type={Icons.Feather} name="search" size={ms(16)} color="#999" />
                <TextInput
                    style={styles.drugSearchInput}
                    placeholder="Search by drug name..."
                    placeholderTextColor="#AAAAAA"
                    value={drugSearch}
                    onChangeText={searchDrug}
                />
            </View>
            {drugResults.length > 0 && (
                <View style={styles.drugDropdown}>
                    {drugResults.map(drug => (
                        <TouchableOpacity key={drug.id} style={styles.drugDropdownItem} onPress={() => selectDrug(drug)}>
                            <Text style={styles.drugDropdownName}>{drug.name}</Text>
                            <Text style={styles.drugDropdownStrengths}>{drug.strengths.join(' | ')}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Interaction Warning */}
            {!!interactionWarning && (
                <View style={styles.warningBox}>
                    <Icon type={Icons.Ionicons} name="warning-outline" size={ms(16)} color="#F59E0B" />
                    <Text style={styles.warningText}>Interaction: {interactionWarning}</Text>
                </View>
            )}

            {/* Rx List */}
            {rxList.length > 0 && (
                <>
                    <Text style={styles.sectionLabel}>Prescription</Text>
                    {rxList.map(rx => (
                        <View key={rx.id} style={styles.rxCard}>
                            <View style={styles.rxCardHeader}>
                                <Text style={styles.rxDrugName}>{rx.drug.name}</Text>
                                <TouchableOpacity onPress={() => removeDrug(rx.id)}>
                                    <Icon type={Icons.Ionicons} name="close-circle" size={ms(20)} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            {/* Strength */}
                            <Text style={styles.rxLabel}>Strength</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.rxOptionsRow}>
                                    {rx.drug.strengths.map(s => (
                                        <TouchableOpacity
                                            key={s}
                                            style={[styles.rxOptionChip, rx.strength === s && styles.rxOptionChipActive]}
                                            onPress={() => updateRx(rx.id, 'strength', s)}
                                        >
                                            <Text style={[styles.rxOptionText, rx.strength === s && styles.rxOptionTextActive]}>{s}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* Frequency */}
                            <Text style={styles.rxLabel}>Frequency</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.rxOptionsRow}>
                                    {FREQUENCY_OPTIONS.map(f => (
                                        <TouchableOpacity
                                            key={f}
                                            style={[styles.rxOptionChip, rx.frequency === f && styles.rxOptionChipActive]}
                                            onPress={() => updateRx(rx.id, 'frequency', f)}
                                        >
                                            <Text style={[styles.rxOptionText, rx.frequency === f && styles.rxOptionTextActive]}>{f}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                            {/* Duration */}
                            <Text style={styles.rxLabel}>Duration</Text>
                            <View style={styles.durationRow}>
                                <TouchableOpacity
                                    style={styles.durationStepper}
                                    onPress={() => updateRx(rx.id, 'duration', Math.max(1, rx.duration - 1))}
                                >
                                    <Icon type={Icons.Ionicons} name="remove" size={ms(16)} color={primaryColor} />
                                </TouchableOpacity>
                                <Text style={styles.durationValue}>{rx.duration}</Text>
                                <TouchableOpacity
                                    style={styles.durationStepper}
                                    onPress={() => updateRx(rx.id, 'duration', rx.duration + 1)}
                                >
                                    <Icon type={Icons.Ionicons} name="add" size={ms(16)} color={primaryColor} />
                                </TouchableOpacity>
                                {DURATION_UNITS.map(u => (
                                    <TouchableOpacity
                                        key={u}
                                        style={[styles.rxOptionChip, rx.durationUnit === u && styles.rxOptionChipActive, { marginLeft: ms(6) }]}
                                        onPress={() => updateRx(rx.id, 'durationUnit', u)}
                                    >
                                        <Text style={[styles.rxOptionText, rx.durationUnit === u && styles.rxOptionTextActive]}>{u}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Refills */}
                            <Text style={styles.rxLabel}>Refills</Text>
                            <View style={styles.durationRow}>
                                <TouchableOpacity
                                    style={styles.durationStepper}
                                    onPress={() => updateRx(rx.id, 'refills', Math.max(0, rx.refills - 1))}
                                >
                                    <Icon type={Icons.Ionicons} name="remove" size={ms(16)} color={primaryColor} />
                                </TouchableOpacity>
                                <Text style={styles.durationValue}>{rx.refills}</Text>
                                <TouchableOpacity
                                    style={styles.durationStepper}
                                    onPress={() => updateRx(rx.id, 'refills', rx.refills + 1)}
                                >
                                    <Icon type={Icons.Ionicons} name="add" size={ms(16)} color={primaryColor} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Rx Preview Toggle */}
                    <TouchableOpacity style={styles.previewToggle} onPress={() => setShowPreview(!showPreview)}>
                        <Icon type={Icons.Ionicons} name={showPreview ? 'eye-off-outline' : 'eye-outline'} size={ms(16)} color={primaryColor} />
                        <Text style={styles.previewToggleText}>{showPreview ? 'Hide' : 'Show'} Rx Preview</Text>
                    </TouchableOpacity>

                    {showPreview && (
                        <View style={styles.rxPreview}>
                            <View style={styles.rxPreviewHeader}>
                                <Image source={require('../../assets/img/trustmdlogo.png')} style={styles.rxLogo} resizeMode="contain" />
                                <View>
                                    <Text style={styles.rxPreviewTitle}>Medical Prescription</Text>
                                    <Text style={styles.rxPreviewDate}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                                </View>
                            </View>
                            <View style={styles.rxPreviewDivider} />
                            <Text style={styles.rxPreviewPatient}>Patient: {PATIENT.name} | Age: {PATIENT.age} | ID: {PATIENT.id}</Text>
                            <View style={styles.rxPreviewDivider} />
                            {rxList.map((rx, i) => (
                                <View key={rx.id} style={styles.rxPreviewItem}>
                                    <Text style={styles.rxPreviewNum}>{i + 1}.</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.rxPreviewDrugName}>{rx.drug.name} {rx.strength}</Text>
                                        <Text style={styles.rxPreviewDetails}>{rx.frequency} × {rx.duration} {rx.durationUnit}{rx.refills > 0 ? ` · ${rx.refills} refills` : ''}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </>
            )}

            {rxList.length === 0 && (
                <View style={styles.emptyRx}>
                    <Icon type={Icons.Ionicons} name="medkit-outline" size={ms(40)} color="#DDD" />
                    <Text style={styles.emptyRxText}>Search a drug to add to the prescription</Text>
                </View>
            )}

            {rxList.length > 0 && (
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                    <Icon type={Icons.Ionicons} name="send-outline" size={ms(16)} color={whiteColor} />
                    <Text style={styles.actionBtnText}>Send Prescription</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

// ── TrustMDActionsScreen ──────────────────────────────────────────────────────

const TrustMDActionsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('notes');

    const renderContent = () => {
        if (activeTab === 'notes')    return <ConsultationNotes />;
        if (activeTab === 'tests')    return <OrderTests />;
        if (activeTab === 'prescribe') return <Prescription />;
        return null;
    };

    return (
        <LinearGradient colors={globalGradient2} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 0.35]} style={styles.flex1}>
        <SafeAreaView style={styles.container}>
            <StatusBar2 />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name="arrow-back" size={ms(20)} color={whiteColor} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Actions</Text>
                </View>
                <View style={styles.patientBadge}>
                    <Icon type={Icons.Ionicons} name="person-outline" size={ms(13)} color={primaryColor} />
                    <Text style={styles.patientBadgeText} numberOfLines={1}>{PATIENT.name}</Text>
                </View>
            </View>

            {/* Patient Conditions */}
            <View style={styles.conditionsBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.conditionsScroll}>
                    {PATIENT.conditions.map(c => (
                        <View key={c} style={styles.conditionChip}>
                            <Text style={styles.conditionChipText}>{c}</Text>
                        </View>
                    ))}
                    {PATIENT.allergies.map(a => (
                        <View key={a} style={styles.allergyChip}>
                            <Icon type={Icons.Ionicons} name="warning-outline" size={ms(10)} color="#EF4444" />
                            <Text style={styles.allergyChipText}>Allergy: {a}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBar}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
                        onPress={() => setActiveTab(tab.id)}
                        activeOpacity={0.7}
                    >
                        <Icon
                            type={Icons.Ionicons}
                            name={tab.icon}
                            size={ms(16)}
                            color={activeTab === tab.id ? primaryColor : blackColor}
                        />
                        <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.id && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.tabDivider} />

            {/* Content */}
            <View style={{ flex: 1 }}>
                {renderContent()}
            </View>
        </SafeAreaView>
        </LinearGradient>
    );
};

export default TrustMDActionsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    flex1: { flex: 1 },

    // ── Header ──────────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: ms(14), paddingTop: ms(48), paddingBottom: ms(14),
        gap: ms(10),
    },
    backBtn: {
        width: ms(34), height: ms(34), borderRadius: ms(17),
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerCenter: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: ms(6) },
    headerLogo: { width: ms(28), height: ms(28) },
    headerTitle: { fontSize: ms(17), fontWeight: '700', color: whiteColor },
    patientBadge: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: vs(5),
        maxWidth: ms(110),
    },
    patientBadgeText: { fontSize: ms(11), color: primaryColor, fontWeight: '600' },

    // ── Conditions Bar ──────────────────────────────────────────────────────────
    conditionsBar: { backgroundColor: 'transparent' },
    conditionsScroll: { paddingHorizontal: ms(14), paddingVertical: vs(8), gap: ms(8) },
    conditionChip: {
        backgroundColor: primaryColor + '15', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: vs(3),
    },
    conditionChipText: { fontSize: ms(11), color: primaryColor, fontWeight: '600' },
    allergyChip: {
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        backgroundColor: '#FEE2E2', borderRadius: ms(20),
        paddingHorizontal: ms(10), paddingVertical: vs(3),
    },
    allergyChipText: { fontSize: ms(11), color: '#EF4444', fontWeight: '600' },

    // ── Tab Bar ─────────────────────────────────────────────────────────────────
    tabBar: { flexDirection: 'row', backgroundColor: 'transparent', paddingHorizontal: ms(8) },
    tabItem: {
        flex: 1, alignItems: 'center', paddingVertical: vs(10), gap: vs(3),
        position: 'relative',
    },
    tabItemActive: {},
    tabLabel: { fontSize: ms(12), color: blackColor, fontWeight: '500' },
    tabLabelActive: { color: primaryColor, fontWeight: '700' },
    tabUnderline: {
        position: 'absolute', bottom: 0, left: ms(8), right: ms(8),
        height: 2, backgroundColor: primaryColor, borderRadius: 1,
    },
    tabDivider: { height: 1, backgroundColor: '#E5E7EB' },

    // ── Tab Content ─────────────────────────────────────────────────────────────
    tabContent: { padding: ms(16), paddingBottom: vs(40) },

    // ── Section Label ───────────────────────────────────────────────────────────
    sectionLabel: { fontSize: ms(13), fontWeight: '700', color: blackColor, marginBottom: vs(8), marginTop: vs(14) },

    // ── Mode Toggle ─────────────────────────────────────────────────────────────
    modeToggle: {
        flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: ms(10),
        padding: ms(3), marginBottom: vs(4),
    },
    modeBtn: { flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(8) },
    modeBtnActive: { backgroundColor: whiteColor, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
    modeBtnText: { fontSize: ms(13), color: '#666', fontWeight: '500' },
    modeBtnTextActive: { color: primaryColor, fontWeight: '700' },

    // ── Templates ───────────────────────────────────────────────────────────────
    templatesScroll: { marginBottom: vs(4) },
    templateChip: {
        backgroundColor: whiteColor, borderRadius: ms(20),
        paddingHorizontal: ms(14), paddingVertical: vs(6),
        marginRight: ms(8), borderWidth: 1, borderColor: '#E5E7EB',
    },
    templateChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    templateChipText: { fontSize: ms(12), color: '#555', fontWeight: '500' },
    templateChipTextActive: { color: whiteColor, fontWeight: '700' },

    // ── Text Area ───────────────────────────────────────────────────────────────
    textAreaWrap: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(4) },
    textArea: { fontSize: ms(13), color: blackColor, minHeight: vs(160) },
    charCount: { fontSize: ms(10), color: '#AAA', textAlign: 'right', marginTop: vs(4) },

    // ── SOAP ────────────────────────────────────────────────────────────────────
    soapContainer: { gap: vs(10) },
    soapField: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12) },
    soapFieldLabel: { fontSize: ms(12), fontWeight: '700', color: primaryColor, marginBottom: vs(6) },
    soapInput: { fontSize: ms(13), color: blackColor, minHeight: vs(70) },

    // ── Tags ────────────────────────────────────────────────────────────────────
    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(4) },
    tagChip: {
        backgroundColor: whiteColor, borderRadius: ms(20),
        paddingHorizontal: ms(12), paddingVertical: vs(6),
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    tagChipActive: { backgroundColor: primaryColor + '15', borderColor: primaryColor },
    tagChipText: { fontSize: ms(12), color: '#555' },
    tagChipTextActive: { color: primaryColor, fontWeight: '600' },

    // ── Tests ───────────────────────────────────────────────────────────────────
    testRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: whiteColor, borderRadius: ms(12),
        padding: ms(12), marginBottom: vs(8),
        borderWidth: 1, borderColor: 'transparent',
    },
    testRowSelected: { borderColor: primaryColor, backgroundColor: primaryColor + '08' },
    checkbox: {
        width: ms(22), height: ms(22), borderRadius: ms(6),
        borderWidth: 2, borderColor: '#D1D5DB',
        justifyContent: 'center', alignItems: 'center',
    },
    checkboxChecked: { backgroundColor: primaryColor, borderColor: primaryColor },
    testName: { fontSize: ms(13), fontWeight: '600', color: blackColor },
    testCategory: { fontSize: ms(11), color: '#888', marginTop: vs(1) },
    priorityBadge: { borderRadius: ms(12), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    priorityBadgeText: { fontSize: ms(11), fontWeight: '600' },

    // ── Custom Test ─────────────────────────────────────────────────────────────
    customTestRow: { flexDirection: 'row', gap: ms(10), alignItems: 'center', marginBottom: vs(4) },
    customTestInput: {
        flex: 1, backgroundColor: whiteColor, borderRadius: ms(12),
        paddingHorizontal: ms(14), paddingVertical: vs(10),
        fontSize: ms(13), color: blackColor,
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    addCustomBtn: {
        width: ms(42), height: ms(42), borderRadius: ms(12),
        backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center',
    },

    // ── Priority ────────────────────────────────────────────────────────────────
    priorityRow: { flexDirection: 'row', gap: ms(10) },
    priorityChip: {
        flex: 1, alignItems: 'center', paddingVertical: vs(8),
        borderRadius: ms(12), borderWidth: 1, borderColor: '#E5E7EB',
        backgroundColor: whiteColor,
    },
    priorityChipText: { fontSize: ms(13), fontWeight: '600', color: '#555' },

    // ── Order Summary ───────────────────────────────────────────────────────────
    orderSummary: {
        backgroundColor: primaryColor + '15', borderRadius: ms(12),
        padding: ms(12), marginTop: vs(10), alignItems: 'center',
    },
    orderSummaryTitle: { fontSize: ms(13), fontWeight: '700', color: primaryColor },

    // ── Drug Search ─────────────────────────────────────────────────────────────
    drugSearchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        backgroundColor: whiteColor, borderRadius: ms(12),
        paddingHorizontal: ms(14), paddingVertical: vs(10),
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    drugSearchInput: { flex: 1, fontSize: ms(13), color: blackColor },
    drugDropdown: {
        backgroundColor: whiteColor, borderRadius: ms(12),
        borderWidth: 1, borderColor: '#E5E7EB',
        marginTop: vs(4), overflow: 'hidden', elevation: 4,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    drugDropdownItem: {
        paddingHorizontal: ms(14), paddingVertical: vs(10),
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    drugDropdownName: { fontSize: ms(13), fontWeight: '600', color: blackColor },
    drugDropdownStrengths: { fontSize: ms(11), color: '#888', marginTop: vs(1) },

    // ── Interaction Warning ─────────────────────────────────────────────────────
    warningBox: {
        flexDirection: 'row', alignItems: 'center', gap: ms(8),
        backgroundColor: '#FEF3C7', borderRadius: ms(10),
        padding: ms(12), marginTop: vs(8),
    },
    warningText: { flex: 1, fontSize: ms(12), color: '#92400E' },

    // ── Rx Card ─────────────────────────────────────────────────────────────────
    rxCard: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(12),
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    rxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10) },
    rxDrugName: { fontSize: ms(15), fontWeight: '700', color: blackColor },
    rxLabel: { fontSize: ms(11), color: '#888', fontWeight: '500', marginBottom: vs(6), marginTop: vs(8) },
    rxOptionsRow: { flexDirection: 'row', gap: ms(8), paddingBottom: vs(4) },
    rxOptionChip: {
        paddingHorizontal: ms(12), paddingVertical: vs(6), borderRadius: ms(20),
        borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
    },
    rxOptionChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    rxOptionText: { fontSize: ms(12), color: '#555', fontWeight: '500' },
    rxOptionTextActive: { color: whiteColor, fontWeight: '700' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
    durationStepper: {
        width: ms(32), height: ms(32), borderRadius: ms(8),
        backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center',
    },
    durationValue: { fontSize: ms(16), fontWeight: '700', color: blackColor, minWidth: ms(24), textAlign: 'center' },

    // ── Rx Preview ──────────────────────────────────────────────────────────────
    previewToggle: {
        flexDirection: 'row', alignItems: 'center', gap: ms(6),
        justifyContent: 'center', paddingVertical: vs(10), marginBottom: vs(8),
    },
    previewToggleText: { fontSize: ms(13), color: primaryColor, fontWeight: '600' },
    rxPreview: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16),
        borderWidth: 2, borderColor: primaryColor + '30', marginBottom: vs(12),
    },
    rxPreviewHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(10) },
    rxLogo: { width: ms(36), height: ms(36) },
    rxPreviewTitle: { fontSize: ms(14), fontWeight: '700', color: blackColor },
    rxPreviewDate: { fontSize: ms(11), color: '#888' },
    rxPreviewDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: vs(8) },
    rxPreviewPatient: { fontSize: ms(12), color: '#555' },
    rxPreviewItem: { flexDirection: 'row', gap: ms(8), marginTop: vs(6) },
    rxPreviewNum: { fontSize: ms(13), fontWeight: '700', color: primaryColor, width: ms(16) },
    rxPreviewDrugName: { fontSize: ms(13), fontWeight: '700', color: blackColor },
    rxPreviewDetails: { fontSize: ms(12), color: '#666' },

    // ── Empty Rx ────────────────────────────────────────────────────────────────
    emptyRx: { alignItems: 'center', paddingTop: vs(40), gap: vs(10) },
    emptyRxText: { fontSize: ms(13), color: '#AAA', textAlign: 'center' },

    // ── Action Button ───────────────────────────────────────────────────────────
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(8),
        backgroundColor: primaryColor, borderRadius: ms(25),
        paddingVertical: vs(14), marginTop: vs(20),
    },
    actionBtnDisabled: { backgroundColor: '#AAA' },
    actionBtnText: { fontSize: ms(14), fontWeight: '700', color: whiteColor },
});
