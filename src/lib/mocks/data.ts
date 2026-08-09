import { AnalysisItem, ReportItem, ChatMessage, DrugInfo, UserProfile, AdminStats, ModelMetric } from '@/types';

// High resolution synthetic medical SVG Data URIs for realistic image visualization
export const MOCK_CHEST_XRAY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <rect width="800" height="800" fill="%23050914"/>
  <circle cx="400" cy="400" r="380" fill="%230d1527" opacity="0.5"/>
  <!-- Ribcage and Spine SVG Paths -->
  <path d="M400,100 L400,700" stroke="%23385e8a" stroke-width="12" stroke-linecap="round" opacity="0.7"/>
  <!-- Left Lung Field -->
  <path d="M220,180 C160,280 150,480 230,620 C320,620 370,550 380,420 C380,300 320,180 220,180 Z" fill="%23132238" stroke="%23385e8a" stroke-width="4"/>
  <!-- Right Lung Field -->
  <path d="M580,180 C640,280 650,480 570,620 C480,620 430,550 420,420 C420,300 480,180 580,180 Z" fill="%23132238" stroke="%23385e8a" stroke-width="4"/>
  <!-- Heart Silhouette -->
  <path d="M370,380 C320,420 330,580 430,600 C470,600 480,500 430,450 Z" fill="%231c3354" opacity="0.8"/>
  <!-- Clavicles -->
  <path d="M200,160 Q300,200 400,170 T600,160" fill="none" stroke="%23648ebf" stroke-width="10" stroke-linecap="round"/>
  <!-- Rib pairs -->
  <path d="M220,240 Q320,280 390,260 M200,320 Q320,370 390,340 M190,400 Q320,460 390,420 M200,480 Q320,540 390,500" fill="none" stroke="%23436b9c" stroke-width="5" opacity="0.6"/>
  <path d="M580,240 Q480,280 410,260 M600,320 Q480,370 410,340 M610,400 Q480,460 410,420 M600,480 Q480,540 410,500" fill="none" stroke="%23436b9c" stroke-width="5" opacity="0.6"/>
  <!-- Abnormal Opacity Patch in Right Lower Lung Field -->
  <ellipse cx="530" cy="480" rx="65" ry="45" fill="%236e89ab" opacity="0.65" filter="blur(4px)"/>
  <circle cx="530" cy="480" r="30" fill="%23a0b8d8" opacity="0.8"/>
</svg>`;

export const MOCK_BRAIN_MRI_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <rect width="800" height="800" fill="%23040711"/>
  <!-- Skull Outline -->
  <ellipse cx="400" cy="400" rx="300" ry="340" fill="%230c1429" stroke="%232b436e" stroke-width="14"/>
  <!-- Cortex Outer Fold Layer -->
  <ellipse cx="400" cy="400" rx="270" ry="310" fill="%23172647"/>
  <!-- Ventricles -->
  <path d="M370,320 Q340,400 370,480 M430,320 Q460,400 430,480" fill="none" stroke="%235384c7" stroke-width="18" stroke-linecap="round"/>
  <!-- Brain Gyri details -->
  <path d="M220,300 C250,220 320,240 360,200 C440,240 520,220 560,300 C590,380 540,480 560,560 C480,620 320,620 240,560 C260,480 200,380 220,300 Z" fill="%231d325c" stroke="%233b619e" stroke-width="3" stroke-dasharray="12,6"/>
  <!-- Normal Symmetry Line -->
  <line x1="400" y1="90" x2="400" y2="710" stroke="%23253b61" stroke-width="3" stroke-dasharray="8,4"/>
  <!-- Highlighted Ventriculomegaly Region -->
  <ellipse cx="370" cy="380" rx="40" ry="60" fill="%2338bdf8" opacity="0.3"/>
</svg>`;

export const MOCK_KNEE_MRI_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <rect width="800" height="800" fill="%23060a17"/>
  <!-- Femur Shaft & Condyles -->
  <path d="M300,80 L320,340 C280,380 240,400 240,450 C320,480 380,440 400,420 C420,440 480,480 560,450 C560,400 520,380 480,340 L500,80 Z" fill="%231b2e52" stroke="%233b639e" stroke-width="5"/>
  <!-- Tibia Shaft & Plateau -->
  <path d="M260,520 C320,500 380,510 400,530 C420,510 480,500 540,520 L510,740 L290,740 Z" fill="%231b2e52" stroke="%233b639e" stroke-width="5"/>
  <!-- Patella -->
  <ellipse cx="210" cy="410" rx="35" ry="65" fill="%23243f6e" stroke="%234d7bbd" stroke-width="4"/>
  <!-- Joint Space & Meniscus -->
  <path d="M250,485 Q320,495 380,485 T530,485" fill="none" stroke="%230ea5e9" stroke-width="6" opacity="0.7"/>
  <!-- Posterior Horn Meniscal Tear Focal Area -->
  <path d="M480,470 L510,490 L460,500 Z" fill="%23f43f5e" opacity="0.85"/>
