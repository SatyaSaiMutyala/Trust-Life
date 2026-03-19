import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms, vs } from 'react-native-size-matters';
import { StatusBar2 } from '../../components/StatusBar';
import Icon, { Icons } from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path as SvgPath, Line as SvgLine, Circle as SvgCircle, Text as SvgText, Rect as SvgRect, G as SvgG } from 'react-native-svg';
import { blackColor, whiteColor, primaryColor, globalGradient2 } from '../../utils/globalColors';
import { heading, interMedium, interRegular } from '../../config/Constants';

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
        subjective: 'Patient reports fatigue, decreased appetite. Creatinine trending up over last 6 months.',
        objective: 'BP: 140/90. Creatinine: 2.4 mg/dL. eGFR: 28. Urine protein: 2+. Pedal oedema: Mild.',
        assessment: 'CKD Stage 4 – Progressive. Hypertension contributing. Anaemia of CKD.',
        plan: 'Nephrology referral. Restrict protein & potassium. Erythropoietin. Review medications. Follow-up 2 weeks.',
    },
    {
        id: 'cardiac',
        label: 'Cardiac',
        subjective: 'Exertional chest pain. SOB on climbing stairs. Palpitations. No syncope.',
        objective: 'HR: 88 bpm. BP: 145/92. ECG: ST depression V4-V6. Echo: EF 45%.',
        assessment: 'Unstable angina. Reduced EF. Hypertensive heart disease.',
        plan: 'Aspirin, Nitrate, Beta-blocker. Urgent cardiology referral. Admit for monitoring.',
    },
];

const SUGGESTED_TESTS = [
    { id: 't1', name: 'HbA1c',             category: 'Diabetes',     priority: 'High'   },
    { id: 't2', name: 'Fasting Blood Sugar',category: 'Diabetes',     priority: 'High'   },
    { id: 't3', name: 'Lipid Profile',      category: 'Cardiac',      priority: 'Medium' },
    { id: 't4', name: 'Serum Creatinine',   category: 'Renal',        priority: 'High'   },
    { id: 't5', name: 'eGFR',              category: 'Renal',        priority: 'High'   },
    { id: 't6', name: 'Urine Routine',      category: 'Renal',        priority: 'Medium' },
    { id: 't7', name: 'ECG',               category: 'Cardiac',      priority: 'High'   },
    { id: 't8', name: 'CBC',               category: 'General',      priority: 'Medium' },
    { id: 't9', name: 'Thyroid Profile',    category: 'Thyroid',      priority: 'Low'    },
    { id: 't10', name: 'Liver Function Test',category: 'Liver',       priority: 'Low'    },
];

const DRUG_DB = [
    { id: '1', name: 'Metformin',      strengths: ['500mg', '850mg', '1000mg'],  interactions: ['Contrast dye']   },
    { id: '2', name: 'Amlodipine',     strengths: ['2.5mg', '5mg', '10mg'],      interactions: ['Simvastatin']    },
    { id: '3', name: 'Atorvastatin',   strengths: ['10mg', '20mg', '40mg', '80mg'], interactions: ['Amlodipine']  },
    { id: '4', name: 'Losartan',       strengths: ['25mg', '50mg', '100mg'],     interactions: ['Spironolactone'] },
    { id: '5', name: 'Aspirin',        strengths: ['75mg', '150mg', '325mg'],    interactions: ['Warfarin', 'NSAIDs'] },
    { id: '6', name: 'Furosemide',     strengths: ['20mg', '40mg', '80mg'],      interactions: []                 },
    { id: '7', name: 'Glibenclamide',  strengths: ['2.5mg', '5mg'],              interactions: ['Fluconazole']    },
    { id: '8', name: 'Insulin Glargine', strengths: ['100U/mL'],                 interactions: []                 },
];

const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Thrice daily', 'At bedtime', 'SOS'];
const DURATION_UNITS    = ['Days', 'Weeks', 'Months'];

// ── Notes Sub-Tab Data ────────────────────────────────────────────────────────

const NOTE_SUBTABS = [
    { id: 'soap',        label: 'SOAP Note',    icon: 'document-text-outline'    },
    { id: 'body',        label: 'Body Diagram',  icon: 'body-outline'             },
    { id: 'dental',      label: 'Dental',        icon: 'medical-outline'          },
    { id: 'vaccination', label: 'Vaccination',   icon: 'shield-checkmark-outline' },
    { id: 'growth',      label: 'Growth',        icon: 'trending-up-outline'      },
    { id: 'dermatology', label: 'Dermatology',   icon: 'color-palette-outline'    },
    { id: 'ent',         label: 'ENT',           icon: 'ear-outline'              },
    { id: 'referral',    label: 'Referral',      icon: 'share-social-outline'     },
];

const BODY_REGIONS = [
    { id: 'head',      label: 'Head',     icon: 'ellipse-outline'     },
    { id: 'neck',      label: 'Neck',     icon: 'remove-outline'      },
    { id: 'chest',     label: 'Chest',    icon: 'heart-outline'       },
    { id: 'abdomen',   label: 'Abdomen',  icon: 'body-outline'        },
    { id: 'left_arm',  label: 'L. Arm',   icon: 'hand-left-outline'   },
    { id: 'right_arm', label: 'R. Arm',   icon: 'hand-right-outline'  },
    { id: 'left_leg',  label: 'L. Leg',   icon: 'footsteps-outline'   },
    { id: 'right_leg', label: 'R. Leg',   icon: 'footsteps-outline'   },
    { id: 'back',      label: 'Back',     icon: 'person-outline'      },
    { id: 'spine',     label: 'Spine',    icon: 'git-branch-outline'  },
];

// ── Body Diagram Data ─────────────────────────────────────────────────────────

const BODY_SPECIALTIES = [
    { id: 'general',    label: 'General',      icon: 'body-outline'          },
    { id: 'cardiology', label: 'Cardiology',   icon: 'heart-outline'         },
    { id: 'ortho',      label: 'Orthopaedics', icon: 'fitness-outline'       },
    { id: 'neuro',      label: 'Neurology',    icon: 'flash-outline'         },
    { id: 'derm',       label: 'Dermatology',  icon: 'color-palette-outline' },
    { id: 'ent',        label: 'ENT',          icon: 'ear-outline'           },
];

const BODY_FRONT_REGIONS = [
    { id: 'head',         label: 'Head'          },
    { id: 'neck',         label: 'Neck'          },
    { id: 'r_shoulder',   label: 'R.Shoulder'    },
    { id: 'l_shoulder',   label: 'L.Shoulder'    },
    { id: 'chest',        label: 'Chest/Thorax'  },
    { id: 'abdomen',      label: 'Abdomen'       },
    { id: 'pelvis',       label: 'Pelvis/Groin'  },
    { id: 'r_arm',        label: 'R.Arm'         },
    { id: 'l_arm',        label: 'L.Arm'         },
    { id: 'r_forearm',    label: 'R.Forearm'     },
    { id: 'l_forearm',    label: 'L.Forearm'     },
    { id: 'r_hand',       label: 'R.Hand'        },
    { id: 'l_hand',       label: 'L.Hand'        },
    { id: 'r_thigh',      label: 'R.Thigh'       },
    { id: 'l_thigh',      label: 'L.Thigh'       },
    { id: 'r_shin',       label: 'R.Shin'        },
    { id: 'l_shin',       label: 'L.Shin'        },
];

const BODY_BACK_REGIONS = [
    { id: 'occiput',      label: 'Occiput'       },
    { id: 'neck_p',       label: 'Neck (Post.)'  },
    { id: 'r_shoulder_b', label: 'R.Shoulder'    },
    { id: 'l_shoulder_b', label: 'L.Shoulder'    },
    { id: 'upper_back',   label: 'Upper Back'    },
    { id: 'lower_back',   label: 'Lower Back'    },
    { id: 'gluteal',      label: 'Gluteal'       },
    { id: 'r_triceps',    label: 'R.Triceps'     },
    { id: 'l_triceps',    label: 'L.Triceps'     },
    { id: 'r_forearm_b',  label: 'R.Forearm'     },
    { id: 'l_forearm_b',  label: 'L.Forearm'     },
    { id: 'r_hamstring',  label: 'R.Hamstring'   },
    { id: 'l_hamstring',  label: 'L.Hamstring'   },
    { id: 'r_calf',       label: 'R.Calf'        },
    { id: 'l_calf',       label: 'L.Calf'        },
];

const SEVERITY_OPTIONS = ['Clinical Finding', 'Concern', 'Urgent', 'Normal'];

const SPECIALTY_CHECKLISTS = {
    general: [
        'General appearance',
        'Vital signs',
        'Lymph nodes palpable',
        'Oedema',
        'Anaemia / pallor',
        'Clubbing / cyanosis',
    ],
    cardiology: [
        'Chest pain location',
        'Radiation pattern',
        'JVP elevated',
        'Heart sounds normal',
        'Peripheral pulses',
        'Ankle oedema',
    ],
    ortho: [
        'Swelling / deformity',
        'Tenderness on palpation',
        'Range of motion limited',
        'Muscle wasting',
        'Neurovascular status',
        'Gait assessment',
    ],
    neuro: [
        'Motor deficit',
        'Sensory deficit',
        'Reflexes normal',
        'Cranial nerve exam',
        'Coordination (cerebellar)',
        'Gait / balance',
    ],
    derm: [
        'Distribution pattern',
        'Primary lesion type',
        'Secondary changes',
        'Koebner phenomenon',
        'Nikolsky sign',
        'Mucosal involvement',
    ],
    ent: [
        'Ear (TM normal)',
        'Nasal obstruction',
        'Post-nasal drip',
        'Oropharynx normal',
        'Neck nodes palpable',
        'Voice quality',
    ],
};

const DENTAL_CONDITIONS = [
    { id: 'healthy',    label: 'Healthy',          abbr: '',   fill: '#F0FDF4', stroke: '#86EFAC', color: '#10B981' },
    { id: 'cavity',     label: 'Cavity',           abbr: 'C',  fill: '#FEF9C3', stroke: '#FDE047', color: '#CA8A04' },
    { id: 'extraction', label: 'Extraction',       abbr: 'X',  fill: '#FEF2F2', stroke: '#FECACA', color: '#EF4444' },
    { id: 'root_canal', label: 'Root Canal',       abbr: 'RC', fill: '#FFF7ED', stroke: '#FED7AA', color: '#F97316' },
    { id: 'crown',      label: 'Crown/Bridge',     abbr: 'Cr', fill: '#EFF6FF', stroke: '#BFDBFE', color: '#3B82F6' },
    { id: 'filling',    label: 'Filling',          abbr: 'F',  fill: '#F3E8FF', stroke: '#D8B4FE', color: '#8B5CF6' },
    { id: 'missing',    label: 'Missing',          abbr: 'O',  fill: '#F1F5F9', stroke: '#CBD5E1', color: '#9CA3AF' },
    { id: 'fracture',   label: 'Fracture',         abbr: 'Fr', fill: '#FFF1F2', stroke: '#FECDD3', color: '#EC4899' },
];

const UPPER_TEETH = [[18,17,16,15,14,13,12,11], [21,22,23,24,25,26,27,28]];
const LOWER_TEETH = [[48,47,46,45,44,43,42,41], [31,32,33,34,35,36,37,38]];

const initialTeethState = () => {
    const teeth = {};
    [...UPPER_TEETH[0], ...UPPER_TEETH[1], ...LOWER_TEETH[0], ...LOWER_TEETH[1]].forEach(n => {
        teeth[n] = 'healthy';
    });
    return teeth;
};

