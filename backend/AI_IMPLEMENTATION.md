# AI Implementation - MediLens AI

## Current AI Features

### 1. **AI Pharmacist Chatbot**
The system includes an intelligent chatbot that provides medication guidance and safety information.

**Current Implementation** (lines 187-220 in `main.py`):
- Pattern-based query matching for common medication questions
- Context-aware responses based on user profile (allergies, blood type, weight)
- Safety warnings for drug interactions and contraindications
- Schedule information and reminder management assistance

**Supported Query Types:**
- **Medication Information**: "paracetamol", "acetaminophen" → Dosage, usage, overdose warnings
- **Allergy Checks**: "penicillin", "allergy" → Cross-reference with user allergies
- **Reminders**: "remind", "schedule" → Display active medication schedules
- **Side Effects**: "side effect" → List potential adverse reactions
- **General Safety**: Default response with verification recommendations

### 2. **Medicine-Allergy Conflict Detection**
The system checks for active allergies conflicts with prescribed medicines.

**Implementation** (`models.py` line 27):
```python
active_allergies_conflict = Column(Boolean, default=False)
```

**Logic Flow**:
- User profile stores known allergies (Penicillin, Sulfa drugs, etc.)
- When medicines are added, the system flags conflicts
- Chatbot alerts users to allergy conflicts during conversation

## Backend Architecture

### Database Models

#### User Model
- Stores patient demographic data
- Tracks allergies for conflict detection
- Blood type and weight for dosage calculations

#### Medicine Model
- Complete medication information
- Side effects and warnings as comma-separated strings
- Scheduled times for reminders
- Allergy conflict flag

#### MedicationReminder Model
- Tracks medication schedule
- Monitors compliance (is_taken status)
- Timestamps for adherence analytics

#### ChatMessage Model
- Stores conversation history
- Distinguishes user vs AI messages
- Enables conversation persistence and analytics

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/user` | GET | Retrieve user profile with allergies |
| `/api/medicines` | GET/POST | List medicines or add new prescription |
| `/api/reminders` | GET/POST | Manage medication reminders |
| `/api/reminders/{id}/toggle` | PATCH | Mark reminder as taken/not taken |
| `/api/chat` | GET/POST | Retrieve chat history or send messages |

## Planned AI Enhancements

### Phase 1: Enhanced NLP Processing
**Objective**: Move beyond pattern matching to true natural language understanding

```python
# Requirements: spacy, transformers
from transformers import pipeline
from spacy.cli import download

# Intent classification
intent_classifier = pipeline("zero-shot-classification")
candidate_labels = ["medication_info", "allergy_check", "reminder", "side_effect"]
```

**Benefits**:
- Recognize user intent even with varied phrasing
- Better context retention across conversation
- Multi-intent queries (e.g., "Tell me about paracetamol and its allergies")

### Phase 2: Machine Learning for Drug Interactions
**Objective**: Implement real drug-drug interaction checking using ML models

**Data Source Integration**:
- FDA drug interaction database
- RxNorm API for standardized drug names
- Medical ontologies (SNOMED CT, UMLS)

```python
# Pseudo-code for ML-based interaction detection
class DrugInteractionPredictor:
    def __init__(self, model_path):
        self.model = load_trained_model(model_path)
    
    def predict_interaction(self, drug1: str, drug2: str) -> InteractionResult:
        embedding1 = get_drug_embedding(drug1)
        embedding2 = get_drug_embedding(drug2)
        interaction_score = self.model.predict([embedding1, embedding2])
        return InteractionResult(score=interaction_score)
```

### Phase 3: Medical Image Analysis (Core MediLens Feature)
**Objective**: Implement AI-powered medical image classification and analysis

**Technologies**:
- TensorFlow/PyTorch for deep learning
- Pre-trained models (MobileNet, ResNet50)
- DICOM image processing

```python
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image as keras_image

class MedicalImageAnalyzer:
    def __init__(self):
        # Load pre-trained medical imaging model
        self.model = MobileNetV2(weights='imagenet')
        self.preprocessor = keras_image.ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2
        )
    
    def analyze_prescription_image(self, image_path: str) -> AnalysisResult:
        """Analyze prescription/medicine label image"""
        img = keras_image.load_img(image_path, target_size=(224, 224))
        x = keras_image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        predictions = self.model.predict(x)
        
        return AnalysisResult(
            detected_medicines=extract_medicines(predictions),
            confidence_scores=predictions,
            recommendations=generate_safety_recommendations(predictions)
        )