</svg>`;

export const MOCK_ULTRASOUND_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <rect width="800" height="800" fill="%2302050d"/>
  <!-- Ultrasonic Fan Beam -->
  <path d="M400,80 L750,720 L50,720 Z" fill="%230e1c33" opacity="0.6"/>
  <!-- Speckle noise grid lines -->
  <circle cx="400" cy="80" r="200" fill="none" stroke="%231e365d" stroke-width="1" opacity="0.4"/>
  <circle cx="400" cy="80" r="400" fill="none" stroke="%231e365d" stroke-width="1" opacity="0.4"/>
  <circle cx="400" cy="80" r="600" fill="none" stroke="%231e365d" stroke-width="1" opacity="0.4"/>
  <!-- Thyroid Lobe Left -->
  <ellipse cx="300" cy="450" rx="90" ry="140" fill="%23193054" stroke="%233d69a8" stroke-width="3"/>
  <!-- Thyroid Lobe Right -->
  <ellipse cx="500" cy="450" rx="90" ry="140" fill="%23193054" stroke="%233d69a8" stroke-width="3"/>
  <!-- Hypoechoic Nodule in Left Lobe -->
  <circle cx="310" cy="460" r="38" fill="%230b1526" stroke="%23eab308" stroke-width="4"/>
</svg>`;