const VACCINATION_GROUPS = [
    {
        group: 'At Birth',
        vaccines: [
            { id: 'bcg',      name: 'BCG',          desc: 'Bacillus Calmette-Guérin — TB prevention',              route: 'ID',   mandatory: true,  given: true,  date: '2024-01-15', lot: 'BCG2401', notes: '' },
            { id: 'opv0',     name: 'OPV-0',        desc: 'Oral Polio Vaccine — birth dose',                       route: 'Oral', mandatory: true,  given: true,  date: '2024-01-15', lot: 'OPV2401', notes: '' },
            { id: 'hepb0',    name: 'Hep B-0',      desc: 'Hepatitis B — birth dose',                              route: 'IM',   mandatory: true,  given: true,  date: '2024-01-15', lot: 'HBV2401', notes: '' },
        ],
    },
    {
        group: '6 Weeks',
        vaccines: [
            { id: 'dpt1',     name: 'DTwP-1',       desc: 'Diphtheria, Tetanus, Pertussis — dose 1',               route: 'IM',   mandatory: true,  given: true,  date: '2024-02-26', lot: 'DTP2402', notes: '' },
            { id: 'opv1',     name: 'OPV-1',        desc: 'Oral Polio Vaccine — dose 1',                           route: 'Oral', mandatory: true,  given: true,  date: '2024-02-26', lot: 'OPV2402', notes: '' },
            { id: 'hib1',     name: 'Hib-1',        desc: 'Haemophilus influenzae type b — dose 1',                route: 'IM',   mandatory: false, given: true,  date: '2024-02-26', lot: 'HIB2402', notes: '' },
            { id: 'ipv1',     name: 'IPV-1',        desc: 'Inactivated Polio Vaccine — dose 1',                    route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'pcv1',     name: 'PCV-1',        desc: 'Pneumococcal Conjugate Vaccine — dose 1',               route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'rv1',      name: 'RV-1',         desc: 'Rotavirus Vaccine — dose 1',                            route: 'Oral', mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '10 Weeks',
        vaccines: [
            { id: 'dpt2',     name: 'DTwP-2',       desc: 'Diphtheria, Tetanus, Pertussis — dose 2',               route: 'IM',   mandatory: true,  given: true,  date: '2024-03-25', lot: 'DTP2403', notes: '' },
            { id: 'opv2',     name: 'OPV-2',        desc: 'Oral Polio Vaccine — dose 2',                           route: 'Oral', mandatory: true,  given: true,  date: '2024-03-25', lot: 'OPV2403', notes: '' },
            { id: 'hib2',     name: 'Hib-2',        desc: 'Haemophilus influenzae type b — dose 2',                route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'ipv2',     name: 'IPV-2',        desc: 'Inactivated Polio Vaccine — dose 2',                    route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'pcv2',     name: 'PCV-2',        desc: 'Pneumococcal Conjugate Vaccine — dose 2',               route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'rv2',      name: 'RV-2',         desc: 'Rotavirus Vaccine — dose 2',                            route: 'Oral', mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '14 Weeks',
        vaccines: [
            { id: 'dpt3',     name: 'DTwP-3',       desc: 'Diphtheria, Tetanus, Pertussis — dose 3',               route: 'IM',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'opv3',     name: 'OPV-3',        desc: 'Oral Polio Vaccine — dose 3',                           route: 'Oral', mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'hib3',     name: 'Hib-3',        desc: 'Haemophilus influenzae type b — dose 3',                route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'ipv3',     name: 'IPV-3',        desc: 'Inactivated Polio Vaccine — dose 3',                    route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'pcv3',     name: 'PCV-3',        desc: 'Pneumococcal Conjugate Vaccine — dose 3',               route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '6 Months',
        vaccines: [
            { id: 'hepb1',    name: 'Hep B-1',      desc: 'Hepatitis B — dose 2',                                  route: 'IM',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'opv4',     name: 'OPV-4',        desc: 'Oral Polio Vaccine — dose 4',                           route: 'Oral', mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '9 Months',
        vaccines: [
            { id: 'mmr1',     name: 'MMR-1',        desc: 'Measles, Mumps, Rubella — dose 1',                      route: 'SC',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'typhoid1', name: 'Typhoid',      desc: 'Typhoid Conjugate Vaccine',                             route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'opv5',     name: 'OPV-5',        desc: 'Oral Polio Vaccine — dose 5',                           route: 'Oral', mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '12 Months',
        vaccines: [
            { id: 'hepa1',    name: 'Hep A-1',      desc: 'Hepatitis A — dose 1',                                  route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '15 Months',
        vaccines: [
            { id: 'mmr2',     name: 'MMR-2',        desc: 'Measles, Mumps, Rubella — dose 2',                      route: 'SC',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'var1',     name: 'Varicella-1',  desc: 'Chickenpox Vaccine — dose 1',                           route: 'SC',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'pcvb',     name: 'PCV-B',        desc: 'Pneumococcal Conjugate — booster',                      route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '18 Months',
        vaccines: [
            { id: 'dptb1',    name: 'DTwP-B1',      desc: 'DTP Booster 1',                                         route: 'IM',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'opv6',     name: 'OPV-6',        desc: 'Oral Polio Vaccine — booster',                          route: 'Oral', mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'hibb',     name: 'Hib-B',        desc: 'Haemophilus influenzae type b — booster',               route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'hepa2',    name: 'Hep A-2',      desc: 'Hepatitis A — dose 2',                                  route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '4\u20136 Years',
        vaccines: [
            { id: 'dptb2',    name: 'DTwP-B2',      desc: 'DTP Booster 2',                                         route: 'IM',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'opv7',     name: 'OPV-7',        desc: 'Oral Polio Vaccine — booster 2',                        route: 'Oral', mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'mmr3',     name: 'MMR-3',        desc: 'Measles, Mumps, Rubella — dose 3',                      route: 'SC',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
            { id: 'var2',     name: 'Varicella-2',  desc: 'Chickenpox Vaccine — dose 2',                           route: 'SC',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
    {
        group: '10\u201312 Years',
        vaccines: [
            { id: 'tdap',     name: 'Tdap/Td',      desc: 'Tetanus, Diphtheria, acellular Pertussis',              route: 'IM',   mandatory: true,  given: false, date: '',           lot: '',        notes: '' },
            { id: 'hpv1',     name: 'HPV',          desc: 'Human Papillomavirus Vaccine (girls)',                  route: 'IM',   mandatory: false, given: false, date: '',           lot: '',        notes: '' },
        ],
    },
];

// ── Dermatology Data ──────────────────────────────────────────────────────────

const DERM_CONDITIONS = [
    { id: 'erythema',  label: 'Erythema',       color: '#EF4444', bg: '#FEE2E2' },
    { id: 'macule',    label: 'Macule/Patch',   color: '#8B5CF6', bg: '#EDE9FF' },
    { id: 'papule',    label: 'Papule/Plaque',  color: '#F59E0B', bg: '#FEF3C7' },
    { id: 'vesicle',   label: 'Vesicle/Bulla',  color: '#3B82F6', bg: '#DBEAFE' },
    { id: 'pustule',   label: 'Pustule',        color: '#F97316', bg: '#FFEDD5' },
    { id: 'urticaria', label: 'Urticaria',      color: '#EC4899', bg: '#FCE7F3' },
    { id: 'hyperpig',  label: 'Hyper-pigment',  color: '#92400E', bg: '#FEF9C3' },
    { id: 'hypopig',   label: 'Hypo-pigment',   color: '#6B7280', bg: '#F3F4F6' },
    { id: 'scale',     label: 'Scale/Crust',    color: '#D97706', bg: '#FEF3C7' },
    { id: 'ulcer',     label: 'Ulcer',          color: '#DC2626', bg: '#FEE2E2' },
    { id: 'normal',    label: 'Normal/Clear',   color: '#10B981', bg: '#D1FAE5' },
];

const DERM_BODY_VIEWS = [
    { id: 'anterior',  label: 'Anterior',  icon: 'person-outline',        regions: ['Face', 'Scalp', 'Neck', 'R.Chest', 'L.Chest', 'R.Abdomen', 'L.Abdomen', 'R.Shoulder', 'L.Shoulder', 'R.UpperArm', 'L.UpperArm', 'R.Forearm', 'L.Forearm', 'R.Hand', 'L.Hand', 'R.Thigh', 'L.Thigh', 'R.Shin', 'L.Shin', 'Genitalia'] },
    { id: 'posterior', label: 'Posterior', icon: 'man-outline',            regions: ['Occiput', 'Nape', 'R.Shoulder-P', 'L.Shoulder-P', 'R.Back-U', 'L.Back-U', 'R.Back-L', 'L.Back-L', 'Lumbar', 'R.Buttock', 'L.Buttock', 'R.Thigh-P', 'L.Thigh-P', 'R.Calf', 'L.Calf', 'R.Heel', 'L.Heel', 'R.Sole', 'L.Sole', 'Intergluteal'] },
    { id: 'face',      label: 'Face/Head', icon: 'happy-outline',          regions: ['Forehead', 'R.Temple', 'L.Temple', 'R.Cheek', 'L.Cheek', 'Nose', 'Perioral', 'Chin', 'R.Ear', 'L.Ear'] },
    { id: 'hands',     label: 'Hands',     icon: 'hand-left-outline',      regions: ['R.Palm', 'R.Dorsum', 'R.Fingers-V', 'R.Fingers-D', 'R.Nails', 'R.Wrist', 'L.Palm', 'L.Dorsum', 'L.Fingers-V', 'L.Fingers-D', 'L.Nails', 'L.Wrist'] },
    { id: 'feet',      label: 'Feet',      icon: 'footsteps-outline',      regions: ['R.Sole', 'R.Dorsum', 'R.Toes-V', 'R.Toes-D', 'R.Nails', 'L.Sole', 'L.Dorsum', 'L.Toes-V', 'L.Toes-D', 'L.Nails'] },
];

const DERM_PRIMARY_LESIONS = ['Macule', 'Patch', 'Papule', 'Plaque', 'Nodule', 'Vesicle', 'Bulla', 'Pustule', 'Wheal', 'Cyst', 'Tumour'];
const DERM_SECONDARY       = ['Scale', 'Crust', 'Erosion', 'Ulcer', 'Fissure', 'Lichenification', 'Excoriation', 'Atrophy', 'Scar'];
const DERM_COLOURS         = ['Pink', 'Red', 'Brown', 'Black', 'White', 'Yellow', 'Purple', 'Blue-Grey', 'Flesh', 'Mixed'];
const DERM_SURFACE         = ['Smooth', 'Rough', 'Verrucous', 'Scaly', 'Crusted', 'Ulcerated'];
const DERM_BORDER          = ['Well-defined', 'Ill-defined', 'Irregular', 'Serpiginous', 'Polycyclic'];
const DERM_SYMPTOMS        = ['Pruritus', 'Pain', 'Burning', 'Paraesthesia', 'Asymptomatic'];
const DERM_INVESTIGATIONS  = ['Skin biopsy', 'KOH mount', "Wood's lamp", 'Patch test', 'Tzanck smear', 'Blood CBC', 'IgE levels'];
const DERM_MORPHOLOGY      = ['Eczematous', 'Psoriasiform', 'Lichenoid', 'Vesicular', 'Pustular', 'Annular', 'Linear', 'Serpiginous'];

const ABCDE_FULL = [
    { id: 'A', label: 'Asymmetry', desc: 'Shape symmetry',    options: [{ label: 'Symmetric', score: 0 }, { label: 'Asymmetric', score: 1 }] },
    { id: 'B', label: 'Border',    desc: 'Edge regularity',   options: [{ label: 'Regular', score: 0 }, { label: 'Irregular/Notched', score: 1 }] },
    { id: 'C', label: 'Colour',    desc: 'Colour variation',  options: [{ label: 'Uniform', score: 0 }, { label: 'Varied \u22652 shades', score: 1 }] },
    { id: 'D', label: 'Diameter',  desc: 'Largest dimension', options: [{ label: '< 6mm', score: 0 }, { label: '6\u201310mm', score: 1 }] },
    { id: 'E', label: 'Evolution', desc: 'Change over time',  options: [{ label: 'Stable', score: 0 }, { label: 'Changing', score: 1 }, { label: 'Rapid change', score: 2 }] },
];

// ── ENT Data ──────────────────────────────────────────────────────────────────

const ENT_SUB_SECTIONS = [
    { id: 'ear',     label: 'Ear/TM',     icon: 'ear-outline'           },
    { id: 'nose',    label: 'Nose',       icon: 'navigate-outline'      },
    { id: 'sinus',   label: 'Sinuses',    icon: 'grid-outline'          },
    { id: 'throat',  label: 'Throat',     icon: 'mic-outline'           },
    { id: 'neck',    label: 'Neck Nodes', icon: 'location-outline'      },
    { id: 'summary', label: 'Summary',    icon: 'document-text-outline' },
];

const TM_QUADRANTS         = ['AS', 'PS', 'AI', 'PI'];
const EAR_FINDINGS         = ['Normal TM', 'Perforated TM', 'Retracted TM', 'Bulging TM', 'Fluid level', 'Wax impaction', 'Congested', 'Light reflex lost', 'Haemotympanum', 'Myringosclerosis', 'Grommets in situ', 'Cholesteatoma', 'Discharge'];
const AUDIOMETRY_OPTIONS   = ['Normal', 'CHL Mild', 'CHL Moderate', 'SNHL', 'Mixed'];
const TYMPANOMETRY_OPTIONS = ['Type A (Normal)', 'Type B (Flat)', 'Type C (Negative pressure)', 'Type As/Ad'];
const NASAL_FINDINGS       = ['Normal', 'DNS', 'IT Hypertrophy', 'Polyps', 'Mucosal Oedema', 'Purulent Discharge', 'Mucopurulent', 'Epistaxis', 'Pallor', 'Crusting'];
const PARANASAL_SINUSES    = [
    { id: 'r_frontal',   label: 'R.Frontal'   },
    { id: 'l_frontal',   label: 'L.Frontal'   },
    { id: 'r_ethmoid',   label: 'R.Ethmoid'   },
    { id: 'l_ethmoid',   label: 'L.Ethmoid'   },
    { id: 'r_maxillary', label: 'R.Maxillary' },
    { id: 'l_maxillary', label: 'L.Maxillary' },
    { id: 'sphenoid',    label: 'Sphenoid'    },
];
const THROAT_STRUCTURES    = ['Soft palate', 'Uvula', 'L.Tonsil', 'R.Tonsil', 'Post.pharyngeal wall', 'Tongue base'];
const TONSIL_GRADES        = ['0', '1+', '2+', '3+', '4+'];
const NECK_NODE_GROUPS     = [
    { level: 'Level Ia',  nodes: ['Submental'] },
    { level: 'Level Ib',  nodes: ['R.Submandibular', 'L.Submandibular'] },
    { level: 'Level II',  nodes: ['R.Upper Jugular', 'L.Upper Jugular'] },
    { level: 'Level III', nodes: ['R.Mid Jugular', 'L.Mid Jugular'] },
    { level: 'Level IV',  nodes: ['R.Lower Jugular', 'L.Lower Jugular'] },
    { level: 'Level V',   nodes: ['R.Posterior Triangle', 'L.Posterior Triangle'] },
    { level: 'Level VI',  nodes: ['Prelaryngeal', 'Pretracheal', 'Paratracheal'] },
    { level: 'Parotid/Occipital', nodes: ['R.Parotid', 'L.Parotid', 'R.Occipital', 'L.Occipital'] },
];
const ENT_INVESTIGATIONS   = ['Audiogram', 'Tympanogram', 'CT Sinuses', 'CT Neck', 'MRI Neck', 'FNAC', 'Nasal Endoscopy'];

const REFERRAL_SUBTABS = [
    { id: 'new',        label: 'New Referral'  },
    { id: 'sent',       label: 'Sent'          },
    { id: 'received',   label: 'Received'      },
    { id: 'specialists',label: 'Specialists'   },
    { id: 'tracking',   label: 'Tracking'      },
];

const REFERRAL_SPECIALTIES = ['Cardiology', 'Nephrology', 'Neurology', 'Endocrinology', 'Dermatology', 'Orthopedics', 'Gastroenterology', 'Pulmonology'];

const SPECIALIST_DIRECTORY = [
    { id: '1', name: 'Dr. Priya Sharma', specialty: 'Cardiology',     hospital: 'Apollo Hospital',   available: true  },
    { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Nephrology',     hospital: 'Fortis Hospital',   available: true  },
    { id: '3', name: 'Dr. Anitha Reddy', specialty: 'Endocrinology',  hospital: 'Max Hospital',      available: false },
    { id: '4', name: 'Dr. Suresh Patel', specialty: 'Neurology',      hospital: 'Manipal Hospital',  available: true  },
    { id: '5', name: 'Dr. Kavitha Nair', specialty: 'Dermatology',    hospital: 'Columbia Asia',     available: true  },
];

const SENT_REFERRALS = [
    { id: '1', patient: 'Arjun Reddy', specialty: 'Cardiology',   doctor: 'Dr. Priya Sharma', date: '15 Mar 2026', status: 'Accepted', urgent: false },
    { id: '2', patient: 'Meena Iyer',  specialty: 'Nephrology',   doctor: 'Dr. Rajesh Kumar', date: '10 Mar 2026', status: 'Pending',  urgent: true  },
    { id: '3', patient: 'Ravi Das',    specialty: 'Neurology',    doctor: 'Dr. Suresh Patel', date: '08 Mar 2026', status: 'Completed',urgent: false },
];

const RECEIVED_REFERRALS = [
    { id: '1', from: 'Dr. Suresh Patel', patient: 'Kiran Rao', specialty: 'Neurology',     date: '18 Mar 2026', status: 'New',      urgent: true  },
    { id: '2', from: 'Dr. Anitha Reddy', patient: 'Sita Devi', specialty: 'Endocrinology', date: '12 Mar 2026', status: 'Reviewed', urgent: false },
];

// ── Main Tabs ─────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'notes',     label: 'Notes',     icon: 'document-text-outline' },
    { id: 'tests',     label: 'Tests',     icon: 'flask-outline'          },
    { id: 'prescribe', label: 'Prescribe', icon: 'medkit-outline'         },
];

// ── SoapNoteTab ───────────────────────────────────────────────────────────────

const SoapNoteTab = () => {
    const [mode, setMode]                   = useState('free');
    const [freeText, setFreeText]           = useState('');
    const [selectedTags, setSelectedTags]   = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [soap, setSoap] = useState({ subjective: '', objective: '', assessment: '', plan: '' });

    const applyTemplate = (tmpl) => {
        setSoap({ subjective: tmpl.subjective, objective: tmpl.objective, assessment: tmpl.assessment, plan: tmpl.plan });
        setSelectedTemplate(tmpl.id);
        setMode('soap');
    };
    const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {/* Vitals Mini Cards */}
            <View style={styles.vitalsRow}>
                {[{ label: 'BP', value: '130/85', unit: 'mmHg', icon: 'heart-outline', color: '#EF4444' },
                  { label: 'HR', value: '82', unit: 'bpm', icon: 'pulse-outline', color: '#F59E0B' },
                  { label: 'SpO2', value: '97', unit: '%', icon: 'water-outline', color: '#3B82F6' },
                  { label: 'Temp', value: '98.6', unit: '°F', icon: 'thermometer-outline', color: '#10B981' },
                ].map(v => (
                    <View key={v.label} style={styles.vitalCard}>
                        <Icon type={Icons.Ionicons} name={v.icon} size={ms(14)} color={v.color} />
                        <Text style={styles.vitalValue}>{v.value}</Text>
                        <Text style={styles.vitalUnit}>{v.unit}</Text>
                        <Text style={styles.vitalLabel}>{v.label}</Text>
                    </View>
                ))}
            </View>

            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
                <TouchableOpacity style={[styles.modeBtn, mode === 'free' && styles.modeBtnActive]} onPress={() => setMode('free')}>
                    <Text style={[styles.modeBtnText, mode === 'free' && styles.modeBtnTextActive]}>Free Text</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modeBtn, mode === 'soap' && styles.modeBtnActive]} onPress={() => setMode('soap')}>
                    <Text style={[styles.modeBtnText, mode === 'soap' && styles.modeBtnTextActive]}>SOAP Format</Text>
                </TouchableOpacity>
            </View>

            {/* Templates */}
            <Text style={styles.sectionLabel}>Templates</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                {SOAP_TEMPLATES.map(tmpl => (
                    <TouchableOpacity key={tmpl.id} style={[styles.templateChip, selectedTemplate === tmpl.id && styles.templateChipActive]} onPress={() => applyTemplate(tmpl)}>
                        <Text style={[styles.templateChipText, selectedTemplate === tmpl.id && styles.templateChipTextActive]}>{tmpl.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {mode === 'free' ? (
                <View style={styles.textAreaWrap}>
                    <TextInput style={styles.textArea} multiline numberOfLines={8} placeholder="Write consultation notes here..." placeholderTextColor="#AAAAAA" value={freeText} onChangeText={setFreeText} textAlignVertical="top" />
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
                            <TextInput style={styles.soapInput} multiline numberOfLines={3} placeholder={field.placeholder} placeholderTextColor="#AAAAAA" value={soap[field.key]} onChangeText={val => setSoap(prev => ({ ...prev, [field.key]: val }))} textAlignVertical="top" />
                        </View>
                    ))}
                </View>
            )}

            {/* Note Tags */}
            <Text style={styles.sectionLabel}>Note Tags</Text>
            <View style={styles.tagsWrap}>
                {NOTE_TAGS.map(tag => (
                    <TouchableOpacity key={tag} style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]} onPress={() => toggleTag(tag)}>
                        <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                <Icon type={Icons.Ionicons} name="save-outline" size={ms(16)} color={whiteColor} />
                <Text style={styles.actionBtnText}>Save Note</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// ── BodyDiagramTab ────────────────────────────────────────────────────────────

const BodyDiagramTab = () => {
    const [activeSpecialty, setActiveSpecialty] = useState('general');
    const [view, setView]                       = useState('front');
    const [annotations, setAnnotations]         = useState([]);
    const [expandedAnnotation, setExpandedAnnotation] = useState(null);
    const [annotNotes, setAnnotNotes]           = useState({});
    const [annotSeverity, setAnnotSeverity]     = useState({});
    const [checklist, setChecklist]             = useState({});
    const [additionalFindings, setAdditionalFindings] = useState('');

    const regions = view === 'front' ? BODY_FRONT_REGIONS : BODY_BACK_REGIONS;

    const annotationForRegion = (regionId) => annotations.find(a => a.regionId === regionId);

    const tapRegion = (region) => {
        const existing = annotationForRegion(region.id);
        if (existing) {
            setExpandedAnnotation(expandedAnnotation === existing.id ? null : existing.id);
        } else {
            const newAnnot = {
                id: Date.now().toString(),
                regionId: region.id,
                regionLabel: region.label,
                pinNumber: annotations.length + 1,
            };
            setAnnotations(prev => [...prev, newAnnot]);
            setExpandedAnnotation(newAnnot.id);
        }
    };

    const removeAnnotation = (annotId) => {
        setAnnotations(prev => {
            const filtered = prev.filter(a => a.id !== annotId);
            return filtered.map((a, i) => ({ ...a, pinNumber: i + 1 }));
        });
        setAnnotNotes(prev => { const n = { ...prev }; delete n[annotId]; return n; });
        setAnnotSeverity(prev => { const n = { ...prev }; delete n[annotId]; return n; });
        if (expandedAnnotation === annotId) setExpandedAnnotation(null);
    };

    const toggleCheck = (item) => setChecklist(prev => ({ ...prev, [item]: !prev[item] }));

    const checklistItems = SPECIALTY_CHECKLISTS[activeSpecialty] || [];

    const getSeverityColor = (sev) => {
        if (sev === 'Urgent') return '#EF4444';
        if (sev === 'Concern') return '#F59E0B';
        if (sev === 'Normal') return '#10B981';
        return primaryColor;
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>

            {/* ── Specialty Selector ── */}
            <Text style={styles.sectionLabel}>Specialty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: vs(12) }}>
                <View style={{ flexDirection: 'row', gap: ms(8), paddingRight: ms(16) }}>
                    {BODY_SPECIALTIES.map(sp => {
                        const active = activeSpecialty === sp.id;
                        return (
                            <TouchableOpacity
                                key={sp.id}
                                style={[styles.bodySpecChip, active && styles.bodySpecChipActive]}
                                onPress={() => setActiveSpecialty(sp.id)}
                                activeOpacity={0.7}
                            >
                                <Icon type={Icons.Ionicons} name={sp.icon} size={ms(13)} color={active ? whiteColor : '#555'} />
                                <Text style={[styles.bodySpecText, active && styles.bodySpecTextActive]}>{sp.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* ── Front / Back Toggle ── */}
            <View style={styles.modeToggle}>
                <TouchableOpacity style={[styles.modeBtn, view === 'front' && styles.modeBtnActive]} onPress={() => setView('front')}>
                    <Text style={[styles.modeBtnText, view === 'front' && styles.modeBtnTextActive]}>Front View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modeBtn, view === 'back' && styles.modeBtnActive]} onPress={() => setView('back')}>
                    <Text style={[styles.modeBtnText, view === 'back' && styles.modeBtnTextActive]}>Back View</Text>
                </TouchableOpacity>
            </View>

            {/* ── Body Region Grid ── */}
            <Text style={styles.sectionLabel}>Select Region to Annotate</Text>
            <Text style={styles.infoHint}>Tap a region to add an annotation pin</Text>
            <View style={styles.bodyRegionGrid}>
                {regions.map(region => {
                    const annot = annotationForRegion(region.id);
                    const hasPin = !!annot;
                    return (
                        <TouchableOpacity
                            key={region.id}
                            style={[styles.bodyRegionBtn, hasPin && styles.bodyRegionBtnPinned]}
                            onPress={() => tapRegion(region)}
                            activeOpacity={0.75}
                        >
                            {hasPin && (
                                <View style={styles.bodyPinBadge}>
                                    <Text style={styles.bodyPinText}>{annot.pinNumber}</Text>
                                </View>
                            )}
                            <Text style={[styles.bodyRegionBtnText, hasPin && styles.bodyRegionBtnTextPinned]} numberOfLines={1}>
                                {region.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── Annotations List ── */}
            {annotations.length > 0 && (
                <>
                    <Text style={styles.sectionLabel}>Annotations ({annotations.length})</Text>
                    {annotations.map(annot => {
                        const isExpanded = expandedAnnotation === annot.id;
                        const severity   = annotSeverity[annot.id] || '';
                        const note       = annotNotes[annot.id] || '';
                        const sevColor   = getSeverityColor(severity);
                        return (
                            <View key={annot.id} style={styles.bodyAnnotCard}>
                                <TouchableOpacity
                                    style={styles.bodyAnnotHeader}
                                    onPress={() => setExpandedAnnotation(isExpanded ? null : annot.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.bodyAnnotNumCircle}>
                                        <Text style={styles.bodyAnnotNum}>{annot.pinNumber}</Text>
                                    </View>
                                    <View style={{ flex: 1, gap: vs(2) }}>
                                        <Text style={styles.bodyAnnotRegion}>{annot.regionLabel}</Text>
                                        {!!severity && (
                                            <View style={[styles.bodyAnnotSevBadge, { backgroundColor: sevColor + '20' }]}>
                                                <Text style={[styles.bodyAnnotSevBadgeText, { color: sevColor }]}>{severity}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Icon type={Icons.Ionicons} name={isExpanded ? 'chevron-up' : 'chevron-down'} size={ms(16)} color="#888" />
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.bodyAnnotForm}>
                                        {/* Severity chips */}
                                        <Text style={styles.bodyAnnotFormLabel}>Severity</Text>
                                        <View style={styles.bodyAnnotSevRow}>
                                            {SEVERITY_OPTIONS.map(sev => {
                                                const active = severity === sev;
                                                const col    = getSeverityColor(sev);
                                                return (
                                                    <TouchableOpacity
                                                        key={sev}
                                                        style={[styles.bodyAnnotSevChip, active && { backgroundColor: col, borderColor: col }]}
                                                        onPress={() => setAnnotSeverity(prev => ({ ...prev, [annot.id]: sev }))}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Text style={[styles.bodyAnnotSevText, active && { color: whiteColor }]}>{sev}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>

                                        {/* Notes textarea */}
                                        <Text style={[styles.bodyAnnotFormLabel, { marginTop: vs(10) }]}>Notes</Text>
                                        <TextInput
                                            style={styles.bodyAnnotTextArea}
                                            placeholder="Describe the finding for this region..."
                                            placeholderTextColor="#AAAAAA"
                                            multiline
                                            numberOfLines={3}
                                            value={note}
                                            onChangeText={val => setAnnotNotes(prev => ({ ...prev, [annot.id]: val }))}
                                            textAlignVertical="top"
                                        />

                                        {/* Save / Remove */}
                                        <View style={styles.bodyAnnotActions}>
                                            <TouchableOpacity style={styles.bodyAnnotRemoveBtn} onPress={() => removeAnnotation(annot.id)}>
                                                <Icon type={Icons.Ionicons} name="trash-outline" size={ms(14)} color="#EF4444" />
                                                <Text style={styles.bodyAnnotRemoveText}>Remove</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.bodyAnnotSaveBtn}>
                                                <Icon type={Icons.Ionicons} name="checkmark-outline" size={ms(14)} color={whiteColor} />
                                                <Text style={styles.bodyAnnotSaveText}>Save</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </>
            )}

            {/* ── Specialty Examination Checklist ── */}
            <View style={styles.bodyChecklistCard}>
                <View style={styles.bodyChecklistHeader}>
                    <Icon type={Icons.Ionicons} name="clipboard-outline" size={ms(16)} color={primaryColor} />
                    <Text style={styles.bodyChecklistTitle}>
                        {BODY_SPECIALTIES.find(s => s.id === activeSpecialty)?.label} Examination Checklist
                    </Text>
                </View>
                {checklistItems.map(item => {
                    const checked = !!checklist[item];
                    return (
                        <TouchableOpacity
                            key={item}
                            style={styles.bodyCheckItem}
                            onPress={() => toggleCheck(item)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.bodyCheckBox, checked && styles.bodyCheckBoxActive]}>
                                {checked && <Icon type={Icons.Ionicons} name="checkmark" size={ms(12)} color={whiteColor} />}
                            </View>
                            <Text style={[styles.bodyCheckText, checked && styles.bodyCheckTextChecked]}>{item}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── Additional Findings ── */}
            <Text style={styles.sectionLabel}>Additional Findings</Text>
            <View style={styles.textAreaWrap}>
                <TextInput
                    style={[styles.textArea, { minHeight: vs(80) }]}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter any additional clinical findings..."
                    placeholderTextColor="#AAAAAA"
                    value={additionalFindings}
                    onChangeText={setAdditionalFindings}
                    textAlignVertical="top"
                />
            </View>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                <Icon type={Icons.Ionicons} name="save-outline" size={ms(16)} color={whiteColor} />
                <Text style={styles.actionBtnText}>Save Diagram Notes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// ── DentalChartTab ────────────────────────────────────────────────────────────

const DentalChartTab = () => {
    const [teeth, setTeeth]                 = useState(initialTeethState());
    const [toothNotes, setToothNotes]       = useState({});
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [activeCondition, setActiveCondition] = useState('cavity');
    const [pendingCondition, setPendingCondition] = useState(null);
    const [pendingNote, setPendingNote]     = useState('');
    const [oralHygiene, setOralHygiene]     = useState('');
    const [plaqueCalculus, setPlaqueCalculus] = useState('');
    const [gumHealth, setGumHealth]         = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');

    const getCond = (num) => DENTAL_CONDITIONS.find(c => c.id === teeth[num]) || DENTAL_CONDITIONS[0];

    const tapTooth = (num) => {
        if (selectedTooth === num) {
            setSelectedTooth(null);
            setPendingCondition(null);
            setPendingNote('');
        } else {
            setSelectedTooth(num);
            setPendingCondition(teeth[num]);
            setPendingNote(toothNotes[num] || '');
        }
    };

    const saveToothDetail = () => {
        if (!selectedTooth) return;
        setTeeth(prev => ({ ...prev, [selectedTooth]: pendingCondition || prev[selectedTooth] }));
        setToothNotes(prev => ({ ...prev, [selectedTooth]: pendingNote }));
        setSelectedTooth(null);
        setPendingCondition(null);
        setPendingNote('');
    };

    const resetToothToHealthy = () => {
        if (!selectedTooth) return;
        setTeeth(prev => ({ ...prev, [selectedTooth]: 'healthy' }));
        setToothNotes(prev => { const n = { ...prev }; delete n[selectedTooth]; return n; });
        setSelectedTooth(null);
        setPendingCondition(null);
        setPendingNote('');
    };

    const applyActiveCondition = (num) => {
        setTeeth(prev => ({ ...prev, [num]: activeCondition }));
        tapTooth(num);
    };

    const affectedTeeth = Object.entries(teeth)
        .filter(([, cid]) => cid !== 'healthy')
        .map(([num, cid]) => ({ num: parseInt(num, 10), cond: DENTAL_CONDITIONS.find(c => c.id === cid) }));

    const mouthSummaryText = () => {
        if (affectedTeeth.length === 0) return 'All teeth are healthy. No conditions recorded.';
        const groups = {};
        affectedTeeth.forEach(({ cond }) => {
            if (!groups[cond.label]) groups[cond.label] = 0;
            groups[cond.label]++;
        });
        return Object.entries(groups).map(([label, count]) => `${count} ${label}`).join(', ') + '.';
    };

    const renderToothCell = (num) => {
        const cond = getCond(num);
        const isSelected = selectedTooth === num;
        return (
            <TouchableOpacity
                key={num}
                style={[
                    styles.toothCell,
                    { backgroundColor: cond.fill, borderColor: cond.stroke },
                    isSelected && styles.toothCellSelected,
                ]}
                onPress={() => applyActiveCondition(num)}
                onLongPress={() => tapTooth(num)}
                activeOpacity={0.7}
            >
                <Text style={[styles.toothNum, { color: cond.color }]}>{num}</Text>
                {cond.abbr ? <Text style={[styles.toothCondAbbr, { color: cond.color }]}>{cond.abbr}</Text> : null}
                {toothNotes[num] ? <View style={[styles.toothNoteDot, { backgroundColor: cond.color }]} /> : null}
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>

            {/* ── Legend ── */}
            <Text style={styles.sectionLabel}>Condition Legend</Text>
            <View style={styles.dentalLegend}>
                {DENTAL_CONDITIONS.map(c => (
                    <View key={c.id} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                        <Text style={styles.legendText}>{c.label}</Text>
                    </View>
                ))}
            </View>

            {/* ── Condition Selector Grid (4×2) ── */}
            <Text style={styles.sectionLabel}>Select Condition to Apply</Text>
            <View style={styles.dentalCondGrid}>
                {DENTAL_CONDITIONS.map(c => {
                    const active = activeCondition === c.id;
                    return (
                        <TouchableOpacity
                            key={c.id}
                            style={[styles.dentalCondBtn, active && { backgroundColor: c.fill, borderColor: c.stroke, borderWidth: 2 }]}
                            onPress={() => setActiveCondition(c.id)}
                            activeOpacity={0.75}
                        >
                            <View style={[styles.dentalCondDot, { backgroundColor: c.color }]} />
                            <Text style={[styles.dentalCondBtnText, active && { color: c.color, fontFamily: interMedium }]} numberOfLines={1}>{c.label}</Text>
                            {active && <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(14)} color={c.color} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── Dental Chart ── */}
            <View style={styles.dentalChartCard}>
                <Text style={styles.infoHint}>Tap tooth to apply condition · Long-press to view detail</Text>

                {/* MAXILLARY / UPPER */}
                <Text style={styles.jawLabel}>MAXILLARY</Text>
                <View style={styles.dentalQuadrantRow}>
                    <Text style={styles.dentalQuadrantLabel}>UPPER RIGHT{'\n'}18 – 11</Text>
                    <Text style={styles.dentalQuadrantLabel}>UPPER LEFT{'\n'}21 – 28</Text>
                </View>
                <View style={styles.jawSection}>
                    {UPPER_TEETH.map((row, ri) => (
                        <View key={ri} style={styles.teethRow}>
                            {row.map(num => renderToothCell(num))}
                        </View>
                    ))}
                </View>

                {/* Midline */}
                <View style={styles.jawDivider}>
                    <Text style={styles.jawDividerText}>─── Midline ───</Text>
                </View>

                {/* MANDIBULAR / LOWER */}
                <View style={styles.jawSection}>
                    {LOWER_TEETH.map((row, ri) => (
                        <View key={ri} style={styles.teethRow}>
                            {row.map(num => renderToothCell(num))}
                        </View>
                    ))}
                </View>
                <View style={styles.dentalQuadrantRow}>
                    <Text style={styles.dentalQuadrantLabel}>LOWER RIGHT{'\n'}48 – 41</Text>
                    <Text style={styles.dentalQuadrantLabel}>LOWER LEFT{'\n'}31 – 38</Text>
                </View>
                <Text style={styles.jawLabel}>MANDIBULAR</Text>

                {/* Mouth Summary */}
                <View style={styles.dentalSummaryBlock}>
                    <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(16)} color={primaryColor} />
                    <Text style={styles.dentalSummaryText}>{mouthSummaryText()}</Text>
                </View>
            </View>

            {/* ── Selected Tooth Detail ── */}
            {selectedTooth && (() => {
                const selCond = DENTAL_CONDITIONS.find(c => c.id === (pendingCondition || teeth[selectedTooth])) || DENTAL_CONDITIONS[0];
                return (
                    <View style={styles.dentalDetailCard}>
                        <View style={styles.dentalDetailHeader}>
                            <Icon type={Icons.Ionicons} name="tooth-outline" size={ms(18)} color={primaryColor} />
                            <Text style={styles.dentalDetailTitle}>Tooth {selectedTooth} Detail</Text>
                        </View>

                        {/* Condition indicator */}
                        <View style={styles.dentalToothIndicatorRow}>
                            <View style={[styles.dentalToothBadge, { backgroundColor: selCond.fill, borderColor: selCond.stroke }]}>
                                <Text style={[styles.dentalToothBadgeText, { color: selCond.color }]}>{selCond.abbr || '✓'}</Text>
                            </View>
                            <Text style={styles.dentalDetailCondLabel}>{selCond.label}</Text>
                        </View>

                        {/* Condition chips */}
                        <Text style={[styles.sectionLabel, { marginTop: vs(8) }]}>Change Condition</Text>
                        <View style={styles.dentalCondChipRow}>
                            {DENTAL_CONDITIONS.map(c => {
                                const active = (pendingCondition || teeth[selectedTooth]) === c.id;
                                return (
                                    <TouchableOpacity
                                        key={c.id}
                                        style={[styles.dentalCondChip, active && { backgroundColor: c.color }]}
                                        onPress={() => setPendingCondition(c.id)}
                                        activeOpacity={0.75}
                                    >
                                        <Text style={[styles.dentalCondChipText, active && { color: whiteColor }]}>{c.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Clinical Notes */}
                        <Text style={[styles.sectionLabel, { marginTop: vs(8) }]}>Clinical Notes</Text>
                        <View style={styles.textAreaWrap}>
                            <TextInput
                                style={[styles.textArea, { minHeight: vs(60) }]}
                                multiline
                                placeholder="Add clinical note for this tooth..."
                                placeholderTextColor="#AAAAAA"
                                value={pendingNote}
                                onChangeText={setPendingNote}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Actions */}
                        <View style={styles.dentalToothActions}>
                            <TouchableOpacity style={styles.dentalResetBtn} onPress={resetToothToHealthy} activeOpacity={0.8}>
                                <Text style={styles.dentalResetBtnText}>Reset to Healthy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dentalSaveToothBtn} onPress={saveToothDetail} activeOpacity={0.85}>
                                <Icon type={Icons.Ionicons} name="checkmark" size={ms(16)} color={whiteColor} />
                                <Text style={styles.dentalSaveToothBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })()}

            {/* ── Tooth Conditions Summary ── */}
            <Text style={styles.sectionLabel}>Tooth Conditions Summary</Text>
            <View style={styles.dentalDetailCard}>
                <View style={styles.dentalDetailHeader}>
                    <View style={styles.dentalAffectedBadge}>
                        <Text style={styles.dentalAffectedBadgeText}>{affectedTeeth.length}</Text>
                    </View>
                    <Text style={styles.dentalDetailTitle}>Affected Teeth</Text>
                </View>
                {affectedTeeth.length === 0 ? (
                    <View style={styles.dentalEmptyState}>
                        <Icon type={Icons.Ionicons} name="checkmark-circle-outline" size={ms(32)} color="#10B981" />
                        <Text style={styles.dentalEmptyText}>All teeth healthy</Text>
                    </View>
                ) : (
                    affectedTeeth.map(({ num, cond }) => (
                        <View key={num} style={styles.dentalAffectedItem}>
                            <View style={[styles.dentalAffectedNumBadge, { backgroundColor: cond.fill, borderColor: cond.stroke }]}>
                                <Text style={[styles.dentalAffectedNumText, { color: cond.color }]}>{num}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.dentalAffectedCondLabel}>{cond.label}</Text>
                                {toothNotes[num] ? <Text style={styles.dentalAffectedNote} numberOfLines={1}>{toothNotes[num]}</Text> : null}
                            </View>
                            <TouchableOpacity onPress={() => { setTeeth(prev => ({ ...prev, [num]: 'healthy' })); setToothNotes(prev => { const n = { ...prev }; delete n[num]; return n; }); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <Icon type={Icons.Ionicons} name="close-circle-outline" size={ms(18)} color="#AAAAAA" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            {/* ── Dental Note ── */}
            <Text style={styles.sectionLabel}>Dental Note</Text>
            <View style={styles.dentalDetailCard}>
                <Text style={styles.dentalNoteDropLabel}>Oral Hygiene Assessment</Text>
                <DropdownSelect label="Oral Hygiene" options={['Good', 'Fair', 'Poor']} value={oralHygiene} onSelect={setOralHygiene} />

                <Text style={styles.dentalNoteDropLabel}>Plaque / Calculus</Text>
                <DropdownSelect label="Plaque/Calculus" options={['None', 'Mild', 'Moderate', 'Heavy']} value={plaqueCalculus} onSelect={setPlaqueCalculus} />

                <Text style={styles.dentalNoteDropLabel}>Gum Health</Text>
                <DropdownSelect label="Gum Health" options={['Healthy', 'Gingivitis', 'Periodontitis', 'Recession']} value={gumHealth} onSelect={setGumHealth} />

                <Text style={[styles.dentalNoteDropLabel, { marginTop: vs(6) }]}>Clinical Notes</Text>
                <View style={styles.textAreaWrapBordered}>
                    <TextInput
                        style={[styles.textArea, { minHeight: vs(70) }]}
                        multiline
                        placeholder="Overall dental assessment, recommendations, treatment plan..."
                        placeholderTextColor="#AAAAAA"
                        value={clinicalNotes}
                        onChangeText={setClinicalNotes}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                    <Icon type={Icons.Ionicons} name="save-outline" size={ms(16)} color={whiteColor} />
                    <Text style={styles.actionBtnText}>Save Dental Chart</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

// ── VaccinationTab ────────────────────────────────────────────────────────────

const VaccinationTab = () => {
    const [groups, setGroups] = useState(() =>
        VACCINATION_GROUPS.map(g => ({ ...g, vaccines: g.vaccines.map(v => ({ ...v })) }))
    );
    const [expandedId, setExpandedId] = useState(null);
    const [formData, setFormData] = useState({});
    const [customName, setCustomName] = useState('');
    const [customDate, setCustomDate] = useState('');
    const [customRoute, setCustomRoute] = useState('');
    const [customBrand, setCustomBrand] = useState('');
    const [customLot, setCustomLot] = useState('');
    const [customDose, setCustomDose] = useState('');
    const [customNotes, setCustomNotes] = useState('');

    const allVaccines = groups.flatMap(g => g.vaccines);
    const total = allVaccines.length;
    const given = allVaccines.filter(v => v.given).length;
    const pct = total > 0 ? Math.round((given / total) * 100) : 0;

    const toggleExpand = (vac) => {
        if (expandedId === vac.id) {
            setExpandedId(null);
        } else {
            setExpandedId(vac.id);
            setFormData(prev => ({
                ...prev,
                [vac.id]: { name: vac.name || '', route: vac.route || '', brand: '', dose: '', date: vac.date || '', lot: vac.lot || '', notes: vac.notes || '' },
            }));
        }
    };

    const updateFormField = (id, field, value) => {
        setFormData(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
    };

    const markVaccine = (id, isGiven) => {
        const fd = formData[id] || {};
        setGroups(prev => prev.map(g => ({
            ...g,
            vaccines: g.vaccines.map(v =>
                v.id === id ? { ...v, given: isGiven, name: fd.name || v.name, route: fd.route || v.route, date: fd.date || v.date, lot: fd.lot || v.lot, notes: fd.notes || v.notes } : v
            ),
        })));
        setExpandedId(null);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.tabContent, { paddingBottom: vs(30) }]}>

            {/* ── Header Card ── */}
            <View style={styles.vaccHeaderCard}>
                <View style={styles.vaccHeaderRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccHeaderTitle}>IAP Immunisation Schedule 2023</Text>
                        <Text style={styles.vaccHeaderSub}>{pct}% coverage · {given}/{total} vaccines given</Text>
                    </View>
                    <TouchableOpacity style={styles.vaccPrintBtn} activeOpacity={0.8}>
                        <Icon type={Icons.Ionicons} name="print-outline" size={ms(15)} color={primaryColor} />
                        <Text style={styles.vaccPrintText}>Print Card</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.vaccProgressBar}>
                    <View style={[styles.vaccProgressFill, { width: `${pct}%` }]} />
                </View>
                <View style={styles.vaccLegendRow}>
                    <View style={[styles.vaccBadge, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}>
                        <View style={[styles.vaccBadgeDot, { backgroundColor: '#10B981' }]} />
                        <Text style={[styles.vaccBadgeText, { color: '#10B981' }]}>Given {given}</Text>
                    </View>
                    <View style={[styles.vaccBadge, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
                        <View style={[styles.vaccBadgeDot, { backgroundColor: '#F97316' }]} />
                        <Text style={[styles.vaccBadgeText, { color: '#F97316' }]}>Pending {total - given}</Text>
                    </View>
                </View>
            </View>

            {/* ── Vaccine Groups ── */}
            {groups.map((grp) => (
                <View key={grp.group}>
                    <View style={styles.vaccGrpRow}>
                        <View style={styles.vaccGrpLine} />
                        <Text style={styles.vaccGrpLabel}>{grp.group}</Text>
                        <View style={styles.vaccGrpLine} />
                    </View>

                    {grp.vaccines.map((vac) => {
                        const isExpanded = expandedId === vac.id;
                        const fd = formData[vac.id] || {};
                        return (
                            <View key={vac.id} style={[styles.vaccRowCard, vac.given && styles.vaccRowCardGiven, isExpanded && styles.vaccRowCardActive]}>
                                <TouchableOpacity style={styles.vaccRowMain} onPress={() => toggleExpand(vac)} activeOpacity={0.8}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.vaccNameRow}>
                                            <Text style={styles.vaccName}>{vac.name}</Text>
                                            {vac.mandatory && (
                                                <View style={styles.vaccNipBadge}>
                                                    <Text style={styles.vaccNipText}>NIP</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.vaccDesc} numberOfLines={isExpanded ? undefined : 1}>{vac.desc}</Text>
                                        <View style={styles.vaccTagRow}>
                                            <View style={styles.vaccRouteBadge}>
                                                <Text style={styles.vaccRouteText}>{vac.route}</Text>
                                            </View>
                                            {vac.date ? <Text style={styles.vaccDateText}>{vac.date}</Text> : null}
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', gap: vs(4) }}>
                                        <View style={[styles.vaccStatusBadge, vac.given ? styles.vaccStatusGiven : styles.vaccStatusPending]}>
                                            <Text style={[styles.vaccStatusText, { color: vac.given ? '#10B981' : '#F97316' }]}>
                                                {vac.given ? 'Given' : 'Pending'}
                                            </Text>
                                        </View>
                                        <Icon type={Icons.Ionicons} name={isExpanded ? 'chevron-up' : 'chevron-down'} size={ms(14)} color="#999" />
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.vaccAccordion}>
                                        <View style={styles.vaccAccordionDivider} />
                                        {/* Row 1: Vaccine Name + Route */}
                                        <View style={styles.vaccFormRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.vaccFormLabel}>Vaccine Name</Text>
                                                <TextInput
                                                    style={styles.vaccFormInput}
                                                    placeholder="Vaccine name"
                                                    placeholderTextColor="#AAA"
                                                    value={fd.name || ''}
                                                    onChangeText={v => updateFormField(vac.id, 'name', v)}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.vaccFormLabel}>Route / Site</Text>
                                                <TextInput
                                                    style={styles.vaccFormInput}
                                                    placeholder="e.g. IM, SC, Oral"
                                                    placeholderTextColor="#AAA"
                                                    value={fd.route || ''}
                                                    onChangeText={v => updateFormField(vac.id, 'route', v)}
                                                />
                                            </View>
                                        </View>
                                        {/* Row 2: Brand + Dose */}
                                        <View style={styles.vaccFormRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.vaccFormLabel}>Brand</Text>
                                                <TextInput
                                                    style={styles.vaccFormInput}
                                                    placeholder="Brand name"
                                                    placeholderTextColor="#AAA"
                                                    value={fd.brand || ''}
                                                    onChangeText={v => updateFormField(vac.id, 'brand', v)}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.vaccFormLabel}>Dose #</Text>
                                                <TextInput
                                                    style={styles.vaccFormInput}
                                                    placeholder="1, 2, 3..."
                                                    placeholderTextColor="#AAA"
                                                    value={fd.dose || ''}
                                                    onChangeText={v => updateFormField(vac.id, 'dose', v)}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                        {/* Row 3: Date Given + Lot Number */}
                                        <View style={styles.vaccFormRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.vaccFormLabel}>Date Given</Text>
                                                <TextInput
                                                    style={styles.vaccFormInput}
                                                    placeholder="DD/MM/YYYY"
                                                    placeholderTextColor="#AAA"
                                                    value={fd.date || ''}
                                                    onChangeText={v => updateFormField(vac.id, 'date', v)}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.vaccFormLabel}>Lot Number</Text>
                                                <TextInput
                                                    style={styles.vaccFormInput}
                                                    placeholder="e.g. BCG2401"
                                                    placeholderTextColor="#AAA"
                                                    value={fd.lot || ''}
                                                    onChangeText={v => updateFormField(vac.id, 'lot', v)}
                                                />
                                            </View>
                                        </View>
                                        <Text style={styles.vaccFormLabel}>Notes</Text>
                                        <TextInput
                                            style={[styles.vaccFormInput, { height: vs(50), textAlignVertical: 'top', marginBottom: vs(10) }]}
                                            placeholder="Optional notes..."
                                            placeholderTextColor="#AAA"
                                            multiline
                                            value={fd.notes || ''}
                                            onChangeText={v => updateFormField(vac.id, 'notes', v)}
                                        />
                                        <View style={styles.vaccAccordionBtns}>
                                            {vac.given ? (
                                                <TouchableOpacity style={styles.vaccPendingBtn} onPress={() => markVaccine(vac.id, false)} activeOpacity={0.8}>
                                                    <Icon type={Icons.Ionicons} name="time-outline" size={ms(14)} color="#F97316" />
                                                    <Text style={styles.vaccPendingBtnText}>Mark as Pending</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity style={styles.vaccGivenBtn} onPress={() => markVaccine(vac.id, true)} activeOpacity={0.8}>
                                                    <Icon type={Icons.Ionicons} name="checkmark-circle-outline" size={ms(14)} color={whiteColor} />
                                                    <Text style={styles.vaccGivenBtnText}>Mark as Given</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            ))}

            {/* ── Add Custom Vaccine ── */}
            <View style={styles.vaccCustomCard}>
                <View style={styles.vaccCustomHeader}>
                    <Icon type={Icons.Ionicons} name="add-circle-outline" size={ms(18)} color={primaryColor} />
                    <Text style={styles.vaccCustomTitle}>Add Custom Vaccine</Text>
                </View>
                <View style={styles.vaccFormRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccFormLabel}>Vaccine Name *</Text>
                        <TextInput style={styles.vaccFormInput} placeholder="e.g. Influenza" placeholderTextColor="#AAA" value={customName} onChangeText={setCustomName} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccFormLabel}>Date Given</Text>
                        <TextInput style={styles.vaccFormInput} placeholder="DD/MM/YYYY" placeholderTextColor="#AAA" value={customDate} onChangeText={setCustomDate} />
                    </View>
                </View>
                <View style={styles.vaccFormRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccFormLabel}>Route / Site</Text>
                        <TextInput style={styles.vaccFormInput} placeholder="e.g. IM, SC" placeholderTextColor="#AAA" value={customRoute} onChangeText={setCustomRoute} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccFormLabel}>Brand</Text>
                        <TextInput style={styles.vaccFormInput} placeholder="Brand name" placeholderTextColor="#AAA" value={customBrand} onChangeText={setCustomBrand} />
                    </View>
                </View>
                <View style={styles.vaccFormRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccFormLabel}>Lot Number</Text>
                        <TextInput style={styles.vaccFormInput} placeholder="Lot #" placeholderTextColor="#AAA" value={customLot} onChangeText={setCustomLot} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.vaccFormLabel}>Dose #</Text>
                        <TextInput style={styles.vaccFormInput} placeholder="1, 2, 3..." placeholderTextColor="#AAA" value={customDose} onChangeText={setCustomDose} keyboardType="numeric" />
                    </View>
                </View>
                <Text style={styles.vaccFormLabel}>Notes</Text>
                <TextInput
                    style={[styles.vaccFormInput, { height: vs(50), textAlignVertical: 'top', marginBottom: vs(12) }]}
                    placeholder="Optional notes..."
                    placeholderTextColor="#AAA"
                    multiline
                    value={customNotes}
                    onChangeText={setCustomNotes}
                />
                <TouchableOpacity style={styles.vaccAddCustomBtn} activeOpacity={0.85}>
                    <Icon type={Icons.Ionicons} name="add" size={ms(16)} color={whiteColor} />
                    <Text style={styles.vaccAddCustomBtnText}>Add to Record</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
};

// ── IAP 2015 Growth Data ──────────────────────────────────────────────────────

const IAP_AGES = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

const IAP_DATA = {
    boy: {
        weight: {
            P3:  [2.5,3.4,4.4,5.1,5.6,6.0,6.4,6.7,7.0,7.2,7.5,7.7,7.9,8.1,8.3,8.5,8.7,8.8,9.0,9.2,9.4,9.5,9.7,9.9,10.0],
            P10: [2.9,3.8,4.9,5.7,6.2,6.7,7.1,7.4,7.8,8.1,8.4,8.6,8.9,9.1,9.3,9.5,9.7,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3],
            P25: [3.2,4.2,5.3,6.2,6.7,7.3,7.7,8.1,8.5,8.8,9.1,9.4,9.6,9.9,10.1,10.3,10.6,10.8,11.0,11.2,11.5,11.7,11.9,12.1,12.3],
            P50: [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,9.0,9.3,9.6,9.9,10.1,10.4,10.6,10.9,11.1,11.4,11.6,11.9,12.1,12.4,12.6,12.9],
            P75: [3.5,4.8,5.9,6.8,7.4,7.9,8.4,8.8,9.2,9.6,9.9,10.2,10.5,10.8,11.1,11.3,11.6,11.9,12.1,12.4,12.7,13.0,13.3,13.5,13.8],
            P90: [3.7,5.1,6.3,7.1,7.8,8.4,8.9,9.3,9.7,10.1,10.5,10.8,11.1,11.4,11.7,12.0,12.3,12.6,12.9,13.2,13.5,13.8,14.1,14.4,14.7],
            P97: [3.9,5.3,6.6,7.6,8.2,8.8,9.4,9.8,10.3,10.7,11.1,11.4,11.8,12.1,12.4,12.7,13.1,13.4,13.7,14.0,14.4,14.7,15.0,15.3,15.7],
        },
        height: {
            P3:  [46.3,49.8,53.0,56.0,58.5,61.0,63.0,65.0,66.8,68.4,69.9,71.5,72.8,74.2,75.5,76.7,77.9,79.1,80.3,81.4,82.4,83.5,84.5,85.5,86.6],
            P10: [47.9,51.5,54.8,57.9,60.5,63.1,65.2,67.2,69.1,70.7,72.3,73.9,75.2,76.6,77.9,79.2,80.5,81.7,82.9,84.0,85.1,86.2,87.3,88.4,89.4],
            P25: [49.5,53.3,56.7,59.8,62.4,65.2,67.3,69.4,71.2,72.9,74.5,76.1,77.5,78.9,80.2,81.6,82.9,84.1,85.3,86.5,87.7,88.8,89.9,91.0,92.1],
            P50: [51.5,55.6,59.1,62.2,64.9,67.6,69.8,71.9,73.8,75.6,77.2,78.8,80.2,81.6,83.0,84.4,85.7,87.0,88.3,89.5,90.7,91.9,93.0,94.1,95.2],
            P75: [53.5,57.9,61.5,64.7,67.5,70.3,72.5,74.7,76.7,78.5,80.1,81.8,83.3,84.8,86.2,87.6,89.0,90.3,91.6,92.8,94.1,95.3,96.5,97.7,98.8],
            P90: [55.0,59.9,63.6,67.0,69.8,72.7,75.0,77.3,79.3,81.2,82.9,84.7,86.2,87.8,89.2,90.7,92.1,93.5,94.8,96.1,97.4,98.7,100.0,101.2,102.4],
            P97: [56.5,61.1,65.0,68.5,71.4,74.4,76.8,79.1,81.2,83.2,85.0,86.8,88.4,90.0,91.5,93.1,94.6,96.0,97.4,98.8,100.2,101.5,102.9,104.2,105.4],
        },
    },
    girl: {
        weight: {
            P3:  [2.4,3.2,4.1,4.8,5.3,5.7,6.0,6.3,6.5,6.8,7.0,7.2,7.4,7.6,7.8,8.0,8.1,8.3,8.5,8.7,8.8,9.0,9.2,9.4,9.5],
            P10: [2.7,3.6,4.6,5.3,5.8,6.3,6.6,6.9,7.2,7.5,7.8,8.0,8.2,8.4,8.6,8.8,9.0,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.7],
            P25: [3.0,4.0,5.0,5.7,6.3,6.8,7.2,7.5,7.8,8.1,8.4,8.7,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.6,10.8,11.1,11.3,11.5,11.8],
            P50: [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.8,9.0,9.3,9.6,9.8,10.1,10.3,10.6,10.9,11.1,11.4,11.6,11.9,12.2],
            P75: [3.4,4.5,5.5,6.2,6.8,7.3,7.7,8.1,8.4,8.7,9.1,9.4,9.7,10.0,10.3,10.6,10.9,11.2,11.5,11.8,12.1,12.4,12.7,13.0,13.3],
            P90: [3.6,4.7,5.8,6.6,7.2,7.8,8.2,8.6,9.0,9.4,9.7,10.1,10.4,10.7,11.1,11.4,11.7,12.0,12.3,12.7,13.0,13.4,13.7,14.0,14.4],
            P97: [3.8,5.0,6.1,7.0,7.6,8.2,8.7,9.2,9.6,10.0,10.4,10.8,11.1,11.5,11.8,12.2,12.5,12.9,13.2,13.6,14.0,14.3,14.7,15.1,15.5],
        },
        height: {
            P3:  [45.6,49.0,52.2,55.2,57.7,60.1,62.0,64.0,65.8,67.4,68.9,70.4,71.8,73.1,74.4,75.7,76.9,78.1,79.3,80.4,81.5,82.6,83.6,84.7,85.7],
            P10: [47.2,50.7,54.0,57.1,59.7,62.2,64.2,66.2,68.0,69.6,71.2,72.7,74.1,75.5,76.8,78.2,79.5,80.7,82.0,83.1,84.3,85.4,86.5,87.6,88.7],
            P25: [48.8,52.5,55.8,58.9,61.6,64.1,66.2,68.2,70.1,71.8,73.4,74.9,76.4,77.8,79.2,80.6,81.9,83.2,84.5,85.7,86.9,88.1,89.3,90.4,91.5],
            P50: [50.0,53.7,57.1,60.3,62.9,65.5,67.7,69.8,71.7,73.5,75.1,76.7,78.2,79.6,81.0,82.5,83.9,85.2,86.5,87.8,89.1,90.3,91.5,92.7,93.9],
            P75: [52.0,56.0,59.4,62.7,65.4,68.1,70.3,72.5,74.4,76.2,77.9,79.5,81.1,82.6,84.0,85.5,86.9,88.3,89.6,91.0,92.3,93.6,94.9,96.1,97.4],
            P90: [53.5,57.6,61.2,64.6,67.3,70.2,72.5,74.7,76.7,78.5,80.3,82.0,83.6,85.2,86.7,88.2,89.6,91.1,92.5,93.9,95.3,96.7,98.0,99.3,100.7],
            P97: [55.0,59.3,62.9,66.5,69.3,72.2,74.7,77.0,79.0,81.0,82.8,84.6,86.3,88.0,89.6,91.2,92.7,94.2,95.7,97.2,98.7,100.1,101.6,103.0,104.4],
        },
    },
};

const GROWTH_MILESTONES = {
    2:  ['Social smile appears', 'Follows moving objects', 'Vocalises — cooing sounds', 'Holds head at 45° prone'],
    4:  ['Laughs aloud', 'Head control complete', 'Rolls front to back', 'Babbles'],
    6:  ['Sits with support', 'Transfers objects hand to hand', 'Stranger anxiety begins'],
    9:  ['Sits independently', 'Pincer grasp developing', 'Mama/Dada non-specific'],
    12: ['Walks with one hand held', 'First words with meaning', 'Pincer grasp mature'],
    18: ['Walks independently', '10–20 words vocabulary', 'Feeds self with spoon'],
    24: ['Two-word phrases', 'Runs', 'Tower of 6 cubes', 'Knows body parts'],
    36: ['Three-word sentences', 'Rides tricycle', 'Toilet training complete', 'Counts to 10'],
    48: ['Full sentences', 'Skips and hops', 'Draws a person', 'Knows colours'],
    60: ['School ready', 'Full conversation', 'Draws shapes', 'Counts 10+ objects'],
};

// Chart layout constants (module-scope, computed once)
const GROWTH_SVG_W   = Math.floor(width - ms(60));
const GROWTH_SVG_H   = Math.floor(vs(250));
const G_PAD_L        = ms(36);
const G_PAD_B        = vs(26);
const G_PAD_T        = vs(10);
const G_PAD_R        = ms(6);
const G_INNER_W      = GROWTH_SVG_W - G_PAD_L - G_PAD_R;
const G_INNER_H      = GROWTH_SVG_H - G_PAD_T - G_PAD_B;

const PCTILE_LINE_STYLES = {
    P3:  { color: '#EF4444', dash: '5,3', w: '1' },
    P10: { color: '#F97316', dash: '4,2', w: '1' },
    P25: { color: '#EAB308', dash: '3,2', w: '1.2' },
    P50: { color: '#22C55E', dash: null,  w: '2.5' },
    P75: { color: '#EAB308', dash: '3,2', w: '1.2' },
    P90: { color: '#F97316', dash: '4,2', w: '1' },
    P97: { color: '#EF4444', dash: '5,3', w: '1' },
};

const calcGrowthPercentile = (val, age, dataset) => {
    const pNums = [3, 10, 25, 50, 75, 90, 97];
    const pKeys = ['P3', 'P10', 'P25', 'P50', 'P75', 'P90', 'P97'];
    const vals = pKeys.map(k => dataset[k][age]);
    if (val < vals[0]) return '<3';
    if (val > vals[vals.length - 1]) return '>97';
    for (let i = 0; i < vals.length - 1; i++) {
        if (val >= vals[i] && val <= vals[i + 1]) {
            const f = (val - vals[i]) / (vals[i + 1] - vals[i]);
            return Math.round(pNums[i] + (pNums[i + 1] - pNums[i]) * f);
        }
    }
    return null;
};

const getGrowthLabel = (pct) => {
    if (pct === null || pct === undefined) return '';
    if (pct === '<3') return 'Below 3rd percentile — investigate nutritional status';
    if (pct < 10) return 'Below average — monitor closely';
    if (pct < 25) return 'Low-normal — nutrition counselling advised';
    if (pct < 75) return 'Normal range — continue current care';
    if (pct < 90) return 'Above average — normal variant';
    if (pct < 97) return 'High — assess for overnutrition';
    return 'Above 97th percentile — obesity evaluation recommended';
};

const GrowthMilestoneItem = ({ label }) => {
    const [checked, setChecked] = useState(false);
    return (
        <TouchableOpacity style={styles.growthMilestoneItem} onPress={() => setChecked(c => !c)} activeOpacity={0.7}>
            <View style={[styles.bodyCheckBox, checked && styles.bodyCheckBoxActive]}>
                {checked && <Icon type={Icons.Ionicons} name="checkmark" size={ms(12)} color={whiteColor} />}
            </View>
            <Text style={[styles.bodyCheckText, checked && styles.bodyCheckTextChecked]}>{label}</Text>
        </TouchableOpacity>
    );
};

const GrowthChartSVG = ({ gender, chartType, measurements }) => {
    const dataset  = IAP_DATA[gender][chartType];
    const allVals  = Object.values(dataset).flat();
    const yStep    = chartType === 'weight' ? 2 : 10;
    const yMin     = Math.floor(Math.min(...allVals) / yStep) * yStep;
    const yMax     = Math.ceil(Math.max(...allVals) / yStep) * yStep;

    const toX = (age) => G_PAD_L + (age / 24) * G_INNER_W;
    const toY = (val) => G_PAD_T + G_INNER_H - ((val - yMin) / (yMax - yMin)) * G_INNER_H;

    const mkPath = (vals) =>
        IAP_AGES.map((age, i) => `${i === 0 ? 'M' : 'L'}${toX(age).toFixed(1)},${toY(vals[i]).toFixed(1)}`).join(' ');

    const xGridAges  = [0, 4, 8, 12, 16, 20, 24];
    const yGridVals  = [];
    for (let v = yMin; v <= yMax; v += yStep) yGridVals.push(v);

    const ptData = measurements
        .filter(m => m.age >= 0 && m.age <= 24)
        .map(m => ({ age: m.age, val: chartType === 'weight' ? m.weight : m.height }))
        .filter(p => p.val !== null && p.val !== undefined)
        .sort((a, b) => a.age - b.age);

    const ptLinePath = ptData.length > 1
        ? ptData.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.age).toFixed(1)},${toY(p.val).toFixed(1)}`).join(' ')
        : null;

    return (
        <Svg width={GROWTH_SVG_W} height={GROWTH_SVG_H}>
            {/* Background */}
            <SvgRect x={G_PAD_L} y={G_PAD_T} width={G_INNER_W} height={G_INNER_H} fill="#F8FAFC" rx={2} />

            {/* Horizontal grid + Y labels */}
            {yGridVals.map(v => (
                <SvgG key={`y${v}`}>
                    <SvgLine x1={G_PAD_L} y1={toY(v)} x2={G_PAD_L + G_INNER_W} y2={toY(v)} stroke="#E2E8F0" strokeWidth="0.8" />
                    <SvgText x={G_PAD_L - 3} y={toY(v) + 3} textAnchor="end" fontSize={ms(7)} fill="#94A3B8">{v}</SvgText>
                </SvgG>
            ))}

            {/* Vertical grid + X labels */}
            {xGridAges.map(age => (
                <SvgG key={`x${age}`}>
                    <SvgLine x1={toX(age)} y1={G_PAD_T} x2={toX(age)} y2={G_PAD_T + G_INNER_H} stroke="#E2E8F0" strokeWidth="0.8" />
                    <SvgText x={toX(age)} y={G_PAD_T + G_INNER_H + 14} textAnchor="middle" fontSize={ms(7)} fill="#94A3B8">{age}m</SvgText>
                </SvgG>
            ))}

            {/* Axes */}
            <SvgLine x1={G_PAD_L} y1={G_PAD_T} x2={G_PAD_L} y2={G_PAD_T + G_INNER_H} stroke="#CBD5E1" strokeWidth="1.5" />
            <SvgLine x1={G_PAD_L} y1={G_PAD_T + G_INNER_H} x2={G_PAD_L + G_INNER_W} y2={G_PAD_T + G_INNER_H} stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Percentile curves */}
            {Object.entries(dataset).map(([pct, vals]) => {
                const s = PCTILE_LINE_STYLES[pct];
                return (
                    <SvgPath
                        key={pct}
                        d={mkPath(vals)}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={s.w}
                        strokeDasharray={s.dash}
                        opacity={pct === 'P50' ? 1 : 0.65}
                    />
                );
            })}

            {/* Patient connecting line */}
            {ptLinePath && (
                <SvgPath d={ptLinePath} fill="none" stroke={primaryColor} strokeWidth="2.5" />
            )}

            {/* Patient dots */}
            {ptData.map((p, i) => (
                <SvgCircle key={i} cx={toX(p.age)} cy={toY(p.val)} r={ms(4)} fill={primaryColor} stroke="white" strokeWidth="2" />
            ))}
        </Svg>
    );
};

// ── GrowthChartTab ────────────────────────────────────────────────────────────

const GrowthChartTab = () => {
    const [gender, setGender]             = useState('boy');
    const [chartType, setChartType]       = useState('weight');
    const [ageMonths, setAgeMonths]       = useState('');
    const [weightInput, setWeightInput]   = useState('');
    const [heightInput, setHeightInput]   = useState('');
    const [measurements, setMeasurements] = useState([
        { date: '15 Jan 2026', age: 18, weight: 11.2, height: 82.5 },
        { date: '15 Sep 2025', age: 14, weight: 10.1, height: 78.0 },
    ]);
    const [lastPct, setLastPct]           = useState(null);
    const [growthPattern, setGrowthPattern] = useState('');
    const [growthNotes, setGrowthNotes]   = useState('');

    const addMeasurement = () => {
        const age = parseInt(ageMonths, 10);
        const wt  = parseFloat(weightInput);
        const ht  = parseFloat(heightInput);
        if (isNaN(age) || age < 0 || age > 24) return;
        const data = IAP_DATA[gender];
        const wPct = !isNaN(wt) ? calcGrowthPercentile(wt, age, data.weight) : null;
        const hPct = !isNaN(ht) ? calcGrowthPercentile(ht, age, data.height) : null;
        setLastPct({ w: wPct, h: hPct });
        setMeasurements(prev =>
            [...prev, {
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                age,
                weight: !isNaN(wt) ? wt : null,
                height: !isNaN(ht) ? ht : null,
            }].sort((a, b) => a.age - b.age),
        );
        setAgeMonths(''); setWeightInput(''); setHeightInput('');
    };

    const lastAge = measurements.length > 0 ? measurements[measurements.length - 1].age : null;
    const nearestMilestoneAge = lastAge !== null
        ? Object.keys(GROWTH_MILESTONES).map(Number).reduce((a, b) =>
            Math.abs(b - lastAge) < Math.abs(a - lastAge) ? b : a)
        : null;

    const displayPct = lastPct ? (chartType === 'weight' ? lastPct.w : lastPct.h) : null;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>

            {/* ── IAP Banner ── */}
            <View style={styles.growthInfoBanner}>
                <Icon type={Icons.Ionicons} name="information-circle-outline" size={ms(15)} color="#1E40AF" />
                <Text style={styles.growthInfoText}>
                    <Text style={{ fontFamily: interMedium }}>Indian Growth Standards (IAP 2015)</Text>
                    {' · Percentile curves for Indian children. Values between 3rd–97th percentile are within normal range.'}
                </Text>
            </View>

            {/* ── Controls ── */}
            <View style={styles.growthControlRow}>
                <View style={styles.segCtrl}>
                    {['boy', 'girl'].map(g => (
                        <TouchableOpacity key={g} style={[styles.segBtn, gender === g && styles.segBtnActive]} onPress={() => setGender(g)} activeOpacity={0.75}>
                            <Text style={[styles.segBtnText, gender === g && styles.segBtnTextActive]}>{g === 'boy' ? 'Boys' : 'Girls'}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={[styles.segCtrl, { flex: 1 }]}>
                    {[['weight', 'Weight-for-Age'], ['height', 'Height-for-Age']].map(([k, lbl]) => (
                        <TouchableOpacity key={k} style={[styles.segBtn, chartType === k && styles.segBtnActive]} onPress={() => setChartType(k)} activeOpacity={0.75}>
                            <Text style={[styles.segBtnText, chartType === k && styles.segBtnTextActive]}>{lbl}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* ── Measurement Input ── */}
            <View style={styles.growthMeasureCard}>
                <Text style={styles.growthMeasureTitle}>Add New Measurement</Text>
                <View style={styles.growthInputGrid}>
                    <View style={styles.growthInputCell}>
                        <Text style={styles.rxLabel}>Age (months)</Text>
                        <TextInput style={styles.growthInput} placeholder="e.g. 18" placeholderTextColor="#AAA" keyboardType="numeric" value={ageMonths} onChangeText={setAgeMonths} />
                    </View>
                    <View style={styles.growthInputCell}>
                        <Text style={styles.rxLabel}>Weight (kg)</Text>
                        <TextInput style={styles.growthInput} placeholder="e.g. 10.2" placeholderTextColor="#AAA" keyboardType="decimal-pad" value={weightInput} onChangeText={setWeightInput} />
                    </View>
                    <View style={styles.growthInputCell}>
                        <Text style={styles.rxLabel}>Height (cm)</Text>
                        <TextInput style={styles.growthInput} placeholder="e.g. 82.5" placeholderTextColor="#AAA" keyboardType="decimal-pad" value={heightInput} onChangeText={setHeightInput} />
                    </View>
                    <View style={[styles.growthInputCell, { justifyContent: 'flex-end' }]}>
                        <TouchableOpacity style={styles.growthPlotBtn} onPress={addMeasurement} activeOpacity={0.85}>
                            <Icon type={Icons.Ionicons} name="add" size={ms(16)} color={whiteColor} />
                            <Text style={styles.growthPlotBtnText}>Plot</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* ── Percentile Info Box ── */}
            {lastPct && displayPct !== null && (
                <View style={styles.pctileBox}>
                    <Text style={styles.pctileNum}>{typeof displayPct === 'number' ? `${displayPct}th` : displayPct}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.pctileTitle}>
                            {chartType === 'weight' ? 'Weight' : 'Height'} Percentile · IAP 2015 · {gender === 'boy' ? 'Boys' : 'Girls'}
                        </Text>
                        <Text style={styles.pctileDesc}>{getGrowthLabel(displayPct)}</Text>
                    </View>
                </View>
            )}

            {/* ── Growth Chart ── */}
            <View style={styles.growthChartCard}>
                <Text style={styles.growthChartTitle}>
                    {chartType === 'weight' ? 'Weight-for-Age' : 'Height-for-Age'} · {gender === 'boy' ? 'Boys' : 'Girls'} · IAP 2015
                </Text>
                <Text style={styles.growthChartSubtitle}>3rd · 10th · 25th · 50th · 75th · 90th · 97th percentile bands</Text>
                <GrowthChartSVG gender={gender} chartType={chartType} measurements={measurements} />
                <View style={styles.growthChartLegend}>
                    {[
                        { label: 'P3 / P97',     color: '#EF4444' },
                        { label: 'P10 / P90',    color: '#F97316' },
                        { label: 'P25 / P75',    color: '#EAB308' },
                        { label: 'P50 (Median)', color: '#22C55E' },
                        { label: 'Patient',      color: primaryColor },
                    ].map(({ label, color }) => (
                        <View key={label} style={styles.growthLegendItem}>
                            <View style={[styles.growthLegendDot, { backgroundColor: color }]} />
                            <Text style={styles.growthLegendText}>{label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* ── Measurement History ── */}
            <Text style={styles.sectionLabel}>Measurement History</Text>
            <View style={styles.dentalDetailCard}>
                {measurements.length === 0 ? (
                    <View style={styles.dentalEmptyState}>
                        <Icon type={Icons.Ionicons} name="analytics-outline" size={ms(32)} color="#CBD5E1" />
                        <Text style={styles.dentalEmptyText}>No measurements recorded yet</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.growthTableHeader}>
                            {['Date', 'Age', 'Weight', 'Height', ''].map((h, i) => (
                                <Text key={i} style={[styles.growthTableHeaderCell, h === '' && { width: ms(24), flex: 0 }]}>{h}</Text>
                            ))}
                        </View>
                        {measurements.map((m, i) => (
                            <View key={i} style={styles.growthTableRow}>
                                <Text style={styles.growthTableCell}>{m.date}</Text>
                                <Text style={styles.growthTableCell}>{m.age}mo</Text>
                                <Text style={[styles.growthTableCell, { fontFamily: interMedium }]}>{m.weight ? `${m.weight}kg` : '—'}</Text>
                                <Text style={[styles.growthTableCell, { fontFamily: interMedium }]}>{m.height ? `${m.height}cm` : '—'}</Text>
                                <TouchableOpacity onPress={() => setMeasurements(prev => prev.filter((_, j) => j !== i))} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <Icon type={Icons.Ionicons} name="close-circle-outline" size={ms(16)} color="#AAAAAA" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}
            </View>

            {/* ── Growth Assessment ── */}
            <Text style={styles.sectionLabel}>Growth Assessment</Text>
            <View style={styles.dentalDetailCard}>
                <Text style={styles.dentalNoteDropLabel}>Growth Pattern</Text>
                <DropdownSelect
                    label="Growth Pattern"
                    options={[
                        'Normal growth — following centile channel',
                        'Crossing centiles downward — investigate',
                        'Crossing centiles upward — reassure',
                        'Failure to thrive — urgent assessment',
                        'Obesity concern — dietitian referral',
                        'Short stature — growth hormone workup',
                    ]}
                    value={growthPattern}
                    onSelect={setGrowthPattern}
                />
                <Text style={[styles.dentalNoteDropLabel, { marginTop: vs(8) }]}>Clinical Notes</Text>
                <View style={styles.textAreaWrapBordered}>
                    <TextInput
                        style={[styles.textArea, { minHeight: vs(70) }]}
                        multiline
                        placeholder="Document growth assessment, parental heights, nutritional concerns, developmental milestones..."
                        placeholderTextColor="#AAAAAA"
                        value={growthNotes}
                        onChangeText={setGrowthNotes}
                        textAlignVertical="top"
                    />
                </View>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                    <Icon type={Icons.Ionicons} name="save-outline" size={ms(16)} color={whiteColor} />
                    <Text style={styles.actionBtnText}>Save Growth Note</Text>
                </TouchableOpacity>
            </View>

            {/* ── Developmental Milestones ── */}
            <Text style={styles.sectionLabel}>Developmental Milestones</Text>
            <View style={styles.dentalDetailCard}>
                {nearestMilestoneAge === null ? (
                    <Text style={[styles.dentalEmptyText, { textAlign: 'center', paddingVertical: vs(10) }]}>
                        Add measurements above to see relevant developmental milestones.
                    </Text>
                ) : (
                    <>
                        <Text style={styles.growthMilestonesCaption}>Expected at ~{nearestMilestoneAge} months:</Text>
                        {(GROWTH_MILESTONES[nearestMilestoneAge] || []).map((m, i) => (
                            <GrowthMilestoneItem key={i} label={m} />
                        ))}
                    </>
                )}
            </View>

        </ScrollView>
    );
};

// ── DropdownSelect ────────────────────────────────────────────────────────────

const DropdownSelect = ({ label, options, value, onSelect }) => {
    const [open, setOpen] = useState(false);
    return (
        <View style={{ marginBottom: vs(4) }}>
            <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setOpen(o => !o)}
                activeOpacity={0.7}
            >
                <Text style={[styles.dropdownBtnText, !value && { color: '#AAAAAA' }]}>
                    {value || `Select ${label}`}
                </Text>
                <Icon type={Icons.Ionicons} name={open ? 'chevron-up' : 'chevron-down'} size={ms(16)} color="#888" />
            </TouchableOpacity>
            {open && (
                <View style={styles.dropdownList}>
                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={opt}
                            activeOpacity={0.7}
                            onPress={() => { onSelect(value === opt ? '' : opt); setOpen(false); }}
                            style={[
                                styles.dropdownItem,
                                value === opt && styles.dropdownItemActive,
                                idx === options.length - 1 && { borderBottomWidth: 0 },
                            ]}
                        >
                            <Text style={[styles.dropdownItemText, value === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                            {value === opt && (
                                <Icon type={Icons.Ionicons} name="checkmark" size={ms(14)} color={primaryColor} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

// ── DermatologyTab ────────────────────────────────────────────────────────────

const EMPTY_ANNOTATION = { primaryLesion: '', secondary: [], size: '', colour: '', surface: '', border: '', symptoms: [], duration: '', notes: '' };

const DermatologyTab = () => {
    const [activeCondition, setActiveCondition] = useState(null);
    const [activeBodyView, setActiveBodyView]   = useState('anterior');
    const [selectedRegion, setSelectedRegion]   = useState(null);
    const [annotation, setAnnotation]           = useState({ ...EMPTY_ANNOTATION });
    const [lesions, setLesions]                 = useState([]);
    const [abcde, setAbcde]                     = useState({ A: null, B: null, C: null, D: null, E: null });
    const [summary, setSummary]                 = useState({ diagnosis: '', differential: '', investigations: '', morphology: '', treatment: '' });

    const abcdeScore = Object.values(abcde).reduce((sum, v) => sum + (v?.score || 0), 0);
    const riskLevel  = abcdeScore <= 1
        ? { label: 'LOW SUSPICION',      color: '#10B981' }
        : abcdeScore <= 3
            ? { label: 'MODERATE SUSPICION', color: '#F59E0B' }
            : { label: 'HIGH SUSPICION',     color: '#EF4444' };

    const bodyView = DERM_BODY_VIEWS.find(v => v.id === activeBodyView);

    const pinLesion = () => {
        if (!selectedRegion) return;
        setLesions(prev => [...prev, { id: Date.now().toString(), region: selectedRegion, view: activeBodyView, condition: activeCondition, annotation: { ...annotation } }]);
        setSelectedRegion(null);
        setAnnotation({ ...EMPTY_ANNOTATION });
    };

    const deleteLesion = (id) => setLesions(prev => prev.filter(l => l.id !== id));

    const toggleMulti = (field, value) =>
        setAnnotation(prev => ({ ...prev, [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value] }));

    const updateSummary = (field, value) => setSummary(prev => ({ ...prev, [field]: value }));

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>

            {/* ── Condition Chips ── */}
            <Text style={styles.sectionLabel}>Condition Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: vs(4) }}>
                <View style={{ flexDirection: 'row', gap: ms(8), paddingBottom: vs(4) }}>
                    {DERM_CONDITIONS.map(c => (
                        <TouchableOpacity key={c.id} activeOpacity={0.7}
                            onPress={() => setActiveCondition(activeCondition === c.id ? null : c.id)}
                            style={[styles.dermCondChip, { backgroundColor: activeCondition === c.id ? c.color : c.bg, borderColor: c.color }]}>
                            <View style={[styles.dermDot, { backgroundColor: c.color }]} />
                            <Text style={[styles.dermCondText, { color: activeCondition === c.id ? whiteColor : c.color }]}>{c.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* ── Body View Tabs ── */}
            <Text style={styles.sectionLabel}>Body View</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: vs(10) }}>
                <View style={{ flexDirection: 'row', gap: ms(10), paddingBottom: vs(4) }}>
                    {DERM_BODY_VIEWS.map(v => {
                        const active = activeBodyView === v.id;
                        return (
                            <TouchableOpacity key={v.id} activeOpacity={0.7}
                                onPress={() => { setActiveBodyView(v.id); setSelectedRegion(null); }}
                                style={[styles.bodyViewCard, active && styles.bodyViewCardActive]}>
                                <View style={[styles.bodyViewIconWrap, active && styles.bodyViewIconWrapActive]}>
                                    <Icon type={Icons.Ionicons} name={v.icon} size={ms(22)} color={active ? whiteColor : primaryColor} />
                                </View>
                                <Text style={[styles.bodyViewLabel, active && styles.bodyViewLabelActive]}>{v.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* ── Body Regions ── */}
            <Text style={styles.sectionLabel}>Select Region — Tap to Annotate</Text>
            <View style={styles.dermRegionGrid}>
                {bodyView?.regions.map(region => {
                    const pinned     = lesions.filter(l => l.region === region && l.view === activeBodyView);
                    const isSelected = selectedRegion === region;
                    return (
                        <TouchableOpacity key={region} activeOpacity={0.7}
                            onPress={() => setSelectedRegion(isSelected ? null : region)}
                            style={[styles.dermRegionChip, isSelected && styles.dermRegionChipActive]}>
                            <Text style={[styles.dermRegionText, isSelected && { color: whiteColor }]}>{region}</Text>
                            {pinned.length > 0 && (
                                <View style={styles.dermPinBadge}><Text style={styles.dermPinText}>{pinned.length}</Text></View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ── Annotation Panel ── */}
            {selectedRegion && (
                <View style={styles.dermAnnotPanel}>
                    <View style={styles.dermAnnotHeader}>
                        <Icon type={Icons.Ionicons} name="pin-outline" size={ms(14)} color={primaryColor} />
                        <Text style={styles.dermAnnotTitle}>Annotating: {selectedRegion}</Text>
                    </View>

                    <Text style={styles.rxLabel}>Primary Lesion</Text>
                    <DropdownSelect
                        label="primary lesion"
                        options={DERM_PRIMARY_LESIONS}
                        value={annotation.primaryLesion}
                        onSelect={v => setAnnotation(p => ({ ...p, primaryLesion: v }))}
                    />

                    <Text style={styles.rxLabel}>Secondary Changes</Text>
                    <View style={styles.tagsWrap}>
                        {DERM_SECONDARY.map(opt => (
                            <TouchableOpacity key={opt} activeOpacity={0.7}
                                onPress={() => toggleMulti('secondary', opt)}
                                style={[styles.tagChip, annotation.secondary.includes(opt) && styles.tagChipActive]}>
                                <Text style={[styles.tagChipText, annotation.secondary.includes(opt) && styles.tagChipTextActive]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.rxLabel}>Size (mm)</Text>
                    <TextInput style={[styles.growthInput, { marginBottom: vs(4) }]} placeholder="e.g. 8mm × 12mm" placeholderTextColor="#AAA"
                        value={annotation.size} onChangeText={v => setAnnotation(p => ({ ...p, size: v }))} />

                    <Text style={styles.rxLabel}>Colour</Text>
                    <DropdownSelect
                        label="colour"
                        options={DERM_COLOURS}
                        value={annotation.colour}
                        onSelect={v => setAnnotation(p => ({ ...p, colour: v }))}
                    />

                    <Text style={styles.rxLabel}>Surface</Text>
                    <DropdownSelect
                        label="surface"
                        options={DERM_SURFACE}
                        value={annotation.surface}
                        onSelect={v => setAnnotation(p => ({ ...p, surface: v }))}
                    />

                    <Text style={styles.rxLabel}>Border</Text>
                    <DropdownSelect
                        label="border"
                        options={DERM_BORDER}
                        value={annotation.border}
                        onSelect={v => setAnnotation(p => ({ ...p, border: v }))}
                    />

                    <Text style={styles.rxLabel}>Symptoms</Text>
                    <View style={styles.tagsWrap}>
                        {DERM_SYMPTOMS.map(opt => (
                            <TouchableOpacity key={opt} activeOpacity={0.7}
                                onPress={() => toggleMulti('symptoms', opt)}
                                style={[styles.tagChip, annotation.symptoms.includes(opt) && styles.tagChipActive]}>
                                <Text style={[styles.tagChipText, annotation.symptoms.includes(opt) && styles.tagChipTextActive]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.rxLabel}>Duration / Onset</Text>
                    <TextInput style={[styles.growthInput, { marginBottom: vs(4) }]} placeholder="e.g. 3 weeks, sudden onset" placeholderTextColor="#AAA"
                        value={annotation.duration} onChangeText={v => setAnnotation(p => ({ ...p, duration: v }))} />

                    <Text style={styles.rxLabel}>Clinical Notes</Text>
                    <TextInput style={[styles.entNoteInput, { marginBottom: vs(10) }]} multiline textAlignVertical="top"
                        placeholder="Additional observations..." placeholderTextColor="#AAA"
                        value={annotation.notes} onChangeText={v => setAnnotation(p => ({ ...p, notes: v }))} />

                    <TouchableOpacity style={styles.actionBtn} onPress={pinLesion} activeOpacity={0.85}>
                        <Icon type={Icons.Ionicons} name="pin-outline" size={ms(16)} color={whiteColor} />
                        <Text style={styles.actionBtnText}>Pin Lesion</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Documented Lesions ── */}
            {lesions.length > 0 && (
                <>
                    <View style={styles.dermLesionHeader}>
                        <Text style={styles.sectionLabel}>Documented Lesions</Text>
                        <View style={styles.dermPinBadge}><Text style={styles.dermPinText}>{lesions.length}</Text></View>
                    </View>
                    {lesions.map(l => (
                        <View key={l.id} style={styles.annotationCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) }}>
                                <Text style={styles.vaccineCardName}>{l.region} ({DERM_BODY_VIEWS.find(v => v.id === l.view)?.label})</Text>
                                <TouchableOpacity onPress={() => deleteLesion(l.id)}>
                                    <Icon type={Icons.Ionicons} name="trash-outline" size={ms(16)} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                            {l.annotation.primaryLesion ? <Text style={styles.annotationNote}>Primary: {l.annotation.primaryLesion}</Text> : null}
                            {l.annotation.secondary.length > 0 ? <Text style={styles.annotationNote}>Secondary: {l.annotation.secondary.join(', ')}</Text> : null}
                            {l.annotation.size ? <Text style={styles.annotationNote}>Size: {l.annotation.size}</Text> : null}
                            {l.annotation.colour ? <Text style={styles.annotationNote}>Colour: {l.annotation.colour}</Text> : null}
                            {l.annotation.symptoms.length > 0 ? <Text style={styles.annotationNote}>Symptoms: {l.annotation.symptoms.join(', ')}</Text> : null}
                            {l.annotation.duration ? <Text style={styles.annotationNote}>Duration: {l.annotation.duration}</Text> : null}
                            {l.annotation.notes ? <Text style={styles.annotationNote}>{l.annotation.notes}</Text> : null}
                        </View>
                    ))}
                </>
            )}

            {/* ── ABCDE Criteria ── */}
            <Text style={styles.sectionLabel}>ABCDE Criteria</Text>
            {ABCDE_FULL.map(c => (
                <View key={c.id} style={styles.abcdeRow}>
                    <View style={styles.abcdeHeader}>
                        <View style={styles.abcdeBadge}><Text style={styles.abcdeBadgeText}>{c.id}</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.abcdeLabel}>{c.label}</Text>
                            <Text style={styles.annotationNote}>{c.desc}</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.abcdeOptions}>
                            {c.options.map(opt => (
                                <TouchableOpacity key={opt.label} activeOpacity={0.7}
                                    onPress={() => setAbcde(p => ({ ...p, [c.id]: p[c.id]?.label === opt.label ? null : opt }))}
                                    style={[styles.abcdeChip, abcde[c.id]?.label === opt.label && styles.abcdeChipActive]}>
                                    <Text style={[styles.abcdeChipText, abcde[c.id]?.label === opt.label && { color: whiteColor }]}>{opt.label} (+{opt.score})</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            ))}

            {/* ABCDE Result */}
            <View style={[styles.dermAbcdeResult, { borderColor: riskLevel.color + '50', backgroundColor: riskLevel.color + '10' }]}>
                <Text style={[styles.dermAbcdeScore, { color: riskLevel.color }]}>Score: {abcdeScore} / 6</Text>
                <Text style={[styles.dermAbcdeRisk,  { color: riskLevel.color }]}>{riskLevel.label}</Text>
            </View>

            {/* ── Clinical Summary ── */}
            <Text style={styles.sectionLabel}>Clinical Summary</Text>

            <View style={styles.summaryCard}>
                {/* Row 1: Provisional Diagnosis + Differential */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryCol}>
                        <Text style={styles.summaryFieldLabel}>Provisional Diagnosis</Text>
                        <TextInput
                            style={styles.summaryTextInput}
                            placeholder="e.g. Atopic dermatitis"
                            placeholderTextColor="#BBBBBB"
                            value={summary.diagnosis}
                            onChangeText={v => updateSummary('diagnosis', v)}
                        />
                    </View>
                    <View style={styles.summaryCol}>
                        <Text style={styles.summaryFieldLabel}>Differential</Text>
                        <TextInput
                            style={styles.summaryTextInput}
                            placeholder="e.g. Contact dermatitis"
                            placeholderTextColor="#BBBBBB"
                            value={summary.differential}
                            onChangeText={v => updateSummary('differential', v)}
                        />
                    </View>
                </View>

                {/* Row 2: Investigation dropdown + Morphology dropdown */}
                <View style={[styles.summaryRow, { marginTop: vs(12) }]}>
                    <View style={styles.summaryCol}>
                        <Text style={styles.summaryFieldLabel}>Investigation</Text>
                        <DropdownSelect
                            label="investigation"
                            options={DERM_INVESTIGATIONS}
                            value={summary.investigations}
                            onSelect={v => updateSummary('investigations', v)}
                        />
                    </View>
                    <View style={styles.summaryCol}>
                        <Text style={styles.summaryFieldLabel}>Morphology Pattern</Text>
                        <DropdownSelect
                            label="morphology"
                            options={DERM_MORPHOLOGY}
                            value={summary.morphology}
                            onSelect={v => updateSummary('morphology', v)}
                        />
                    </View>
                </View>

                {/* Row 3: Treatment Plan */}
                <View style={{ marginTop: vs(12) }}>
                    <Text style={styles.summaryFieldLabel}>Treatment Plan</Text>
                    <TextInput
                        style={styles.summaryTextArea}
                        multiline
                        textAlignVertical="top"
                        placeholder="Topical agents, systemic, phototherapy, patient education..."
                        placeholderTextColor="#BBBBBB"
                        value={summary.treatment}
                        onChangeText={v => updateSummary('treatment', v)}
                    />
                </View>

                {/* Save Note */}
                <TouchableOpacity style={styles.saveNoteBtn} activeOpacity={0.85}>
                    <Text style={styles.saveNoteBtnText}>Save Note</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// ── ENTTab ────────────────────────────────────────────────────────────────────

const ENTTab = () => {
    const [activeSection, setActiveSection]       = useState('ear');
    const [earFindings, setEarFindings]           = useState({ R: [], L: [] });
    const [tmQuadrant, setTmQuadrant]             = useState({ R: null, L: null });
    const [audiometry, setAudiometry]             = useState({ R: null, L: null });
    const [tympanometry, setTympanometry]         = useState({ R: null, L: null });
    const [turbinates, setTurbinates]             = useState({ R: [], L: [] });
    const [nasalFindings, setNasalFindings]       = useState({ R: [], L: [] });
    const [opacifiedSinuses, setOpacifiedSinuses] = useState([]);
    const [throatStructures, setThroatStructures] = useState([]);
    const [tonsilGrade, setTonsilGrade]           = useState({ L: null, R: null });
    const [markedNodes, setMarkedNodes]           = useState([]);
    const [neckNotes, setNeckNotes]               = useState('');
    const [entSummary, setEntSummary]             = useState({ diagnosis: '', investigations: '', treatment: '' });

    const toggleArr = (setter, side, value) =>
        setter(prev => ({ ...prev, [side]: prev[side].includes(value) ? prev[side].filter(x => x !== value) : [...prev[side], value] }));

    const toggleFlat = (setter, value) =>
        setter(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);

    // ── Ear/TM ──
    const renderEar = () => (
        <View>
            {['R', 'L'].map(side => (
                <View key={side} style={[styles.entCard, { marginBottom: vs(12) }]}>
                    {/* Card header */}
                    <View style={styles.entCardHeader}>
                        <View style={styles.entLabelRow}>
                            <Icon type={Icons.Ionicons} name="ear-outline" size={ms(16)} color={primaryColor} />
                            <Text style={styles.entSectionLabel}>{side === 'R' ? 'Right' : 'Left'} Ear</Text>
                        </View>
                        <View style={[styles.entSideBadge, { backgroundColor: side === 'R' ? '#DBEAFE' : '#FCE7F3' }]}>
                            <Text style={[styles.entSideBadgeText, { color: side === 'R' ? '#2563EB' : '#DB2777' }]}>{side === 'R' ? 'Right' : 'Left'}</Text>
                        </View>
                    </View>

                    {/* TM Quadrant — 2×2 anatomical grid */}
                    <Text style={styles.rxLabel}>TM Quadrant</Text>
                    <Text style={[styles.annotationNote, { marginBottom: vs(8) }]}>Tap quadrant to mark perforation / pathology site</Text>
                    <View style={styles.tmQuadrantWrapper}>
                        <View style={styles.tmQuadrantGrid}>
                            {/* Row labels */}
                            <View style={styles.tmRowLabelCol}>
                                <Text style={styles.tmAxisLabel}>Sup</Text>
                                <Text style={styles.tmAxisLabel}>Inf</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {/* Column labels */}
                                <View style={styles.tmColLabels}>
                                    <Text style={[styles.tmAxisLabel, { flex: 1, textAlign: 'center' }]}>Ant</Text>
                                    <Text style={[styles.tmAxisLabel, { flex: 1, textAlign: 'center' }]}>Post</Text>
                                </View>
                                {/* Grid cells */}
                                <View style={styles.tmRow}>
                                    {['AS', 'PS'].map(q => (
                                        <TouchableOpacity key={q} activeOpacity={0.7}
                                            onPress={() => setTmQuadrant(prev => ({ ...prev, [side]: prev[side] === q ? null : q }))}
                                            style={[styles.tmCell, tmQuadrant[side] === q && styles.tmCellActive]}>
                                            <Text style={[styles.tmCellText, tmQuadrant[side] === q && { color: whiteColor }]}>{q}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.tmRow}>
                                    {['AI', 'PI'].map(q => (
                                        <TouchableOpacity key={q} activeOpacity={0.7}
                                            onPress={() => setTmQuadrant(prev => ({ ...prev, [side]: prev[side] === q ? null : q }))}
                                            style={[styles.tmCell, tmQuadrant[side] === q && styles.tmCellActive]}>
                                            <Text style={[styles.tmCellText, tmQuadrant[side] === q && { color: whiteColor }]}>{q}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                        {tmQuadrant[side] && (
                            <View style={styles.tmSelectedBadge}>
                                <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(12)} color={primaryColor} />
                                <Text style={styles.tmSelectedText}>Marked: {tmQuadrant[side]}</Text>
                            </View>
                        )}
                    </View>

                    {/* Findings — multi-select chips */}
                    <Text style={styles.rxLabel}>Findings</Text>
                    <View style={styles.tagsWrap}>
                        {EAR_FINDINGS.map(f => {
                            const active = earFindings[side].includes(f);
                            return (
                                <TouchableOpacity key={f} activeOpacity={0.7}
                                    onPress={() => toggleArr(setEarFindings, side, f)}
                                    style={[styles.entFindingChip, active && styles.entFindingChipActive]}>
                                    {active && <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(12)} color={primaryColor} />}
                                    <Text style={[styles.entFindingText, active && styles.entFindingTextActive]}>{f}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Audiometry + Tympanometry — dropdowns */}
                    <View style={styles.entDropRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rxLabel}>Audiometry</Text>
                            <DropdownSelect
                                label="result"
                                options={AUDIOMETRY_OPTIONS}
                                value={audiometry[side]}
                                onSelect={v => setAudiometry(prev => ({ ...prev, [side]: v }))}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rxLabel}>Tympanometry</Text>
                            <DropdownSelect
                                label="type"
                                options={TYMPANOMETRY_OPTIONS}
                                value={tympanometry[side]}
                                onSelect={v => setTympanometry(prev => ({ ...prev, [side]: v }))}
                            />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    // ── Nose ──
    const renderNose = () => (
        <View>
            {['R', 'L'].map(side => (
                <View key={side} style={[styles.entCard, { marginBottom: vs(12) }]}>
                    <View style={styles.entCardHeader}>
                        <View style={styles.entLabelRow}>
                            <Icon type={Icons.Ionicons} name="navigate-outline" size={ms(16)} color={primaryColor} />
                            <Text style={styles.entSectionLabel}>{side === 'R' ? 'Right' : 'Left'} Nostril</Text>
                        </View>
                        <View style={[styles.entSideBadge, { backgroundColor: side === 'R' ? '#DBEAFE' : '#FCE7F3' }]}>
                            <Text style={[styles.entSideBadgeText, { color: side === 'R' ? '#2563EB' : '#DB2777' }]}>{side === 'R' ? 'Right' : 'Left'}</Text>
                        </View>
                    </View>

                    {/* Turbinates */}
                    <Text style={styles.rxLabel}>Turbinates (Hypertrophied)</Text>
                    <View style={styles.entTurbinateRow}>
                        {['IT – Inferior', 'MT – Middle', 'ST – Superior'].map((label, idx) => {
                            const key = ['IT', 'MT', 'ST'][idx];
                            const active = turbinates[side].includes(key);
                            return (
                                <TouchableOpacity key={key} activeOpacity={0.7}
                                    onPress={() => toggleArr(setTurbinates, side, key)}
                                    style={[styles.entTurbinateChip, active && styles.entTurbinateChipActive]}>
                                    <Text style={[styles.entTurbinateLabel, active && { color: whiteColor }]}>{key}</Text>
                                    <Text style={[styles.entTurbinateDesc, active && { color: 'rgba(255,255,255,0.8)' }]}>{label.split(' – ')[1]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Findings */}
                    <Text style={styles.rxLabel}>Findings</Text>
                    <View style={styles.tagsWrap}>
                        {NASAL_FINDINGS.map(f => {
                            const active = nasalFindings[side].includes(f);
                            return (
                                <TouchableOpacity key={f} activeOpacity={0.7}
                                    onPress={() => toggleArr(setNasalFindings, side, f)}
                                    style={[styles.entFindingChip, active && styles.entFindingChipActive]}>
                                    {active && <Icon type={Icons.Ionicons} name="checkmark-circle" size={ms(12)} color={primaryColor} />}
                                    <Text style={[styles.entFindingText, active && styles.entFindingTextActive]}>{f}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
        </View>
    );

    // ── Sinuses ──
    const SINUS_PAIRS = [
        { label: 'Frontal',    R: 'r_frontal',   L: 'l_frontal'   },
        { label: 'Ethmoid',    R: 'r_ethmoid',   L: 'l_ethmoid'   },
        { label: 'Maxillary',  R: 'r_maxillary', L: 'l_maxillary' },
    ];

    const renderSinus = () => (
        <View style={styles.entCard}>
            <View style={styles.entCardHeader}>
                <View style={styles.entLabelRow}>
                    <Icon type={Icons.Ionicons} name="grid-outline" size={ms(16)} color={primaryColor} />
                    <Text style={styles.entSectionLabel}>Paranasal Sinuses</Text>
                </View>
            </View>
            <Text style={[styles.annotationNote, { marginBottom: vs(12) }]}>Tap to mark opacified / tender</Text>

            {/* Paired sinuses */}
            <View style={styles.entSinusHeader}>
                <Text style={[styles.entSinusHeaderText, { flex: 1, textAlign: 'center' }]}>Right</Text>
                <View style={styles.entSinusHeaderDivider} />
                <Text style={[styles.entSinusHeaderText, { flex: 1, textAlign: 'center' }]}>Left</Text>
            </View>
            {SINUS_PAIRS.map(pair => (
                <View key={pair.label} style={styles.entSinusPairRow}>
                    <TouchableOpacity activeOpacity={0.7}
                        onPress={() => toggleFlat(setOpacifiedSinuses, pair.R)}
                        style={[styles.entSinusCell, opacifiedSinuses.includes(pair.R) && styles.entSinusCellActive]}>
                        <Icon type={Icons.Ionicons}
                            name={opacifiedSinuses.includes(pair.R) ? 'alert-circle' : 'ellipse-outline'}
                            size={ms(14)} color={opacifiedSinuses.includes(pair.R) ? whiteColor : '#9CA3AF'} />
                        <Text style={[styles.entSinusCellText, opacifiedSinuses.includes(pair.R) && { color: whiteColor }]}>R.{pair.label}</Text>
                    </TouchableOpacity>

                    <View style={styles.entSinusPairLabel}>
                        <Text style={styles.entSinusPairLabelText}>{pair.label}</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7}
                        onPress={() => toggleFlat(setOpacifiedSinuses, pair.L)}
                        style={[styles.entSinusCell, opacifiedSinuses.includes(pair.L) && styles.entSinusCellActive]}>
                        <Text style={[styles.entSinusCellText, opacifiedSinuses.includes(pair.L) && { color: whiteColor }]}>L.{pair.label}</Text>
                        <Icon type={Icons.Ionicons}
                            name={opacifiedSinuses.includes(pair.L) ? 'alert-circle' : 'ellipse-outline'}
                            size={ms(14)} color={opacifiedSinuses.includes(pair.L) ? whiteColor : '#9CA3AF'} />
                    </TouchableOpacity>
                </View>
            ))}

            {/* Sphenoid — midline */}
            <TouchableOpacity activeOpacity={0.7}
                onPress={() => toggleFlat(setOpacifiedSinuses, 'sphenoid')}
                style={[styles.entSphenoidCell, opacifiedSinuses.includes('sphenoid') && styles.entSinusCellActive]}>
                <Icon type={Icons.Ionicons}
                    name={opacifiedSinuses.includes('sphenoid') ? 'alert-circle' : 'ellipse-outline'}
                    size={ms(14)} color={opacifiedSinuses.includes('sphenoid') ? whiteColor : '#9CA3AF'} />
                <Text style={[styles.entSinusCellText, opacifiedSinuses.includes('sphenoid') && { color: whiteColor }]}>Sphenoid (Midline)</Text>
            </TouchableOpacity>

            {opacifiedSinuses.length > 0 && (
                <View style={[styles.annotationCard, { marginTop: vs(10) }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                        <Icon type={Icons.Ionicons} name="alert-circle" size={ms(14)} color="#EF4444" />
                        <Text style={[styles.vaccineCardName, { color: '#EF4444' }]}>Opacified Sinuses</Text>
                    </View>
                    <Text style={[styles.annotationNote, { marginTop: vs(4) }]}>
                        {opacifiedSinuses.map(id => PARANASAL_SINUSES.find(s => s.id === id)?.label).join(' · ')}
                    </Text>
                </View>
            )}
        </View>
    );

    // ── Throat ──
    const renderThroat = () => (
        <View>
            <View style={styles.entCard}>
                <View style={styles.entCardHeader}>
                    <View style={styles.entLabelRow}>
                        <Icon type={Icons.Ionicons} name="mic-outline" size={ms(16)} color={primaryColor} />
                        <Text style={styles.entSectionLabel}>Throat / Oropharynx</Text>
                    </View>
                </View>

                {/* Structures — 3-column grid */}
                <Text style={styles.rxLabel}>Structures Involved</Text>
                <View style={styles.entStructureGrid}>
                    {THROAT_STRUCTURES.map(s => {
                        const active = throatStructures.includes(s);
                        return (
                            <TouchableOpacity key={s} activeOpacity={0.7}
                                onPress={() => toggleFlat(setThroatStructures, s)}
                                style={[styles.entStructureCell, active && styles.entStructureCellActive]}>
                                <Icon type={Icons.Ionicons}
                                    name={active ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={ms(16)} color={active ? primaryColor : '#D1D5DB'} />
                                <Text style={[styles.entStructureText, active && styles.entStructureTextActive]}>{s}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Tonsil Grade side by side */}
                <Text style={styles.rxLabel}>Tonsil Grade – Brodsky Scale</Text>
                <View style={styles.entTonsilRow}>
                    {['L', 'R'].map(side => (
                        <View key={side} style={styles.entTonsilSide}>
                            <View style={[styles.entTonsilSideHeader, { backgroundColor: side === 'R' ? '#DBEAFE' : '#FCE7F3' }]}>
                                <Text style={[styles.entTonsilSideLabel, { color: side === 'R' ? '#2563EB' : '#DB2777' }]}>{side === 'R' ? 'Right Tonsil' : 'Left Tonsil'}</Text>
                            </View>
                            <View style={styles.entTonsilGrades}>
                                {TONSIL_GRADES.map(g => (
                                    <TouchableOpacity key={g} activeOpacity={0.7}
                                        onPress={() => setTonsilGrade(prev => ({ ...prev, [side]: prev[side] === g ? null : g }))}
                                        style={[styles.entTonsilGradeBtn, tonsilGrade[side] === g && styles.entTonsilGradeBtnActive]}>
                                        <Text style={[styles.entTonsilGradeText, tonsilGrade[side] === g && { color: whiteColor }]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Summary row */}
                {(throatStructures.length > 0 || tonsilGrade.L || tonsilGrade.R) && (
                    <View style={[styles.annotationCard, { marginTop: vs(10) }]}>
                        {throatStructures.length > 0 && (
                            <Text style={styles.annotationNote}>Involved: {throatStructures.join(', ')}</Text>
                        )}
                        <View style={{ flexDirection: 'row', gap: ms(16), marginTop: vs(4) }}>
                            {tonsilGrade.L && <Text style={styles.annotationNote}>L.Tonsil: Grade {tonsilGrade.L}</Text>}
                            {tonsilGrade.R && <Text style={styles.annotationNote}>R.Tonsil: Grade {tonsilGrade.R}</Text>}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );

    // ── Neck Nodes ──
    const renderNeck = () => (
        <View>
            <Text style={[styles.annotationNote, { marginBottom: vs(10) }]}>Tap nodes to mark as enlarged / palpable</Text>
            {NECK_NODE_GROUPS.map(group => (
                <View key={group.level} style={[styles.entCard, { marginBottom: vs(8) }]}>
                    <View style={styles.entLabelRow}>
                        <View style={styles.entLevelBadge}>
                            <Text style={styles.entLevelBadgeText}>{group.level}</Text>
                        </View>
                    </View>
                    <View style={[styles.tagsWrap, { marginTop: vs(8) }]}>
                        {group.nodes.map(node => {
                            const active = markedNodes.includes(node);
                            return (
                                <TouchableOpacity key={node} activeOpacity={0.7}
                                    onPress={() => toggleFlat(setMarkedNodes, node)}
                                    style={[styles.entNodeChip, active && styles.entNodeChipActive]}>
                                    <View style={[styles.entNodeDot, { backgroundColor: active ? whiteColor : '#D1D5DB' }]} />
                                    <Text style={[styles.entNodeText, active && { color: whiteColor }]}>{node}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
            <Text style={styles.rxLabel}>Notes (size, consistency, tenderness)</Text>
            <TextInput style={[styles.entNoteInput, { marginBottom: vs(4) }]} multiline textAlignVertical="top"
                placeholder="e.g. Level II R — 2cm, firm, non-tender" placeholderTextColor="#AAA"
                value={neckNotes} onChangeText={setNeckNotes} />
            {markedNodes.length > 0 && (
                <View style={[styles.annotationCard, { marginTop: vs(8) }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(6) }}>
                        <Icon type={Icons.Ionicons} name="radio-button-on" size={ms(12)} color={primaryColor} />
                        <Text style={styles.vaccineCardName}>Enlarged Nodes ({markedNodes.length})</Text>
                    </View>
                    <Text style={[styles.annotationNote, { marginTop: vs(4) }]}>{markedNodes.join(' · ')}</Text>
                </View>
            )}
        </View>
    );

    // ── Summary ──
    const renderSummary = () => (
        <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
                <View style={styles.summaryCol}>
                    <Text style={styles.summaryFieldLabel}>Provisional Diagnosis</Text>
                    <TextInput style={styles.summaryTextInput}
                        placeholder="e.g. CSOM, Sinusitis..." placeholderTextColor="#BBBBBB"
                        value={entSummary.diagnosis} onChangeText={v => setEntSummary(p => ({ ...p, diagnosis: v }))} />
                </View>
                <View style={styles.summaryCol}>
                    <Text style={styles.summaryFieldLabel}>Investigation</Text>
                    <DropdownSelect
                        label="investigation"
                        options={ENT_INVESTIGATIONS}
                        value={typeof entSummary.investigations === 'string' ? entSummary.investigations : ''}
                        onSelect={v => setEntSummary(p => ({ ...p, investigations: v }))}
                    />
                </View>
            </View>
            <View style={{ marginTop: vs(12) }}>
                <Text style={styles.summaryFieldLabel}>Treatment Plan</Text>
                <TextInput style={styles.summaryTextArea} multiline textAlignVertical="top"
                    placeholder="Treatment and management plan..." placeholderTextColor="#BBBBBB"
                    value={entSummary.treatment} onChangeText={v => setEntSummary(p => ({ ...p, treatment: v }))} />
            </View>
            <TouchableOpacity style={styles.saveNoteBtn} activeOpacity={0.85}>
                <Text style={styles.saveNoteBtnText}>Save Note</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'ear':     return renderEar();
            case 'nose':    return renderNose();
            case 'sinus':   return renderSinus();
            case 'throat':  return renderThroat();
            case 'neck':    return renderNeck();
            case 'summary': return renderSummary();
            default:        return null;
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {/* ENT Section Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: vs(14), marginTop: -vs(4) }}>
                <View style={{ flexDirection: 'row', gap: ms(8), paddingBottom: vs(4) }}>
                    {ENT_SUB_SECTIONS.map(s => {
                        const active = activeSection === s.id;
                        return (
                            <TouchableOpacity key={s.id} activeOpacity={0.7}
                                onPress={() => setActiveSection(s.id)}
                                style={[styles.subTabChip, active && styles.subTabChipActive]}>
                                <Icon type={Icons.Ionicons} name={s.icon} size={ms(12)} color={active ? primaryColor : '#9CA3AF'} />
                                <Text style={[styles.subTabText, active && styles.subTabTextActive]}>{s.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {renderSection()}
        </ScrollView>
    );
};

// ── ReferralTab ───────────────────────────────────────────────────────────────

const ReferralTab = () => {
    const [activeRTab, setActiveRTab] = useState('new');
    const [step, setStep]             = useState(1);
    const [refData, setRefData]       = useState({ specialty: '', doctor: '', reason: '', urgency: 'Routine', notes: '' });
    const TOTAL_STEPS = 4;

    const updateRef = (field, value) => setRefData(prev => ({ ...prev, [field]: value }));

    const statusColor = { Accepted: '#10B981', Pending: '#F59E0B', Completed: '#3B82F6', New: '#EF4444', Reviewed: '#888' };

    const renderNewReferral = () => (
        <View>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
                    <View key={s} style={styles.stepItem}>
                        <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
                            <Text style={[styles.stepNum, step >= s && { color: whiteColor }]}>{s}</Text>
                        </View>
                        {s < TOTAL_STEPS && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
                    </View>
                ))}
            </View>

            {step === 1 && (
                <View>
                    <Text style={styles.sectionLabel}>Patient Information</Text>
                    <View style={styles.referralInfoCard}>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Patient</Text><Text style={styles.referralInfoValue}>{PATIENT.name}</Text></View>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Age</Text><Text style={styles.referralInfoValue}>{PATIENT.age} yrs</Text></View>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>ID</Text><Text style={styles.referralInfoValue}>{PATIENT.id}</Text></View>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Conditions</Text><Text style={styles.referralInfoValue}>{PATIENT.conditions.join(', ')}</Text></View>
                    </View>
                </View>
            )}

            {step === 2 && (
                <View>
                    <Text style={styles.sectionLabel}>Select Specialty</Text>
                    <View style={styles.tagsWrap}>
                        {REFERRAL_SPECIALTIES.map(sp => (
                            <TouchableOpacity key={sp} style={[styles.tagChip, refData.specialty === sp && styles.tagChipActive]} onPress={() => updateRef('specialty', sp)}>
                                <Text style={[styles.tagChipText, refData.specialty === sp && styles.tagChipTextActive]}>{sp}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.sectionLabel}>Select Doctor</Text>
                    {SPECIALIST_DIRECTORY.filter(d => !refData.specialty || d.specialty.includes(refData.specialty.slice(0, 6))).map(d => (
                        <TouchableOpacity key={d.id} style={[styles.specialistCard, refData.doctor === d.id && styles.specialistCardActive]} onPress={() => updateRef('doctor', d.id)} activeOpacity={0.7}>
                            <View style={styles.specialistAvatar}><Text style={styles.specialistAvatarText}>{d.name.split(' ').map(w => w[0]).slice(1, 3).join('')}</Text></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.specialistName}>{d.name}</Text>
                                <Text style={styles.specialistSpecialty}>{d.specialty} · {d.hospital}</Text>
                            </View>
                            <View style={[styles.availabilityDot, { backgroundColor: d.available ? '#10B981' : '#9CA3AF' }]} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {step === 3 && (
                <View>
                    <Text style={styles.sectionLabel}>Reason for Referral</Text>
                    <View style={styles.textAreaWrap}>
                        <TextInput style={[styles.textArea, { minHeight: vs(80) }]} multiline placeholder="Clinical reason, history, reports..." placeholderTextColor="#AAAAAA" value={refData.reason} onChangeText={v => updateRef('reason', v)} textAlignVertical="top" />
                    </View>
                    <Text style={styles.sectionLabel}>Urgency</Text>
                    <View style={styles.priorityRow}>
                        {['Routine', 'Urgent', 'Emergency'].map(u => (
                            <TouchableOpacity key={u} style={[styles.priorityChip, refData.urgency === u && { backgroundColor: primaryColor, borderColor: primaryColor }]} onPress={() => updateRef('urgency', u)}>
                                <Text style={[styles.priorityChipText, refData.urgency === u && { color: whiteColor }]}>{u}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.sectionLabel}>Additional Notes</Text>
                    <View style={styles.textAreaWrap}>
                        <TextInput style={[styles.textArea, { minHeight: vs(60) }]} multiline placeholder="Any special instructions..." placeholderTextColor="#AAAAAA" value={refData.notes} onChangeText={v => updateRef('notes', v)} textAlignVertical="top" />
                    </View>
                </View>
            )}

            {step === 4 && (
                <View>
                    <Text style={styles.sectionLabel}>Referral Preview</Text>
                    <View style={styles.referralPreview}>
                        <Text style={styles.referralPreviewTitle}>Referral Letter</Text>
                        <View style={styles.rxPreviewDivider} />
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Patient</Text><Text style={styles.referralInfoValue}>{PATIENT.name}, {PATIENT.age} yrs</Text></View>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Specialty</Text><Text style={styles.referralInfoValue}>{refData.specialty || 'Not selected'}</Text></View>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Doctor</Text><Text style={styles.referralInfoValue}>{SPECIALIST_DIRECTORY.find(d => d.id === refData.doctor)?.name || 'Not selected'}</Text></View>
                        <View style={styles.referralInfoRow}><Text style={styles.referralInfoLabel}>Urgency</Text><Text style={[styles.referralInfoValue, { color: refData.urgency === 'Emergency' ? '#EF4444' : refData.urgency === 'Urgent' ? '#F59E0B' : '#10B981' }]}>{refData.urgency}</Text></View>
                        {refData.reason ? <><View style={styles.rxPreviewDivider} /><Text style={styles.referralReasonText}>{refData.reason}</Text></> : null}
                    </View>
                    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
                        <Icon type={Icons.Ionicons} name="send-outline" size={ms(16)} color={whiteColor} />
                        <Text style={styles.actionBtnText}>Send Referral</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Step Navigation */}
            <View style={styles.stepNavRow}>
                {step > 1 && (
                    <TouchableOpacity style={styles.stepNavBack} onPress={() => setStep(s => s - 1)}>
                        <Icon type={Icons.Ionicons} name="arrow-back" size={ms(16)} color={primaryColor} />
                        <Text style={styles.stepNavBackText}>Back</Text>
                    </TouchableOpacity>
                )}
                {step < TOTAL_STEPS && (
                    <TouchableOpacity style={[styles.actionBtn, { flex: 1, marginTop: 0 }]} onPress={() => setStep(s => s + 1)}>
                        <Text style={styles.actionBtnText}>Next</Text>
                        <Icon type={Icons.Ionicons} name="arrow-forward" size={ms(16)} color={whiteColor} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderSent = () => (
        <View>
            {SENT_REFERRALS.map(ref => (
                <View key={ref.id} style={styles.referralListCard}>
                    <View style={styles.referralListRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.referralListTop}>
                                <Text style={styles.referralListPatient}>{ref.patient}</Text>
                                {ref.urgent && <View style={styles.urgentBadge}><Text style={styles.urgentText}>Urgent</Text></View>}
                            </View>
                            <Text style={styles.referralListSub}>{ref.specialty} · {ref.doctor}</Text>
                            <Text style={styles.referralListDate}>{ref.date}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: (statusColor[ref.status] || '#888') + '20' }]}>
                            <Text style={[styles.statusBadgeText, { color: statusColor[ref.status] || '#888' }]}>{ref.status}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderReceived = () => (
        <View>
            {RECEIVED_REFERRALS.map(ref => (
                <View key={ref.id} style={styles.referralListCard}>
                    <View style={styles.referralListRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.referralListTop}>
                                <Text style={styles.referralListPatient}>{ref.patient}</Text>
                                {ref.urgent && <View style={styles.urgentBadge}><Text style={styles.urgentText}>Urgent</Text></View>}
                            </View>
                            <Text style={styles.referralListSub}>{ref.specialty}</Text>
                            <Text style={styles.referralListDate}>From: {ref.from} · {ref.date}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: (statusColor[ref.status] || '#888') + '20' }]}>
                            <Text style={[styles.statusBadgeText, { color: statusColor[ref.status] || '#888' }]}>{ref.status}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderSpecialists = () => (
        <View>
            {SPECIALIST_DIRECTORY.map(d => (
                <View key={d.id} style={styles.specialistCard}>
                    <View style={styles.specialistAvatar}><Text style={styles.specialistAvatarText}>{d.name.split(' ').map(w => w[0]).slice(1, 3).join('')}</Text></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.specialistName}>{d.name}</Text>
                        <Text style={styles.specialistSpecialty}>{d.specialty}</Text>
                        <Text style={styles.referralListDate}>{d.hospital}</Text>
                    </View>
                    <View style={[styles.availabilityDot, { backgroundColor: d.available ? '#10B981' : '#9CA3AF' }]} />
                </View>
            ))}
        </View>
    );

    const renderTracking = () => {
        const columns = [
            { label: 'Pending',   color: '#F59E0B', refs: SENT_REFERRALS.filter(r => r.status === 'Pending')   },
            { label: 'Accepted',  color: '#10B981', refs: SENT_REFERRALS.filter(r => r.status === 'Accepted')  },
            { label: 'Completed', color: '#3B82F6', refs: SENT_REFERRALS.filter(r => r.status === 'Completed') },
        ];
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.trackingBoard}>
                    {columns.map(col => (
                        <View key={col.label} style={styles.trackingColumn}>
                            <View style={[styles.trackingColHeader, { borderColor: col.color }]}>
                                <Text style={[styles.trackingColTitle, { color: col.color }]}>{col.label}</Text>
                                <View style={[styles.trackingColBadge, { backgroundColor: col.color }]}>
                                    <Text style={styles.trackingColBadgeText}>{col.refs.length}</Text>
                                </View>
                            </View>
                            {col.refs.map(r => (
                                <View key={r.id} style={styles.trackingCard}>
                                    <Text style={styles.trackingCardPatient}>{r.patient}</Text>
                                    <Text style={styles.trackingCardSub}>{r.specialty}</Text>
                                    <Text style={styles.trackingCardDate}>{r.date}</Text>
                                </View>
                            ))}
                            {col.refs.length === 0 && <Text style={styles.trackingEmpty}>None</Text>}
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {/* Referral Sub-Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.referralTabRow}>
                {REFERRAL_SUBTABS.map(t => (
                    <TouchableOpacity key={t.id} style={[styles.referralTabChip, activeRTab === t.id && styles.referralTabChipActive]} onPress={() => { setActiveRTab(t.id); setStep(1); }} activeOpacity={0.7}>
                        <Text style={[styles.referralTabText, activeRTab === t.id && { color: whiteColor }]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {activeRTab === 'new'         && renderNewReferral()}
            {activeRTab === 'sent'        && renderSent()}
            {activeRTab === 'received'    && renderReceived()}
            {activeRTab === 'specialists' && renderSpecialists()}
            {activeRTab === 'tracking'    && renderTracking()}
        </ScrollView>
    );
};

// ── ConsultationNotes (wrapper with sub-tab bar) ───────────────────────────────

const ConsultationNotes = () => {
    const [activeSubTab, setActiveSubTab] = useState('soap');

    const renderSubTabContent = () => {
        switch (activeSubTab) {
            case 'soap':        return <SoapNoteTab />;
            case 'body':        return <BodyDiagramTab />;
            case 'dental':      return <DentalChartTab />;
            case 'vaccination': return <VaccinationTab />;
            case 'growth':      return <GrowthChartTab />;
            case 'dermatology': return <DermatologyTab />;
            case 'ent':         return <ENTTab />;
            case 'referral':    return <ReferralTab />;
            default:            return null;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Sub-Tab Bar */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subTabScroll} contentContainerStyle={styles.subTabContent}>
                {NOTE_SUBTABS.map(tab => {
                    const active = activeSubTab === tab.id;
                    return (
                        <TouchableOpacity key={tab.id} style={[styles.subTabChip, active && styles.subTabChipActive]} onPress={() => setActiveSubTab(tab.id)} activeOpacity={0.7}>
                            <Icon type={Icons.Ionicons} name={tab.icon} size={ms(12)} color={active ? primaryColor : '#9CA3AF'} />
                            <Text style={[styles.subTabText, active && styles.subTabTextActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <View style={{ flex: 1 }}>
                {renderSubTabContent()}
            </View>
        </View>
    );
};

// ── OrderTests ────────────────────────────────────────────────────────────────

const OrderTests = () => {
    const [selected, setSelected]     = useState([]);
    const [customTest, setCustomTest] = useState('');
    const [priority, setPriority]     = useState('High');
    const [filterCat, setFilterCat]   = useState('All');

    const categories = ['All', ...new Set(SUGGESTED_TESTS.map(t => t.category))];
    const filtered = filterCat === 'All' ? SUGGESTED_TESTS : SUGGESTED_TESTS.filter(t => t.category === filterCat);
    const toggleTest = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const addCustom = () => { if (customTest.trim()) setCustomTest(''); };
    const priorityColor = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                {categories.map(cat => (
                    <TouchableOpacity key={cat} style={[styles.templateChip, filterCat === cat && styles.templateChipActive]} onPress={() => setFilterCat(cat)}>
                        <Text style={[styles.templateChipText, filterCat === cat && styles.templateChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.sectionLabel}>Suggested Diagnostics</Text>
            {filtered.map(test => {
                const isSelected = selected.includes(test.id);
                const pc = priorityColor[test.priority] || '#888';
                return (
                    <TouchableOpacity key={test.id} style={[styles.testRow, isSelected && styles.testRowSelected]} onPress={() => toggleTest(test.id)} activeOpacity={0.7}>
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

            <Text style={styles.sectionLabel}>Add Custom Test</Text>
            <View style={styles.customTestRow}>
                <TextInput style={styles.customTestInput} placeholder="Enter test name..." placeholderTextColor="#AAAAAA" value={customTest} onChangeText={setCustomTest} />
                <TouchableOpacity style={styles.addCustomBtn} onPress={addCustom}>
                    <Icon type={Icons.Ionicons} name="add" size={ms(20)} color={whiteColor} />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Default Priority</Text>
            <View style={styles.priorityRow}>
                {['High', 'Medium', 'Low'].map(p => (
                    <TouchableOpacity key={p} style={[styles.priorityChip, priority === p && { backgroundColor: priorityColor[p], borderColor: priorityColor[p] }]} onPress={() => setPriority(p)}>
                        <Text style={[styles.priorityChipText, priority === p && { color: whiteColor }]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>

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
    const [drugSearch, setDrugSearch]         = useState('');
    const [drugResults, setDrugResults]       = useState([]);
    const [rxList, setRxList]                 = useState([]);
    const [interactionWarning, setInteractionWarning] = useState('');
    const [showPreview, setShowPreview]       = useState(false);

    const searchDrug = (text) => {
        setDrugSearch(text);
        setDrugResults(text.length > 1 ? DRUG_DB.filter(d => d.name.toLowerCase().includes(text.toLowerCase())) : []);
    };

    const selectDrug = (drug) => {
        const entry = { id: Date.now().toString(), drug, strength: drug.strengths[0], frequency: 'Once daily', duration: 7, durationUnit: 'Days', refills: 0 };
        const newList = [...rxList, entry];
        setRxList(newList);
        setDrugSearch(''); setDrugResults([]);
        const allDrugNames = newList.map(rx => rx.drug.name);
        const warnings = [];
        newList.forEach(rx => rx.drug.interactions.forEach(inter => {
            if (allDrugNames.some(n => n.toLowerCase().includes(inter.toLowerCase()))) warnings.push(`${rx.drug.name} ↔ ${inter}`);
        }));
        setInteractionWarning(warnings.length > 0 ? warnings.join(', ') : '');
    };

    const removeDrug = (id) => { setRxList(prev => prev.filter(rx => rx.id !== id)); setInteractionWarning(''); };
    const updateRx = (id, field, value) => setRxList(prev => prev.map(rx => rx.id === id ? { ...rx, [field]: value } : rx));

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            <Text style={styles.sectionLabel}>Search Drug</Text>
            <View style={styles.drugSearchWrap}>
                <Icon type={Icons.Ionicons} name="search-outline" size={ms(16)} color="#999" />
                <TextInput style={styles.drugSearchInput} placeholder="Search by drug name..." placeholderTextColor="#AAAAAA" value={drugSearch} onChangeText={searchDrug} />
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

            {!!interactionWarning && (
                <View style={styles.warningBox}>
                    <Icon type={Icons.Ionicons} name="warning-outline" size={ms(16)} color="#F59E0B" />
                    <Text style={styles.warningText}>Interaction: {interactionWarning}</Text>
                </View>
            )}

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
                            <Text style={styles.rxLabel}>Strength</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={styles.rxOptionsRow}>{rx.drug.strengths.map(s => (<TouchableOpacity key={s} style={[styles.rxOptionChip, rx.strength === s && styles.rxOptionChipActive]} onPress={() => updateRx(rx.id, 'strength', s)}><Text style={[styles.rxOptionText, rx.strength === s && styles.rxOptionTextActive]}>{s}</Text></TouchableOpacity>))}</View></ScrollView>
                            <Text style={styles.rxLabel}>Frequency</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={styles.rxOptionsRow}>{FREQUENCY_OPTIONS.map(f => (<TouchableOpacity key={f} style={[styles.rxOptionChip, rx.frequency === f && styles.rxOptionChipActive]} onPress={() => updateRx(rx.id, 'frequency', f)}><Text style={[styles.rxOptionText, rx.frequency === f && styles.rxOptionTextActive]}>{f}</Text></TouchableOpacity>))}</View></ScrollView>
                            <Text style={styles.rxLabel}>Duration</Text>
                            <View style={styles.durationRow}>
                                <TouchableOpacity style={styles.durationStepper} onPress={() => updateRx(rx.id, 'duration', Math.max(1, rx.duration - 1))}><Icon type={Icons.Ionicons} name="remove" size={ms(16)} color={primaryColor} /></TouchableOpacity>
                                <Text style={styles.durationValue}>{rx.duration}</Text>
                                <TouchableOpacity style={styles.durationStepper} onPress={() => updateRx(rx.id, 'duration', rx.duration + 1)}><Icon type={Icons.Ionicons} name="add" size={ms(16)} color={primaryColor} /></TouchableOpacity>
                                {DURATION_UNITS.map(u => (<TouchableOpacity key={u} style={[styles.rxOptionChip, rx.durationUnit === u && styles.rxOptionChipActive, { marginLeft: ms(6) }]} onPress={() => updateRx(rx.id, 'durationUnit', u)}><Text style={[styles.rxOptionText, rx.durationUnit === u && styles.rxOptionTextActive]}>{u}</Text></TouchableOpacity>))}
                            </View>
                            <Text style={styles.rxLabel}>Refills</Text>
                            <View style={styles.durationRow}>
                                <TouchableOpacity style={styles.durationStepper} onPress={() => updateRx(rx.id, 'refills', Math.max(0, rx.refills - 1))}><Icon type={Icons.Ionicons} name="remove" size={ms(16)} color={primaryColor} /></TouchableOpacity>
                                <Text style={styles.durationValue}>{rx.refills}</Text>
                                <TouchableOpacity style={styles.durationStepper} onPress={() => updateRx(rx.id, 'refills', rx.refills + 1)}><Icon type={Icons.Ionicons} name="add" size={ms(16)} color={primaryColor} /></TouchableOpacity>
                            </View>
                        </View>
                    ))}
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
        if (activeTab === 'notes')     return <ConsultationNotes />;
        if (activeTab === 'tests')     return <OrderTests />;
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

                {/* Main Tab Bar */}
                <View style={styles.tabBar}>
                    {TABS.map(tab => (
                        <TouchableOpacity key={tab.id} style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]} onPress={() => setActiveTab(tab.id)} activeOpacity={0.7}>
                            <Icon type={Icons.Ionicons} name={tab.icon} size={ms(16)} color={activeTab === tab.id ? primaryColor : blackColor} />
                            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
                            {activeTab === tab.id && <View style={styles.tabUnderline} />}
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.tabDivider} />

                <View style={{ flex: 1 }}>
                    {renderContent()}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default TrustMDActionsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    flex1: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(14), paddingTop: ms(48), paddingBottom: ms(14), gap: ms(10) },
    backBtn: { width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: ms(6) },
    headerTitle: { fontSize: ms(18), fontFamily: heading, color: whiteColor },
    patientBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: vs(5), maxWidth: ms(110) },
    patientBadgeText: { fontSize: ms(11), color: primaryColor, fontFamily: interMedium },

    // Conditions Bar
    conditionsBar: { backgroundColor: 'transparent' },
    conditionsScroll: { paddingHorizontal: ms(14), paddingVertical: vs(8), gap: ms(8) },
    conditionChip: { backgroundColor: primaryColor + '15', borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    conditionChipText: { fontSize: ms(11), color: primaryColor, fontFamily: interMedium },
    allergyChip: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: '#FEE2E2', borderRadius: ms(20), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    allergyChipText: { fontSize: ms(11), color: '#EF4444', fontFamily: interMedium },

    // Main Tab Bar
    tabBar: { flexDirection: 'row', backgroundColor: 'transparent', paddingHorizontal: ms(8) },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: vs(10), gap: vs(3), position: 'relative' },
    tabItemActive: {},
    tabLabel: { fontSize: ms(12), color: blackColor, fontFamily: interRegular },
    tabLabelActive: { color: primaryColor, fontFamily: interMedium },
    tabUnderline: { position: 'absolute', bottom: 0, left: ms(8), right: ms(8), height: 2, backgroundColor: primaryColor, borderRadius: 1 },
    tabDivider: { height: 1, backgroundColor: '#E5E7EB' },

    // Sub-Tab Bar (Notes)
    subTabScroll: { marginTop: vs(8), marginBottom: vs(8), flexGrow: 0 },
    subTabContent: { paddingHorizontal: ms(16), gap: ms(4) },
    subTabChip: { flexDirection: 'row', alignItems: 'center', gap: ms(4), backgroundColor: whiteColor, borderRadius: ms(10), paddingHorizontal: ms(8), paddingVertical: vs(6), borderWidth: 1, borderColor: '#E5E7EB' },
    subTabChipActive: { borderColor: primaryColor, backgroundColor: primaryColor + '10' },
    subTabText: { fontSize: ms(9.5), color: '#9CA3AF', fontFamily: interMedium },
    subTabTextActive: { color: primaryColor },

    // Tab Content
    tabContent: { padding: ms(16), paddingBottom: vs(40) },

    // Section Label
    sectionLabel: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, marginBottom: vs(8), marginTop: vs(14) },
    infoHint: { fontSize: ms(12), fontFamily: interRegular, color: '#888', marginBottom: vs(8), fontStyle: 'italic' },

    // Vitals
    vitalsRow: { flexDirection: 'row', gap: ms(8), marginBottom: vs(4) },
    vitalCard: { flex: 1, backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(10), alignItems: 'center', gap: vs(2) },
    vitalValue: { fontSize: ms(14), fontFamily: interMedium, color: blackColor },
    vitalUnit: { fontSize: ms(9), fontFamily: interRegular, color: '#888' },
    vitalLabel: { fontSize: ms(10), fontFamily: interRegular, color: '#666' },

    // Mode Toggle
    modeToggle: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: ms(10), padding: ms(3), marginBottom: vs(4) },
    modeBtn: { flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(8) },
    modeBtnActive: { backgroundColor: whiteColor, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
    modeBtnText: { fontSize: ms(13), color: '#666', fontFamily: interRegular },
    modeBtnTextActive: { color: primaryColor, fontFamily: interMedium },

    // Templates
    templatesScroll: { marginBottom: vs(4) },
    templateChip: { backgroundColor: whiteColor, borderRadius: ms(20), paddingHorizontal: ms(14), paddingVertical: vs(6), marginRight: ms(8), borderWidth: 1, borderColor: '#E5E7EB' },
    templateChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    templateChipText: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    templateChipTextActive: { color: whiteColor, fontFamily: interMedium },

    // Text Area
    textAreaWrap: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(4) },
    textAreaWrapBordered: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(4), borderWidth: 1, borderColor: '#E5E7EB' },
    textArea: { fontSize: ms(13), color: blackColor, minHeight: vs(160), fontFamily: interRegular },
    charCount: { fontSize: ms(10), color: '#AAA', textAlign: 'right', marginTop: vs(4), fontFamily: interRegular },

    // SOAP
    soapContainer: { gap: vs(10) },
    soapField: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12) },
    soapFieldLabel: { fontSize: ms(12), fontFamily: interMedium, color: primaryColor, marginBottom: vs(6) },
    soapInput: { fontSize: ms(13), color: blackColor, minHeight: vs(70), fontFamily: interRegular },

    // Tags
    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(4) },
    tagChip: { backgroundColor: whiteColor, borderRadius: ms(20), paddingHorizontal: ms(12), paddingVertical: vs(6), borderWidth: 1, borderColor: '#E5E7EB' },
    tagChipActive: { backgroundColor: primaryColor + '15', borderColor: primaryColor },
    tagChipText: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    tagChipTextActive: { color: primaryColor, fontFamily: interMedium },

    // Body Diagram (legacy grid — kept for reference)
    bodyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginBottom: vs(4) },
    bodyRegionCell: { width: (width - ms(32) - ms(10) * 4) / 5, aspectRatio: 1, backgroundColor: whiteColor, borderRadius: ms(12), alignItems: 'center', justifyContent: 'center', gap: vs(4), borderWidth: 1, borderColor: '#E5E7EB' },
    bodyRegionCellActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    bodyRegionLabel: { fontSize: ms(9), fontFamily: interRegular, color: '#555', textAlign: 'center' },
    annotationCard: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(8), borderLeftWidth: 3, borderLeftColor: primaryColor },
    annotationRegions: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(6) },
    annotationRegionChip: { backgroundColor: primaryColor + '15', borderRadius: ms(10), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    annotationRegionText: { fontSize: ms(11), color: primaryColor, fontFamily: interMedium },
    annotationNote: { fontSize: ms(12), color: '#555', fontFamily: interRegular },

    // Body Diagram — Specialty chips
    bodySpecChip: { flexDirection: 'row', alignItems: 'center', gap: ms(5), backgroundColor: whiteColor, borderRadius: ms(20), paddingHorizontal: ms(12), paddingVertical: vs(7), borderWidth: 1, borderColor: '#E5E7EB' },
    bodySpecChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    bodySpecText: { fontSize: ms(12), fontFamily: interMedium, color: '#555' },
    bodySpecTextActive: { color: whiteColor },

    // Body Diagram — Region grid
    bodyRegionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(4) },
    bodyRegionBtn: {
        width: Math.floor((width - ms(32) - ms(6) * 3) / 4),
        paddingVertical: vs(10),
        paddingHorizontal: ms(4),
        backgroundColor: whiteColor,
        borderRadius: ms(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
        minHeight: vs(42),
    },
    bodyRegionBtnPinned: { backgroundColor: primaryColor + '10', borderColor: primaryColor, borderWidth: 1.5 },
    bodyRegionBtnText: { fontSize: ms(10), fontFamily: interRegular, color: '#444', textAlign: 'center' },
    bodyRegionBtnTextPinned: { color: primaryColor, fontFamily: interMedium },
    bodyPinBadge: { position: 'absolute', top: -ms(7), right: -ms(7), width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    bodyPinText: { fontSize: ms(9), fontFamily: interMedium, color: whiteColor },

    // Body Diagram — Annotation cards
    bodyAnnotCard: { backgroundColor: whiteColor, borderRadius: ms(12), marginBottom: vs(8), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
    bodyAnnotHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(10), padding: ms(12) },
    bodyAnnotNumCircle: { width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center' },
    bodyAnnotNum: { fontSize: ms(12), fontFamily: interMedium, color: whiteColor },
    bodyAnnotRegion: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    bodyAnnotSevBadge: { alignSelf: 'flex-start', borderRadius: ms(10), paddingHorizontal: ms(8), paddingVertical: vs(1) },
    bodyAnnotSevBadgeText: { fontSize: ms(10), fontFamily: interMedium },
    bodyAnnotForm: { paddingHorizontal: ms(12), paddingBottom: ms(12), borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    bodyAnnotFormLabel: { fontSize: ms(12), fontFamily: interMedium, color: '#555', marginBottom: vs(6), marginTop: vs(10) },
    bodyAnnotSevRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6) },
    bodyAnnotSevChip: { paddingHorizontal: ms(10), paddingVertical: vs(5), borderRadius: ms(20), borderWidth: 1, borderColor: '#D0D0D0', backgroundColor: '#F9FAFB' },
    bodyAnnotSevText: { fontSize: ms(11), fontFamily: interMedium, color: '#555' },
    bodyAnnotTextArea: { backgroundColor: '#F8FAFC', borderRadius: ms(10), padding: ms(10), fontSize: ms(12), color: blackColor, minHeight: vs(70), borderWidth: 1, borderColor: '#E5E7EB', fontFamily: interRegular },
    bodyAnnotActions: { flexDirection: 'row', gap: ms(10), marginTop: vs(12), justifyContent: 'flex-end' },
    bodyAnnotRemoveBtn: { flexDirection: 'row', alignItems: 'center', gap: ms(5), paddingHorizontal: ms(14), paddingVertical: vs(8), borderRadius: ms(20), borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
    bodyAnnotRemoveText: { fontSize: ms(12), fontFamily: interMedium, color: '#EF4444' },
    bodyAnnotSaveBtn: { flexDirection: 'row', alignItems: 'center', gap: ms(5), paddingHorizontal: ms(16), paddingVertical: vs(8), borderRadius: ms(20), backgroundColor: primaryColor },
    bodyAnnotSaveText: { fontSize: ms(12), fontFamily: interMedium, color: whiteColor },

    // Body Diagram — Checklist
    bodyChecklistCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginTop: vs(10), marginBottom: vs(4), borderWidth: 1, borderColor: '#E5E7EB' },
    bodyChecklistHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(12) },
    bodyChecklistTitle: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, flex: 1 },
    bodyCheckItem: { flexDirection: 'row', alignItems: 'center', gap: ms(10), paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    bodyCheckBox: { width: ms(20), height: ms(20), borderRadius: ms(5), borderWidth: 2, borderColor: '#D0D0D0', backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center' },
    bodyCheckBoxActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    bodyCheckText: { fontSize: ms(13), fontFamily: interRegular, color: '#555', flex: 1 },
    bodyCheckTextChecked: { color: '#10B981', fontFamily: interMedium },

    // Dental
    dentalLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginBottom: vs(4) },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(5) },
    legendDot: { width: ms(10), height: ms(10), borderRadius: ms(5) },
    legendText: { fontSize: ms(11), color: '#555', fontFamily: interRegular },

    dentalCondGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(12) },
    dentalCondBtn: {
        width: Math.floor((width - ms(32) - ms(8) * 3) / 4),
        flexDirection: 'row', alignItems: 'center', gap: ms(4),
        paddingVertical: vs(8), paddingHorizontal: ms(6),
        backgroundColor: '#F8FAFC', borderRadius: ms(10),
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    dentalCondDot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
    dentalCondBtnText: { flex: 1, fontSize: ms(10), color: '#555', fontFamily: interRegular },

    dentalChartCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(14), marginBottom: vs(12),
        borderWidth: 1, borderColor: '#E5E7EB',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    jawSection: { marginBottom: vs(4) },
    jawLabel: { fontSize: ms(11), fontFamily: interMedium, color: '#888', textAlign: 'center', marginBottom: vs(4), letterSpacing: 1 },
    dentalQuadrantRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4), paddingHorizontal: ms(4) },
    dentalQuadrantLabel: { fontSize: ms(9), color: '#AAAAAA', fontFamily: interRegular, textAlign: 'center', lineHeight: ms(13) },
    teethRow: { flexDirection: 'row', justifyContent: 'center', gap: ms(2), marginBottom: vs(2) },
    toothCell: {
        width: ms(28), height: ms(38), borderRadius: ms(6), borderWidth: 2,
        alignItems: 'center', justifyContent: 'center', position: 'relative',
    },
    toothCellSelected: { elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
    toothNum: { fontSize: ms(7), fontFamily: interMedium },
    toothCondAbbr: { fontSize: ms(7), fontFamily: interMedium, marginTop: vs(1) },
    toothNoteDot: { position: 'absolute', top: ms(2), right: ms(2), width: ms(5), height: ms(5), borderRadius: ms(2.5) },
    jawDivider: { alignItems: 'center', marginVertical: vs(6) },
    jawDividerText: { fontSize: ms(10), color: '#CCCCCC', fontFamily: interRegular },
    dentalSummaryBlock: {
        flexDirection: 'row', alignItems: 'flex-start', gap: ms(8),
        backgroundColor: '#F0F9FF', borderRadius: ms(10), padding: ms(10), marginTop: vs(10),
    },
    dentalSummaryText: { flex: 1, fontSize: ms(12), color: '#555', fontFamily: interRegular, lineHeight: ms(18) },

    dentalDetailCard: {
        backgroundColor: whiteColor, borderRadius: ms(14),
        padding: ms(14), marginBottom: vs(12),
        borderWidth: 1, borderColor: '#E5E7EB',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    dentalDetailHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(10) },
    dentalDetailTitle: { fontSize: ms(14), fontFamily: interMedium, color: blackColor },
    dentalToothIndicatorRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(4) },
    dentalToothBadge: { width: ms(36), height: ms(36), borderRadius: ms(8), borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    dentalToothBadgeText: { fontSize: ms(12), fontFamily: interMedium },
    dentalDetailCondLabel: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },

    dentalCondChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(4) },
    dentalCondChip: {
        paddingHorizontal: ms(12), paddingVertical: vs(6),
        borderRadius: ms(20), backgroundColor: '#F1F5F9',
    },
    dentalCondChipText: { fontSize: ms(11), fontFamily: interRegular, color: '#555' },

    dentalToothActions: { flexDirection: 'row', gap: ms(10), marginTop: vs(10) },
    dentalResetBtn: {
        flex: 1, paddingVertical: vs(10), borderRadius: ms(25),
        borderWidth: 1, borderColor: '#D0D0D0', alignItems: 'center',
    },
    dentalResetBtnText: { fontSize: ms(13), color: '#555', fontFamily: interMedium },
    dentalSaveToothBtn: {
        flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: ms(6), paddingVertical: vs(10), borderRadius: ms(25), backgroundColor: primaryColor,
    },
    dentalSaveToothBtnText: { fontSize: ms(13), color: whiteColor, fontFamily: interMedium },

    dentalAffectedBadge: {
        width: ms(24), height: ms(24), borderRadius: ms(12),
        backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center',
    },
    dentalAffectedBadgeText: { fontSize: ms(12), fontFamily: interMedium, color: whiteColor },
    dentalAffectedItem: { flexDirection: 'row', alignItems: 'center', gap: ms(10), paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    dentalAffectedNumBadge: { width: ms(32), height: ms(32), borderRadius: ms(8), borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    dentalAffectedNumText: { fontSize: ms(11), fontFamily: interMedium },
    dentalAffectedCondLabel: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    dentalAffectedNote: { fontSize: ms(11), color: '#888', fontFamily: interRegular, marginTop: vs(2) },
    dentalEmptyState: { alignItems: 'center', paddingVertical: vs(16), gap: vs(6) },
    dentalEmptyText: { fontSize: ms(13), color: '#888', fontFamily: interRegular },

    dentalNoteDropLabel: { fontSize: ms(12), fontFamily: interMedium, color: '#555', marginBottom: vs(4) },

    // Vaccination
    // ── Vaccination ──
    vaccHeaderCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), marginBottom: vs(14), elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    vaccHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: ms(10), marginBottom: vs(10) },
    vaccHeaderTitle: { fontSize: ms(14), fontFamily: interMedium, color: blackColor },
    vaccHeaderSub: { fontSize: ms(11), color: '#666', fontFamily: interRegular, marginTop: vs(2) },
    vaccPrintBtn: { flexDirection: 'row', alignItems: 'center', gap: ms(4), paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 1, borderColor: primaryColor },
    vaccPrintText: { fontSize: ms(11), fontFamily: interMedium, color: primaryColor },
    vaccProgressBar: { height: vs(6), backgroundColor: '#E5E7EB', borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(10) },
    vaccProgressFill: { height: '100%', backgroundColor: primaryColor, borderRadius: ms(3) },
    vaccLegendRow: { flexDirection: 'row', gap: ms(8), flexWrap: 'wrap' },
    vaccBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(5), paddingHorizontal: ms(10), paddingVertical: vs(4), borderRadius: ms(20), borderWidth: 1 },
    vaccBadgeDot: { width: ms(7), height: ms(7), borderRadius: ms(4) },
    vaccBadgeText: { fontSize: ms(11), fontFamily: interMedium },
    vaccGrpRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8), marginTop: vs(6), gap: ms(8) },
    vaccGrpLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    vaccGrpLabel: { fontSize: ms(11), fontFamily: interMedium, color: '#888', paddingHorizontal: ms(4) },
    vaccRowCard: { backgroundColor: whiteColor, borderRadius: ms(12), marginBottom: vs(6), overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0', elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
    vaccRowCardGiven: { borderColor: '#BBF7D0', backgroundColor: '#FAFFFE' },
    vaccRowCardActive: { borderColor: primaryColor },
    vaccRowMain: { flexDirection: 'row', alignItems: 'flex-start', padding: ms(12), gap: ms(10) },
    vaccNameRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6), marginBottom: vs(2) },
    vaccName: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    vaccNipBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: ms(6), paddingVertical: vs(1), borderRadius: ms(4) },
    vaccNipText: { fontSize: ms(9), fontFamily: interMedium, color: '#3B82F6' },
    vaccDesc: { fontSize: ms(11), color: '#888', fontFamily: interRegular, marginBottom: vs(4), lineHeight: ms(15) },
    vaccTagRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6) },
    vaccRouteBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: ms(7), paddingVertical: vs(2), borderRadius: ms(4) },
    vaccRouteText: { fontSize: ms(10), fontFamily: interMedium, color: '#555' },
    vaccDateText: { fontSize: ms(10), color: '#888', fontFamily: interRegular },
    vaccStatusBadge: { paddingHorizontal: ms(8), paddingVertical: vs(3), borderRadius: ms(10) },
    vaccStatusGiven: { backgroundColor: '#F0FDF4' },
    vaccStatusPending: { backgroundColor: '#FFF7ED' },
    vaccStatusText: { fontSize: ms(10), fontFamily: interMedium },
    vaccAccordion: { paddingHorizontal: ms(12), paddingBottom: ms(12) },
    vaccAccordionDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: vs(10) },
    vaccFormRow: { flexDirection: 'row', gap: ms(10), marginBottom: vs(8) },
    vaccFormLabel: { fontSize: ms(11), fontFamily: interMedium, color: '#555', marginBottom: vs(4) },
    vaccFormInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(7), fontSize: ms(12), fontFamily: interRegular, color: blackColor, backgroundColor: '#FAFAFA' },
    vaccAccordionBtns: { flexDirection: 'row', justifyContent: 'flex-end' },
    vaccGivenBtn: { flexDirection: 'row', alignItems: 'center', gap: ms(6), backgroundColor: '#10B981', paddingHorizontal: ms(14), paddingVertical: vs(8), borderRadius: ms(20) },
    vaccGivenBtnText: { fontSize: ms(12), fontFamily: interMedium, color: whiteColor },
    vaccPendingBtn: { flexDirection: 'row', alignItems: 'center', gap: ms(6), backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA', paddingHorizontal: ms(14), paddingVertical: vs(8), borderRadius: ms(20) },
    vaccPendingBtnText: { fontSize: ms(12), fontFamily: interMedium, color: '#F97316' },
    vaccCustomCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginTop: vs(10), borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
    vaccCustomHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(12) },
    vaccCustomTitle: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    vaccAddCustomBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(6), backgroundColor: primaryColor, borderRadius: ms(25), paddingVertical: vs(12) },
    vaccAddCustomBtnText: { fontSize: ms(13), fontFamily: interMedium, color: whiteColor },
    // kept for compatibility (used in other tabs)
    vaccineCardName: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, marginBottom: vs(8) },

    // Growth Chart
    growthInfoBanner: {
        flexDirection: 'row', alignItems: 'flex-start', gap: ms(8),
        backgroundColor: '#EFF6FF', borderRadius: ms(10), padding: ms(12),
        borderWidth: 1, borderColor: '#BFDBFE', marginBottom: vs(12),
    },
    growthInfoText: { flex: 1, fontSize: ms(11.5), color: '#1E40AF', fontFamily: interRegular, lineHeight: ms(17) },
    growthControlRow: { flexDirection: 'row', gap: ms(8), marginBottom: vs(12) },
    segCtrl: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: ms(10), padding: ms(3), gap: ms(2), borderWidth: 1, borderColor: '#E5E7EB' },
    segBtn: { paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(8) },
    segBtnActive: { backgroundColor: whiteColor, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
    segBtnText: { fontSize: ms(11.5), fontFamily: interRegular, color: '#777' },
    segBtnTextActive: { fontFamily: interMedium, color: primaryColor },

    growthMeasureCard: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(12),
        borderWidth: 1, borderColor: '#E5E7EB',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    growthMeasureTitle: { fontSize: ms(12), fontFamily: interMedium, color: '#666', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(10) },
    growthInputGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: vs(4), marginHorizontal: -ms(4) },
    growthInputCell: { width: '50%', paddingHorizontal: ms(4), marginBottom: vs(8) },
    growthInput: { backgroundColor: '#F8FAFC', borderRadius: ms(10), paddingHorizontal: ms(12), paddingVertical: vs(8), fontSize: ms(13), color: blackColor, borderWidth: 1, borderColor: '#E5E7EB', fontFamily: interRegular },
    growthPlotBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(6), backgroundColor: primaryColor, borderRadius: ms(10), paddingVertical: vs(10) },
    growthPlotBtnText: { fontSize: ms(13), fontFamily: interMedium, color: whiteColor },

    pctileBox: {
        flexDirection: 'row', alignItems: 'center', gap: ms(14),
        backgroundColor: '#E0F2FE', borderRadius: ms(14), padding: ms(14), marginBottom: vs(12),
        borderWidth: 1, borderColor: '#BAE6FD',
    },
    pctileNum: { fontSize: ms(32), fontFamily: heading, color: primaryColor, lineHeight: ms(36) },
    pctileTitle: { fontSize: ms(12), fontFamily: interMedium, color: primaryColor, marginBottom: vs(3) },
    pctileDesc: { fontSize: ms(11.5), color: '#0369A1', fontFamily: interRegular, lineHeight: ms(17) },

    growthChartCard: {
        backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(12),
        borderWidth: 1, borderColor: '#E5E7EB',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    },
    growthChartTitle: { fontSize: ms(13), fontFamily: interMedium, color: blackColor, marginBottom: vs(2) },
    growthChartSubtitle: { fontSize: ms(10.5), color: '#94A3B8', fontFamily: interRegular, marginBottom: vs(10) },
    growthChartLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(10), marginTop: vs(10) },
    growthLegendItem: { flexDirection: 'row', alignItems: 'center', gap: ms(5) },
    growthLegendDot: { width: ms(10), height: ms(10), borderRadius: ms(5) },
    growthLegendText: { fontSize: ms(10.5), color: '#555', fontFamily: interRegular },

    growthTableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: vs(6), marginBottom: vs(4) },
    growthTableHeaderCell: { flex: 1, fontSize: ms(10), fontFamily: interMedium, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
    growthTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(7), borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    growthTableCell: { flex: 1, fontSize: ms(11.5), color: blackColor, fontFamily: interRegular },

    growthMilestonesCaption: { fontSize: ms(11.5), color: '#888', fontFamily: interRegular, marginBottom: vs(8) },
    growthMilestoneItem: { flexDirection: 'row', alignItems: 'center', gap: ms(10), paddingVertical: vs(7) },

    // Legacy (kept for any remaining references)
    percentileCard: { backgroundColor: primaryColor + '10', borderRadius: ms(12), padding: ms(14), marginTop: vs(10), borderWidth: 1, borderColor: primaryColor + '30' },
    percentileTitle: { fontSize: ms(13), fontFamily: interMedium, color: primaryColor, marginBottom: vs(10) },
    percentileRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(6) },
    percentileLabel: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    percentileValue: { fontSize: ms(12), fontFamily: interMedium, color: blackColor, flexShrink: 1, textAlign: 'right', maxWidth: '60%' },
    growthReadingCard: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(14), marginBottom: vs(8) },
    growthReadingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(10) },
    growthReadingDate: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    growthReadingAge: { fontSize: ms(12), color: '#888', fontFamily: interRegular },
    growthReadingStats: { flexDirection: 'row', gap: ms(16) },
    growthStat: { alignItems: 'center' },
    growthStatVal: { fontSize: ms(14), fontFamily: interMedium, color: primaryColor },
    growthStatLabel: { fontSize: ms(11), color: '#888', fontFamily: interRegular },

    // ABCDE
    abcdeRow: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(8) },
    abcdeHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(8) },
    abcdeBadge: { width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center' },
    abcdeBadgeText: { fontSize: ms(13), fontFamily: interMedium, color: whiteColor },
    abcdeLabel: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    abcdeOptions: { flexDirection: 'row', gap: ms(8), paddingBottom: vs(4) },
    abcdeChip: { paddingHorizontal: ms(12), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
    abcdeChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    abcdeChipText: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    photoPlaceholder: { backgroundColor: whiteColor, borderRadius: ms(12), height: vs(100), alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', gap: vs(6), marginBottom: vs(4) },
    photoPlaceholderText: { fontSize: ms(12), color: '#BBBBBB', fontFamily: interRegular },

    // ENT
    entCard: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(14), marginBottom: vs(10) },
    entCardAbnormal: { borderLeftWidth: 3, borderLeftColor: '#EF4444' },
    entCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    entLabelRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
    entSectionLabel: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    entToggleRow: { flexDirection: 'row', gap: ms(6) },
    entStatusChip: { paddingHorizontal: ms(10), paddingVertical: vs(4), borderRadius: ms(20), borderWidth: 1, borderColor: '#E5E7EB' },
    entStatusNormal: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
    entStatusAbnormal: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
    entStatusText: { fontSize: ms(11), color: '#888', fontFamily: interMedium },
    entNoteInput: { backgroundColor: '#F8FAFC', borderRadius: ms(10), padding: ms(10), fontSize: ms(12), color: blackColor, minHeight: vs(60), borderWidth: 1, borderColor: '#E5E7EB', fontFamily: interRegular },

    // Referral inner tabs
    referralTabRow: { marginBottom: vs(14) },
    referralTabChip: { paddingHorizontal: ms(14), paddingVertical: vs(6), borderRadius: ms(20), marginRight: ms(8), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor },
    referralTabChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    referralTabText: { fontSize: ms(12), color: '#555', fontFamily: interMedium },

    // Step Wizard
    stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: vs(20) },
    stepItem: { flexDirection: 'row', alignItems: 'center' },
    stepCircle: { width: ms(28), height: ms(28), borderRadius: ms(14), borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center' },
    stepCircleActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    stepNum: { fontSize: ms(12), fontFamily: interMedium, color: '#888' },
    stepLine: { width: ms(30), height: 2, backgroundColor: '#E5E7EB' },
    stepLineActive: { backgroundColor: primaryColor },
    stepNavRow: { flexDirection: 'row', gap: ms(10), marginTop: vs(16), alignItems: 'center' },
    stepNavBack: { flexDirection: 'row', alignItems: 'center', gap: ms(6), paddingHorizontal: ms(16), paddingVertical: vs(12), borderRadius: ms(25), borderWidth: 1, borderColor: primaryColor },
    stepNavBackText: { fontSize: ms(14), color: primaryColor, fontFamily: interMedium },

    // Referral Info Card
    referralInfoCard: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(14), gap: vs(8) },
    referralInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    referralInfoLabel: { fontSize: ms(12), color: '#888', fontFamily: interRegular, width: ms(80) },
    referralInfoValue: { fontSize: ms(12), fontFamily: interMedium, color: blackColor, flex: 1, textAlign: 'right' },

    // Referral Preview
    referralPreview: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), borderWidth: 2, borderColor: primaryColor + '30', marginBottom: vs(12), gap: vs(6) },
    referralPreviewTitle: { fontSize: ms(14), fontFamily: heading, color: primaryColor },
    referralReasonText: { fontSize: ms(12), fontFamily: interRegular, color: '#555', lineHeight: ms(18) },

    // Referral List Cards
    referralListCard: { backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(14), marginBottom: vs(8) },
    referralListRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10) },
    referralListTop: { flexDirection: 'row', alignItems: 'center', gap: ms(8), marginBottom: vs(2) },
    referralListPatient: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    referralListSub: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    referralListDate: { fontSize: ms(11), color: '#888', fontFamily: interRegular, marginTop: vs(2) },
    urgentBadge: { backgroundColor: '#FEE2E2', borderRadius: ms(10), paddingHorizontal: ms(8), paddingVertical: vs(2) },
    urgentText: { fontSize: ms(10), color: '#EF4444', fontFamily: interMedium },
    statusBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(4) },
    statusBadgeText: { fontSize: ms(11), fontFamily: interMedium },

    // Specialists
    specialistCard: { flexDirection: 'row', alignItems: 'center', gap: ms(12), backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(14), marginBottom: vs(8), borderWidth: 1, borderColor: 'transparent' },
    specialistCardActive: { borderColor: primaryColor, backgroundColor: primaryColor + '08' },
    specialistAvatar: { width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: primaryColor + '20', justifyContent: 'center', alignItems: 'center' },
    specialistAvatarText: { fontSize: ms(14), fontFamily: interMedium, color: primaryColor },
    specialistName: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    specialistSpecialty: { fontSize: ms(11), color: '#888', fontFamily: interRegular },
    availabilityDot: { width: ms(10), height: ms(10), borderRadius: ms(5) },

    // Tracking Board
    trackingBoard: { flexDirection: 'row', gap: ms(12), paddingBottom: vs(10) },
    trackingColumn: { width: ms(160) },
    trackingColHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 3, paddingLeft: ms(10), marginBottom: vs(10) },
    trackingColTitle: { fontSize: ms(13), fontFamily: interMedium },
    trackingColBadge: { width: ms(20), height: ms(20), borderRadius: ms(10), justifyContent: 'center', alignItems: 'center' },
    trackingColBadgeText: { fontSize: ms(11), color: whiteColor, fontFamily: interMedium },
    trackingCard: { backgroundColor: whiteColor, borderRadius: ms(10), padding: ms(12), marginBottom: vs(8) },
    trackingCardPatient: { fontSize: ms(12), fontFamily: interMedium, color: blackColor },
    trackingCardSub: { fontSize: ms(11), color: '#666', fontFamily: interRegular },
    trackingCardDate: { fontSize: ms(10), color: '#AAA', fontFamily: interRegular, marginTop: vs(2) },
    trackingEmpty: { fontSize: ms(12), color: '#CCCCCC', fontFamily: interRegular, textAlign: 'center', paddingTop: vs(10) },

    // Tests
    testRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: whiteColor, borderRadius: ms(12), padding: ms(12), marginBottom: vs(8), borderWidth: 1, borderColor: 'transparent' },
    testRowSelected: { borderColor: primaryColor, backgroundColor: primaryColor + '08' },
    checkbox: { width: ms(22), height: ms(22), borderRadius: ms(6), borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
    checkboxChecked: { backgroundColor: primaryColor, borderColor: primaryColor },
    testName: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    testCategory: { fontSize: ms(11), color: '#888', marginTop: vs(1), fontFamily: interRegular },
    priorityBadge: { borderRadius: ms(12), paddingHorizontal: ms(8), paddingVertical: vs(3) },
    priorityBadgeText: { fontSize: ms(11), fontFamily: interMedium },

    // Custom Test
    customTestRow: { flexDirection: 'row', gap: ms(10), alignItems: 'center', marginBottom: vs(4) },
    customTestInput: { flex: 1, backgroundColor: whiteColor, borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: vs(10), fontSize: ms(13), color: blackColor, borderWidth: 1, borderColor: '#E5E7EB', fontFamily: interRegular },
    addCustomBtn: { width: ms(42), height: ms(42), borderRadius: ms(12), backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center' },

    // Priority
    priorityRow: { flexDirection: 'row', gap: ms(10) },
    priorityChip: { flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(12), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor },
    priorityChipText: { fontSize: ms(13), fontFamily: interMedium, color: '#555' },
    orderSummary: { backgroundColor: primaryColor + '15', borderRadius: ms(12), padding: ms(12), marginTop: vs(10), alignItems: 'center' },
    orderSummaryTitle: { fontSize: ms(13), fontFamily: interMedium, color: primaryColor },

    // Drug Search
    drugSearchWrap: { flexDirection: 'row', alignItems: 'center', gap: ms(8), backgroundColor: whiteColor, borderRadius: ms(12), paddingHorizontal: ms(14), paddingVertical: vs(10), borderWidth: 1, borderColor: '#E5E7EB' },
    drugSearchInput: { flex: 1, fontSize: ms(13), color: blackColor, fontFamily: interRegular },
    drugDropdown: { backgroundColor: whiteColor, borderRadius: ms(12), borderWidth: 1, borderColor: '#E5E7EB', marginTop: vs(4), overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    drugDropdownItem: { paddingHorizontal: ms(14), paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    drugDropdownName: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    drugDropdownStrengths: { fontSize: ms(11), color: '#888', marginTop: vs(1), fontFamily: interRegular },
    warningBox: { flexDirection: 'row', alignItems: 'center', gap: ms(8), backgroundColor: '#FEF3C7', borderRadius: ms(10), padding: ms(12), marginTop: vs(8) },
    warningText: { flex: 1, fontSize: ms(12), color: '#92400E', fontFamily: interRegular },

    // Rx Card
    rxCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(12), elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    rxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10) },
    rxDrugName: { fontSize: ms(15), fontFamily: interMedium, color: blackColor },
    rxLabel: { fontSize: ms(11), color: '#888', fontFamily: interMedium, marginBottom: vs(6), marginTop: vs(8) },
    rxOptionsRow: { flexDirection: 'row', gap: ms(8), paddingBottom: vs(4) },
    rxOptionChip: { paddingHorizontal: ms(12), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
    rxOptionChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    rxOptionText: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    rxOptionTextActive: { color: whiteColor, fontFamily: interMedium },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
    durationStepper: { width: ms(32), height: ms(32), borderRadius: ms(8), backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center' },
    durationValue: { fontSize: ms(16), fontFamily: interMedium, color: blackColor, minWidth: ms(24), textAlign: 'center' },
    previewToggle: { flexDirection: 'row', alignItems: 'center', gap: ms(6), justifyContent: 'center', paddingVertical: vs(10), marginBottom: vs(8) },
    previewToggleText: { fontSize: ms(13), color: primaryColor, fontFamily: interMedium },
    rxPreview: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(16), borderWidth: 2, borderColor: primaryColor + '30', marginBottom: vs(12) },
    rxPreviewHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(10), marginBottom: vs(10) },
    rxLogo: { width: ms(36), height: ms(36) },
    rxPreviewTitle: { fontSize: ms(14), fontFamily: interMedium, color: blackColor },
    rxPreviewDate: { fontSize: ms(11), color: '#888', fontFamily: interRegular },
    rxPreviewDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: vs(8) },
    rxPreviewPatient: { fontSize: ms(12), color: '#555', fontFamily: interRegular },
    rxPreviewItem: { flexDirection: 'row', gap: ms(8), marginTop: vs(6) },
    rxPreviewNum: { fontSize: ms(13), fontFamily: interMedium, color: primaryColor, width: ms(16) },
    rxPreviewDrugName: { fontSize: ms(13), fontFamily: interMedium, color: blackColor },
    rxPreviewDetails: { fontSize: ms(12), color: '#666', fontFamily: interRegular },
    emptyRx: { alignItems: 'center', paddingTop: vs(40), gap: vs(10) },
    emptyRxText: { fontSize: ms(13), color: '#AAA', textAlign: 'center', fontFamily: interRegular },

    // Action Button
    actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(8), backgroundColor: primaryColor, borderRadius: ms(25), paddingVertical: vs(14), marginTop: vs(20) },
    actionBtnDisabled: { backgroundColor: '#AAA' },
    actionBtnText: { fontSize: ms(14), fontFamily: interMedium, color: whiteColor },

    // Dropdown
    dropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(8), borderWidth: 1, borderColor: '#E5E7EB', marginBottom: vs(4) },
    dropdownBtnText: { fontSize: ms(12), fontFamily: interRegular, color: blackColor, flex: 1 },
    dropdownList: { backgroundColor: whiteColor, borderRadius: ms(10), borderWidth: 1, borderColor: '#E5E7EB', marginTop: -vs(2), marginBottom: vs(4), overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ms(14), paddingVertical: vs(11), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    dropdownItemActive: { backgroundColor: primaryColor + '10' },
    dropdownItemText: { fontSize: ms(13), fontFamily: interRegular, color: blackColor },
    dropdownItemTextActive: { color: primaryColor, fontFamily: interMedium },

    // Clinical Summary card
    summaryCard: { backgroundColor: whiteColor, borderRadius: ms(14), padding: ms(14), marginBottom: vs(16), borderWidth: 1, borderColor: '#E5E7EB' },
    summaryRow: { flexDirection: 'row', gap: ms(12) },
    summaryCol: { flex: 1 },
    summaryFieldLabel: { fontSize: ms(12), fontFamily: interMedium, color: blackColor, marginBottom: vs(5) },
    summaryTextInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(8), fontSize: ms(12), fontFamily: interRegular, color: blackColor, backgroundColor: '#FAFAFA' },
    summaryTextArea: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), paddingHorizontal: ms(10), paddingVertical: vs(8), fontSize: ms(12), fontFamily: interRegular, color: blackColor, backgroundColor: '#FAFAFA', minHeight: vs(80) },
    saveNoteBtn: { marginTop: vs(16), backgroundColor: primaryColor, borderRadius: ms(8), paddingVertical: vs(12), paddingHorizontal: ms(20), alignSelf: 'flex-start' },
    saveNoteBtnText: { fontSize: ms(13), fontFamily: interMedium, color: whiteColor },

    // Body View Cards
    bodyViewCard: { alignItems: 'center', gap: vs(6), paddingHorizontal: ms(14), paddingVertical: vs(10), borderRadius: ms(14), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor, minWidth: ms(72) },
    bodyViewCardActive: { borderColor: primaryColor, backgroundColor: primaryColor + '08' },
    bodyViewIconWrap: { width: ms(44), height: ms(44), borderRadius: ms(22), backgroundColor: primaryColor + '15', justifyContent: 'center', alignItems: 'center' },
    bodyViewIconWrapActive: { backgroundColor: primaryColor },
    bodyViewLabel: { fontSize: ms(11), fontFamily: interMedium, color: '#666', textAlign: 'center' },
    bodyViewLabelActive: { color: primaryColor },

    // Dermatology
    dermCondChip: { flexDirection: 'row', alignItems: 'center', gap: ms(5), paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 1 },
    dermDot: { width: ms(8), height: ms(8), borderRadius: ms(4) },
    dermCondText: { fontSize: ms(12), fontFamily: interMedium },
    dermRegionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(4) },
    dermRegionChip: { flexDirection: 'row', alignItems: 'center', gap: ms(4), paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(8), borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: whiteColor },
    dermRegionChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    dermRegionText: { fontSize: ms(12), fontFamily: interMedium, color: '#555' },
    dermPinBadge: { backgroundColor: primaryColor, borderRadius: ms(10), minWidth: ms(18), height: ms(18), justifyContent: 'center', alignItems: 'center', paddingHorizontal: ms(3) },
    dermPinText: { fontSize: ms(10), color: whiteColor, fontFamily: interMedium },
    dermAnnotPanel: { backgroundColor: primaryColor + '08', borderRadius: ms(14), padding: ms(14), marginBottom: vs(12), borderWidth: 1, borderColor: primaryColor + '30' },
    dermAnnotHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(6), marginBottom: vs(6) },
    dermAnnotTitle: { fontSize: ms(13), fontFamily: interMedium, color: primaryColor },
    dermLesionHeader: { flexDirection: 'row', alignItems: 'center', gap: ms(8) },
    dermAbcdeResult: { borderRadius: ms(12), padding: ms(14), borderWidth: 1, marginBottom: vs(4), alignItems: 'center', gap: vs(4), marginTop: vs(4) },
    dermAbcdeScore: { fontSize: ms(14), fontFamily: interMedium },
    dermAbcdeRisk: { fontSize: ms(15), fontFamily: heading },

    // ENT — Side badge
    entSideBadge: { borderRadius: ms(12), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    entSideBadgeText: { fontSize: ms(11), fontFamily: interMedium },

    // ENT — TM Quadrant 2×2 grid
    tmQuadrantWrapper: { marginBottom: vs(10) },
    tmQuadrantGrid: { flexDirection: 'row', alignItems: 'center' },
    tmRowLabelCol: { width: ms(28), justifyContent: 'space-around', height: ms(80), paddingVertical: ms(4) },
    tmAxisLabel: { fontSize: ms(9), color: '#9CA3AF', fontFamily: interMedium, textAlign: 'center' },
    tmColLabels: { flexDirection: 'row', marginBottom: vs(2) },
    tmRow: { flexDirection: 'row', gap: ms(4), marginBottom: vs(4) },
    tmCell: { flex: 1, height: ms(36), borderRadius: ms(8), borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
    tmCellActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    tmCellText: { fontSize: ms(12), fontFamily: interMedium, color: '#555' },
    tmSelectedBadge: { flexDirection: 'row', alignItems: 'center', gap: ms(4), marginTop: vs(4) },
    tmSelectedText: { fontSize: ms(11), color: primaryColor, fontFamily: interMedium },

    // ENT — Findings chips
    entFindingChip: { flexDirection: 'row', alignItems: 'center', gap: ms(4), paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor },
    entFindingChipActive: { backgroundColor: primaryColor + '10', borderColor: primaryColor },
    entFindingText: { fontSize: ms(12), fontFamily: interRegular, color: '#555' },
    entFindingTextActive: { color: primaryColor, fontFamily: interMedium },

    // ENT — Audiometry + Tympanometry row
    entDropRow: { flexDirection: 'row', gap: ms(10), marginTop: vs(4) },

    // ENT — Turbinate chips
    entTurbinateRow: { flexDirection: 'row', gap: ms(8), marginBottom: vs(4) },
    entTurbinateChip: { flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(10), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor, gap: vs(2) },
    entTurbinateChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    entTurbinateLabel: { fontSize: ms(13), fontFamily: interMedium, color: '#555' },
    entTurbinateDesc: { fontSize: ms(10), fontFamily: interRegular, color: '#9CA3AF' },

    // ENT — Sinuses
    entSinusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(8), paddingBottom: vs(6), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    entSinusHeaderText: { fontSize: ms(12), fontFamily: interMedium, color: '#6B7280' },
    entSinusHeaderDivider: { width: ms(50), height: 1, backgroundColor: '#E5E7EB' },
    entSinusPairRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6), marginBottom: vs(6) },
    entSinusCell: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(4), paddingVertical: vs(8), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
    entSinusCellActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
    entSinusCellText: { fontSize: ms(11), fontFamily: interMedium, color: '#555' },
    entSinusPairLabel: { width: ms(56), alignItems: 'center' },
    entSinusPairLabelText: { fontSize: ms(10), fontFamily: interMedium, color: '#9CA3AF', textAlign: 'center' },
    entSphenoidCell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ms(6), paddingVertical: vs(10), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', marginTop: vs(4) },

    // ENT — Throat structures 3-col grid
    entStructureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(10) },
    entStructureCell: { flexDirection: 'row', alignItems: 'center', gap: ms(6), width: '47%', paddingHorizontal: ms(10), paddingVertical: vs(8), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor },
    entStructureCellActive: { backgroundColor: primaryColor + '08', borderColor: primaryColor },
    entStructureText: { fontSize: ms(12), fontFamily: interRegular, color: '#555', flex: 1 },
    entStructureTextActive: { color: primaryColor, fontFamily: interMedium },

    // ENT — Tonsil grade
    entTonsilRow: { flexDirection: 'row', gap: ms(10), marginBottom: vs(4) },
    entTonsilSide: { flex: 1, borderRadius: ms(10), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
    entTonsilSideHeader: { paddingVertical: vs(6), alignItems: 'center' },
    entTonsilSideLabel: { fontSize: ms(11), fontFamily: interMedium },
    entTonsilGrades: { flexDirection: 'row', flexWrap: 'wrap', padding: ms(6), gap: ms(4) },
    entTonsilGradeBtn: { flex: 1, minWidth: ms(28), alignItems: 'center', paddingVertical: vs(5), borderRadius: ms(6), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor },
    entTonsilGradeBtnActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    entTonsilGradeText: { fontSize: ms(12), fontFamily: interMedium, color: '#555' },

    // ENT — Neck nodes
    entLevelBadge: { backgroundColor: primaryColor + '15', borderRadius: ms(6), paddingHorizontal: ms(10), paddingVertical: vs(3) },
    entLevelBadgeText: { fontSize: ms(12), fontFamily: interMedium, color: primaryColor },
    entNodeChip: { flexDirection: 'row', alignItems: 'center', gap: ms(5), paddingHorizontal: ms(10), paddingVertical: vs(6), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: whiteColor },
    entNodeChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    entNodeDot: { width: ms(7), height: ms(7), borderRadius: ms(4) },
    entNodeText: { fontSize: ms(12), fontFamily: interRegular, color: '#555' },

    // ENT TM Grid (legacy — kept for safety)
    dermTmGrid: { flexDirection: 'row', gap: ms(8), marginBottom: vs(8) },
    dermTmCell: { width: ms(50), height: ms(44), borderRadius: ms(8), borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: whiteColor, justifyContent: 'center', alignItems: 'center' },
    dermTmCellActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    dermTmText: { fontSize: ms(12), fontFamily: interMedium, color: '#555' },
});