```

**Use Cases**:
- Prescription OCR (Optical Character Recognition)
- Medicine label analysis
- Dosage verification
- Expiry date detection

### Phase 4: Personalized Medicine Recommendations
**Objective**: ML-based personalized medication suggestions

**Algorithm Approach**:
- Collaborative filtering (similar patient profiles)
- Content-based filtering (medication properties)
- Hybrid models combining both approaches

```python
class PersonalizedMedicineRecommender:
    def __init__(self, user_history_db, medicine_properties_db):
        self.user_history = user_history_db
        self.medicine_properties = medicine_properties_db
    
    def get_recommendations(self, user_id: int, top_k: int = 5) -> List[Medicine]:
        # Get user's medical history
        user_profile = self.get_user_profile(user_id)
        
        # Find similar users
        similar_users = self.find_similar_users(user_profile)
        
        # Get medicines used by similar users
        candidate_medicines = self.get_candidate_medicines(similar_users)
        
        # Rank by relevance to user's conditions
        scored_medicines = self.rank_by_relevance(candidate_medicines, user_profile)
        
        return scored_medicines[:top_k]
```

### Phase 5: Real-time Adherence Analytics & Predictive Alerts
**Objective**: ML models to predict non-adherence and generate proactive alerts

```python
class AdherencePredictionModel:
    def predict_non_adherence_risk(self, user_id: int) -> float:
        """
        Returns adherence risk score (0.0 - 1.0)
        1.0 = High risk of missing medications
        """
        user_history = self.fetch_reminder_history(user_id)
        features = self.extract_features(user_history)
        risk_score = self.ml_model.predict(features)
        return risk_score
    
    def generate_alert(self, user_id: int, risk_score: float):
        if risk_score > 0.7:
            alert = Alert(
                user_id=user_id,
                message="You've missed doses lately. Would you like to adjust your reminder times?",
                severity="HIGH"
            )
            self.send_push_notification(alert)
```

### Phase 6: Integration with Medical APIs
**Objective**: Connect to real healthcare data sources

**Possible Integrations**:
- **FHIR (Fast Healthcare Interoperability Resources)**: Standard medical data format
- **HL7**: Healthcare data exchange protocol
- **OpenAI API**: Enhanced conversational AI for medical queries
- **Medical Knowledge Bases**: UpToDate, DailyMed API

```python
# Example: FHIR integration
from fhirclient import client

class FHIRIntegration:
    def __init__(self, server_url):
        self.settings = {
            'app_id': 'medilens-ai',
            'app_pw': 'your-password',
            'api_base': server_url
        }
        self.smart = client.FHIRClient(settings=self.settings)
    
    def get_patient_medications(self, patient_id: str):
        """Fetch real medications from FHIR-compliant EHR"""
        med_request = MedicationRequest.read(patient_id, self.smart.server)
        return med_request.entry
```

## Implementation Roadmap

| Phase | Timeline | Priority | Status |
|-------|----------|----------|--------|
| Enhanced NLP | Weeks 1-2 | HIGH | ⏳ Planned |
| Drug Interactions ML | Weeks 3-4 | HIGH | ⏳ Planned |
| Medical Image Analysis | Weeks 5-8 | CRITICAL | ⏳ Planned |
| Personalized Recommendations | Weeks 9-10 | MEDIUM | ⏳ Planned |
| Adherence Prediction | Weeks 11-12 | MEDIUM | ⏳ Planned |
| Medical API Integration | Weeks 13+ | LOW | ⏳ Planned |

## Required Dependencies

```
# For enhanced NLP
spacy==3.7.2
transformers==4.35.0
torch==2.1.0

# For medical imaging
tensorflow==2.14.0
opencv-python==4.8.0
pillow==10.1.0

# For ML models
scikit-learn==1.3.2
numpy==1.24.3
pandas==2.1.1

# For medical standards
fhirclient==4.1.0

# Existing dependencies
fastapi==0.104.1
sqlalchemy==2.0.23
```

## Security & Privacy Considerations

1. **HIPAA Compliance**: All patient data encrypted at rest and in transit
2. **Data Anonymization**: Remove PII from training data for ML models
3. **Model Validation**: Ensure AI predictions don't replace professional medical advice
4. **Audit Logging**: Track all AI-generated recommendations and user interactions
5. **Consent Management**: Explicit user consent for data usage in ML training

## Testing Strategy

- Unit tests for each AI module
- Integration tests with mock medical data
- Performance benchmarks for image processing
- Accuracy validation against medical literature
- User acceptance testing with healthcare professionals

## References

- [FDA Drug Interactions Database](https://www.fda.gov/drugs)
- [RxNorm API Documentation](https://www.nlm.nih.gov/research/umls/rxnorm/)
- [FHIR Standard](https://www.hl7.org/fhir/)
- [TensorFlow Medical Imaging](https://www.tensorflow.org/hub/tutorials)