export const MOCK_ANALYSES: AnalysisItem[] = [
  {
    id: 'scan-cxr-9021',
    title: 'Chest Radiograph - Frontal View',
    patientId: 'PT-88392',
    patientAge: 54,
    patientGender: 'Male',
    scanType: 'Chest X-Ray',
    bodyRegion: 'Chest',
    status: 'Completed',
    createdAt: '2026-08-09T14:32:00Z',
    updatedAt: '2026-08-09T14:32:45Z',
    imageUrl: MOCK_CHEST_XRAY_SVG,
    thumbnailUrl: MOCK_CHEST_XRAY_SVG,
    overallPrediction: 'Right Lower Lobe Abnormal Opacity / Infiltration',
    overallConfidence: 0.914,
    modelVersion: 'MediVision-CXR v2.4.1',
    notes: 'Patient reports 4-day cough, mild fever, and shortness of breath. No previous imaging on file.',
    predictionDistribution: [
      { label: 'Focal Opacity / Consolidation', percentage: 91.4 },
      { label: 'Normal Parenchyma', percentage: 6.2 },
      { label: 'Pleural Effusion', percentage: 2.4 },
    ],
    heatmapData: {
      hotspots: [
        { x: 66, y: 60, radius: 85, intensity: 0.92, label: 'Focal Airway Consolidation' },
        { x: 30, y: 55, radius: 45, intensity: 0.25, label: 'Mild Peribronchial Thickening' },
      ],
    },
    findings: [
      {
        id: 'f-1',
        name: 'Possible Abnormal Focal Opacity',
        confidence: 0.914,
        severity: 'Moderate',
        location: 'Right lower lung zone (Retrocardiac overlay area)',
        explanation: 'AI Grad-CAM attention heatmap highlights an ill-defined density increase with silhouetting of the right hemidiaphragm.',
        clinicalSignificance: 'Consistent with focal segmental consolidation (e.g. community-acquired pneumonia). Clinical correlation with clinical symptoms and inflammatory markers recommended.',
        boundingBox: { x: 58, y: 52, width: 20, height: 18 },
      },
      {
        id: 'f-2',
        name: 'Cardiothoracic Ratio',
        confidence: 0.965,
        severity: 'Normal',
        location: 'Mediastinum',
        explanation: 'Cardiothoracic ratio measures 0.46, within expected normal range (<0.50).',
        clinicalSignificance: 'No radiographic evidence of cardiomegaly.',
        boundingBox: { x: 38, y: 45, width: 24, height: 26 },
      },
      {
        id: 'f-3',
        name: 'Costophrenic Angles',
        confidence: 0.942,
        severity: 'Normal',
        location: 'Bilateral flank base',
        explanation: 'Sharp costophrenic angles preserved bilaterally with no blunting.',
        clinicalSignificance: 'No acute pleural effusion detected.',
      },
    ],
    recommendations: [
      'Correlate findings with clinical fever, auscultation, and serum CRP/WBC counts.',
      'Consider short-term follow-up chest radiograph post antibiotic therapy if clinically indicated.',
      'This AI feature analysis is an automated screening decision-support output and must be reviewed by a certified practitioner.',
    ],
  },
  {
    id: 'scan-mri-4410',
    title: 'Brain MRI - Axial T2/FLAIR',
    patientId: 'PT-71940',
    patientAge: 42,
    patientGender: 'Female',
    scanType: 'Brain MRI',
    bodyRegion: 'Brain',
    status: 'Completed',
    createdAt: '2026-08-08T11:15:00Z',
    updatedAt: '2026-08-08T11:16:10Z',
    imageUrl: MOCK_BRAIN_MRI_SVG,
    thumbnailUrl: MOCK_BRAIN_MRI_SVG,
    overallPrediction: 'Periventricular White Matter Hyperintensity',
    overallConfidence: 0.887,
    modelVersion: 'NeuroLens-MRI v3.1.0',
    predictionDistribution: [
      { label: 'White Matter Hyperintensity', percentage: 88.7 },
      { label: 'Normal Brain Parenchyma', percentage: 9.1 },
      { label: 'Mass Effect / Tumor', percentage: 2.2 },
    ],
    heatmapData: {
      hotspots: [
        { x: 46, y: 48, radius: 60, intensity: 0.88, label: 'Periventricular FLAIR signal' },
      ],
    },
    findings: [
      {
        id: 'f-201',
        name: 'Periventricular FLAIR Signal Alteration',
        confidence: 0.887,
        severity: 'Low',
        location: 'Left periventricular anterior horn',
        explanation: 'Focal hyperintense signal patch noted adjacent to the frontal horn of the lateral ventricle.',
        clinicalSignificance: 'May reflect non-specific microvascular ischemic change or demyelinating plaque. Clinical correlation required.',
        boundingBox: { x: 42, y: 44, width: 14, height: 14 },
      },
    ],
    recommendations: [
      'Compare with prior neuroimaging if available.',
      'Neurological clinical consultation to evaluate chronic migraine or cardiovascular risk profile.',
    ],
  },
  {
    id: 'scan-knee-1209',
    title: 'Knee MRI - Sagittal PD Fat-Sat',
    patientId: 'PT-30911',
    patientAge: 29,
    patientGender: 'Male',
    scanType: 'Knee MRI',
    bodyRegion: 'Knee',
    status: 'Completed',
    createdAt: '2026-08-07T09:40:00Z',
    updatedAt: '2026-08-07T09:41:00Z',
    imageUrl: MOCK_KNEE_MRI_SVG,
    thumbnailUrl: MOCK_KNEE_MRI_SVG,
    overallPrediction: 'Posterior Horn Medial Meniscus Tear Signal',
    overallConfidence: 0.941,
    modelVersion: 'OrthoScan-AI v1.8.0',
    predictionDistribution: [
      { label: 'Meniscal Tear', percentage: 94.1 },
      { label: 'Intact Ligamentous Anatomy', percentage: 4.5 },
      { label: 'Joint Effusion Only', percentage: 1.4 },
    ],
    heatmapData: {
      hotspots: [
        { x: 62, y: 62, radius: 50, intensity: 0.94, label: 'High signal extending to articular surface' },
      ],
    },
    findings: [
      {
        id: 'f-301',
        name: 'Grade 3 Meniscal High Signal',
        confidence: 0.941,
        severity: 'High',
        location: 'Posterior horn of medial meniscus',
        explanation: 'Linear high signal intensity communicating with inferior articular surface.',
        clinicalSignificance: 'Compatible with tear of posterior horn of medial meniscus.',
        boundingBox: { x: 57, y: 58, width: 12, height: 10 },
      },
    ],
    recommendations: [
      'Orthopedic evaluation for joint stability and range of motion.',
      'Consider conservative physical therapy or arthroscopic consultation depending on mechanical locking symptoms.',
    ],
  },
  {
    id: 'scan-us-8831',
    title: 'Thyroid Ultrasound - High Resolution Transverse',
    patientId: 'PT-66102',
    patientAge: 48,
    patientGender: 'Female',
    scanType: 'Thyroid Ultrasound',
    bodyRegion: 'Neck',
    status: 'Completed',
    createdAt: '2026-08-05T16:20:00Z',
    updatedAt: '2026-08-05T16:21:05Z',
    imageUrl: MOCK_ULTRASOUND_SVG,
    thumbnailUrl: MOCK_ULTRASOUND_SVG,
    overallPrediction: 'Solid Hypoechoic Thyroid Nodule (TI-RADS 4)',
    overallConfidence: 0.895,
    modelVersion: 'UltraEcho-Thyroid v2.1',
    predictionDistribution: [
      { label: 'TI-RADS 4 Moderately Suspicious', percentage: 89.5 },
      { label: 'Benign Cystic Nodule', percentage: 8.0 },
      { label: 'Diffusely Normal Parenchyma', percentage: 2.5 },
    ],
    heatmapData: {
      hotspots: [
        { x: 39, y: 58, radius: 55, intensity: 0.9, label: 'Hypoechoic solid focus' },
      ],
    },
    findings: [
      {
        id: 'f-401',
        name: 'Solitary Hypoechoic Nodule',
        confidence: 0.895,
        severity: 'Moderate',
        location: 'Mid-zone Left Thyroid Lobe',
        explanation: 'Well-defined hypoechoic nodule measuring 1.2 x 1.1 cm with smooth margins.',
        clinicalSignificance: 'TI-RADS Category 4 feature profile.',
        boundingBox: { x: 34, y: 52, width: 14, height: 16 },
      },
    ],
    recommendations: [
      'Endocrinology review and baseline TSH laboratory assessment.',
      'Consider Fine Needle Aspiration (FNA) biopsy if nodule expands on 6-month surveillance scan.',
    ],
  },
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep-9021',
    analysisId: 'scan-cxr-9021',
    title: 'AI Assisted Chest Radiograph Diagnostic Summary',
    patientId: 'PT-88392',
    scanType: 'Chest X-Ray',
    date: '2026-08-09T14:40:00Z',
    status: 'Finalized',
    radiologistName: 'Dr. Sarah Jenkins, MD (Attending Radiologist)',
    summary: 'Single view frontal chest radiograph demonstrates focal opacity in the right lower lung field suspicious for acute inflammatory consolidation.',
    detailedFindings: '1. Lung Fields: Increased airspace density in right lower pulmonary zone. No pneumothorax. No interstitial pulmonary edema.\n2. Cardiovascular: Cardiac silhouette within normal limits (CTR 0.46). Aortic knob normal.\n3. Pleura & Bones: Costophrenic sulci clear. Intact osseous thorax.',
    impression: 'Right lower lobe focal opacity, findings most consistent with acute bacterial pneumonia.',
    recommendations: [
      'Initiate targeted empirical clinical management as per guidelines.',
      'Schedule follow-up chest radiograph in 4-6 weeks to document complete resolution.',
    ],
    disclaimer: 'This document was compiled using MediLens AI automated imaging feature extraction and must be interpreted by a licensed medical practitioner.',
  },
  {
    id: 'rep-4410',
    analysisId: 'scan-mri-4410',
    title: 'Brain MRI AI Quantitative Evaluation Report',
    patientId: 'PT-71940',
    scanType: 'Brain MRI',
    date: '2026-08-08T12:00:00Z',
    status: 'Finalized',
    radiologistName: 'Dr. Marcus Vance, MD (Neuroradiology)',
    summary: 'FLAIR hyperintensity adjacent to left frontal horn with normal brain volume and intact cerebellar structures.',
    detailedFindings: '1. Brain Parenchyma: Isolated non-expanding periventricular FLAIR signal alteration.\n2. Ventricles: Symmetrical lateral ventricles without hydrocephalus.\n3. Extra-axial spaces: Preservation of cerebral sulci.',
    impression: 'Minor non-specific periventricular white matter lesion.',
    recommendations: [
      'Follow-up imaging in 12 months if clinically indicated.',
    ],
    disclaimer: 'MediLens AI output generated for clinical workflow assistance.',
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: "Hello! I'm MediLens Assistant, your AI medical knowledge and scan interpretation companion. You can ask me to explain findings, clarify clinical terms, or summarize patient reports. How can I assist you today?",
    timestamp: '2026-08-09T10:00:00Z',
  },
];

export const MOCK_DRUGS: DrugInfo[] = [
  {
    id: 'drug-1',
    name: 'Amoxicillin Trihydrate',
    genericName: 'Amoxicillin',
    category: 'Penicillin Antibiotic',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    commonUses: [
      'Bacterial respiratory tract infections (Pneumonia, Bronchitis)',
      'Acute otitis media',
      'Skin and soft tissue infections',
    ],
    dosageGuidelines: '500 mg every 8 hours or 875 mg every 12 hours orally as prescribed by a healthcare professional.',
    warnings: [
      'Contraindicated in patients with severe penicillin allergy or history of anaphylaxis.',
      'Complete the full course of treatment even if symptoms improve early to prevent bacterial resistance.',
    ],
    sideEffects: [
      'Nausea and stomach upset',
      'Mild diarrhea',
      'Skin rash or itching',
    ],
    interactions: [
      'Methotrexate (may increase toxicity)',
      'Warfarin (may enhance anticoagulant effect)',
      'Oral contraceptives (may reduce efficacy)',
    ],
  },
  {
    id: 'drug-2',
    name: 'Metformin Hydrochloride',
    genericName: 'Metformin',
    category: 'Biguanide Antidiabetic',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60',
    commonUses: [
      'Type 2 Diabetes Mellitus glycemic management',
      'Polycystic Ovary Syndrome (off-label management)',
    ],
    dosageGuidelines: '500 mg twice daily with meals, titrating gradually as directed by endocrinologist.',
    warnings: [
      'Risk of Lactic Acidosis in patients with renal impairment (eGFR <30 mL/min).',
      'Discontinue prior to contrast media imaging procedures if eGFR is between 30 and 60 mL/min.',
    ],
    sideEffects: [
      'Gastrointestinal distress (flatulence, abdominal cramps)',
      'Metallic taste',
      'Vitamin B12 deficiency during long-term use',
    ],
    interactions: [
      'Iodinated radiocontrast agents',
      'Alcohol (increases risk of lactic acidosis)',
      'Diuretics (may alter kidney clearance)',
    ],
  },
  {
    id: 'drug-3',
    name: 'Atorvastatin Calcium',
    genericName: 'Atorvastatin',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=60',
    commonUses: [
      'Hypercholesterolemia reduction',
      'Cardiovascular event prevention (Stroke, Myocardial Infarction)',
    ],
    dosageGuidelines: '10 mg to 80 mg once daily taken orally in the evening.',
    warnings: [
      'Monitor baseline liver function tests (AST/ALT).',
      'Report unexplained muscle pain or weakness immediately (Rhabdomyolysis risk).',
    ],
    sideEffects: [
      'Myalgia and muscular ache',
      'Elevated hepatic transaminases',
      'Mild dyspepsia',
    ],
    interactions: [
      'Grapefruit juice (large quantities)',
      'Clarithromycin and erythromycin',
      'Gemfibrozil',
    ],
  },
];

export const MOCK_USER: UserProfile = {
  id: 'usr-901',
  name: 'Dr. Elena Rostova',
  email: 'elena.rostova@medilens.ai',
  role: 'Radiologist',
  hospital: 'Metropolitan University Medical Center',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
  memberSince: 'January 2025',
};

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 1420,
  totalAnalyses: 28950,
  totalReports: 24100,
  activeModels: 8,
  averageInferenceTimeMs: 412,
  systemUptimePercentage: 99.98,
};

export const MOCK_MODELS: ModelMetric[] = [
  {
    id: 'm-1',
    name: 'MediVision-CXR',
    version: 'v2.4.1',
    scanType: 'Chest X-Ray',
    status: 'Active',
    accuracy: 96.4,
    sensitivity: 95.2,
    specificity: 97.1,
    auroc: 0.982,
    totalInferences: 14500,
    lastUpdated: '2026-07-20',
  },
  {
    id: 'm-2',
    name: 'NeuroLens-MRI',
    version: 'v3.1.0',
    scanType: 'Brain MRI',
    status: 'Active',
    accuracy: 94.8,
    sensitivity: 93.9,
    specificity: 95.5,
    auroc: 0.971,
    totalInferences: 8200,
    lastUpdated: '2026-06-12',
  },
  {
    id: 'm-3',
    name: 'OrthoScan-AI',
    version: 'v1.8.0',
    scanType: 'Knee MRI',
    status: 'Active',
    accuracy: 93.2,
    sensitivity: 92.1,
    specificity: 94.0,
    auroc: 0.958,
    totalInferences: 4100,
    lastUpdated: '2026-05-30',
  },
  {
    id: 'm-4',
    name: 'UltraEcho-Thyroid',
    version: 'v2.1',
    scanType: 'Thyroid Ultrasound',
    status: 'Beta',
    accuracy: 91.5,
    sensitivity: 90.4,
    specificity: 92.2,
    auroc: 0.941,
    totalInferences: 2150,
    lastUpdated: '2026-08-01',
  },
];
