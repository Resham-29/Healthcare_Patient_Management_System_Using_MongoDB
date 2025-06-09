require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');

// Define the Patient Schema (MUST match the one in server.js)
const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    contactInfo: { type: String },
    allergies: [String],
    medicalHistory: [{ // Structured medical history
        condition: String,
        diagnosisDate: { type: Date, default: Date.now },
        notes: String
    }],
    currentPrescriptions: [{ // Structured prescriptions
        medication: String,
        dosage: String,
        startDate: { type: Date, default: Date.now },
        endDate: Date
    }],
    doctorNotes: [String],
    appointmentLogs: [{ // Structured appointment logs
        date: { type: Date, default: Date.now },
        reason: String,
        doctor: String
    }],
    department: { type: String }, // New department field
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

// Sample Patient Data (10 patients with structured data)
const samplePatients = [
    {
        patientId: 'P001',
        name: 'Alice Johnson',
        age: 35,
        gender: 'Female',
        bloodGroup: 'A+',
        contactInfo: 'alice.j@example.com',
        allergies: ['Pollen', 'Dust'],
        medicalHistory: [
            { condition: 'Seasonal Allergies', diagnosisDate: new Date('2020-03-15'), notes: 'Controlled with antihistamines.' },
            { condition: 'Mild Asthma', diagnosisDate: new Date('2021-09-01'), notes: 'Uses inhaler as needed.' }
        ],
        currentPrescriptions: [
            { medication: 'Fexofenadine', dosage: '180mg daily', startDate: new Date('2024-03-01'), endDate: new Date('2024-09-30') }
        ],
        doctorNotes: ['Review next season'],
        appointmentLogs: [
            { date: new Date('2024-05-10'), reason: 'Follow-up', doctor: 'Dr. Smith' },
            { date: new Date('2024-06-05'), reason: 'Acute Asthma Exacerbation', doctor: 'Dr. Jones' }
        ],
        department: 'Pulmonology'
    },
    {
        patientId: 'P002',
        name: 'Bob Williams',
        age: 50,
        gender: 'Male',
        bloodGroup: 'O-',
        contactInfo: 'bob.w@example.com',
        allergies: ['Penicillin'],
        medicalHistory: [
            { condition: 'Hypertension', diagnosisDate: new Date('2010-11-20'), notes: 'Managed with medication.' },
            { condition: 'Hypercholesterolemia', diagnosisDate: new Date('2015-07-01'), notes: 'Requires dietary management.' }
        ],
        currentPrescriptions: [
            { medication: 'Lisinopril', dosage: '10mg daily', startDate: new Date('2023-01-01'), endDate: null },
            { medication: 'Atorvastatin', dosage: '20mg daily', startDate: new Date('2023-01-01'), endDate: null }
        ],
        doctorNotes: ['Regular check-up required'],
        appointmentLogs: [
            { date: new Date('2024-04-20'), reason: 'Routine check-up', doctor: 'Dr. Smith' },
            { date: new Date('2024-06-15'), reason: 'Blood Pressure Review', doctor: 'Dr. Smith' }
        ],
        department: 'Cardiology'
    },
    {
        patientId: 'P003',
        name: 'Charlie Brown',
        age: 28,
        gender: 'Male',
        bloodGroup: 'B+',
        contactInfo: 'charlie.b@example.com',
        allergies: [],
        medicalHistory: [],
        currentPrescriptions: [],
        doctorNotes: ['Annual physical done'],
        appointmentLogs: [
            { date: new Date('2024-01-10'), reason: 'Annual Physical', doctor: 'Dr. Jones' }
        ],
        department: 'General Practice'
    },
    {
        patientId: 'P004',
        name: 'Diana Prince',
        age: 42,
        gender: 'Female',
        bloodGroup: 'AB+',
        contactInfo: 'diana.p@example.com',
        allergies: ['Shellfish'],
        medicalHistory: [
            { condition: 'Migraines', diagnosisDate: new Date('2018-05-01'), notes: 'Sporadic, triggered by stress.' }
        ],
        currentPrescriptions: [
            { medication: 'Sumatriptan', dosage: '50mg as needed', startDate: new Date('2023-06-01'), endDate: null }
        ],
        doctorNotes: ['Avoid triggers'],
        appointmentLogs: [
            { date: new Date('2024-02-01'), reason: 'Migraine consultation', doctor: 'Dr. Chang' }
        ],
        department: 'Neurology'
    },
    {
        patientId: 'P005',
        name: 'Eve Adams',
        age: 65,
        gender: 'Female',
        bloodGroup: 'O+',
        contactInfo: 'eve.a@example.com',
        allergies: [],
        medicalHistory: [
            { condition: 'Osteoarthritis', diagnosisDate: new Date('2005-01-01'), notes: 'Knee pain.' },
            { condition: 'Type 2 Diabetes', diagnosisDate: new Date('2022-03-10'), notes: 'Early stage, dietary management.' }
        ],
        currentPrescriptions: [
            { medication: 'Metformin', dosage: '500mg daily', startDate: new Date('2022-03-15'), endDate: null }
        ],
        doctorNotes: ['Monitor blood sugar'],
        appointmentLogs: [
            { date: new Date('2024-03-01'), reason: 'Diabetes review', doctor: 'Dr. Evans' },
            { date: new Date('2024-05-25'), reason: 'Joint pain check', doctor: 'Dr. Evans' }
        ],
        department: 'Endocrinology'
    },
    {
        patientId: 'P006',
        name: 'Frank Miller',
        age: 12,
        gender: 'Male',
        bloodGroup: 'A-',
        contactInfo: 'frank.m@example.com',
        allergies: ['Peanuts'],
        medicalHistory: [
            { condition: 'Childhood Asthma', diagnosisDate: new Date('2018-02-01'), notes: 'Well controlled.' }
        ],
        currentPrescriptions: [
            { medication: 'Albuterol', dosage: 'As needed', startDate: new Date('2023-01-01'), endDate: null }
        ],
        doctorNotes: ['Emergency inhaler prescribed'],
        appointmentLogs: [
            { date: new Date('2024-04-05'), reason: 'Asthma review', doctor: 'Dr. Peterson' }
        ],
        department: 'Pediatrics'
    },
    {
        patientId: 'P007',
        name: 'Grace Taylor',
        age: 70,
        gender: 'Female',
        bloodGroup: 'B-',
        contactInfo: 'grace.t@example.com',
        allergies: [],
        medicalHistory: [
            { condition: 'Osteoporosis', diagnosisDate: new Date('2010-01-01'), notes: 'Taking calcium supplements.' },
            { condition: 'Congestive Heart Failure', diagnosisDate: new Date('2019-08-15'), notes: 'Stable condition.' }
        ],
        currentPrescriptions: [
            { medication: 'Furosemide', dosage: '20mg daily', startDate: new Date('2023-01-01'), endDate: null }
        ],
        doctorNotes: ['Cardiology follow-up annually'],
        appointmentLogs: [
            { date: new Date('2024-01-20'), reason: 'Cardiology review', doctor: 'Dr. Smith' }
        ],
        department: 'Cardiology'
    },
    {
        patientId: 'P008',
        name: 'Henry Wilson',
        age: 22,
        gender: 'Male',
        bloodGroup: 'A+',
        contactInfo: 'henry.w@example.com',
        allergies: [],
        medicalHistory: [
            { condition: 'Knee Ligament Sprain', diagnosisDate: new Date('2023-07-01'), notes: 'Fully recovered after physical therapy.' }
        ],
        currentPrescriptions: [],
        doctorNotes: ['Physiotherapy completed'],
        appointmentLogs: [
            { date: new Date('2023-12-01'), reason: 'Post-PT check', doctor: 'Dr. Green' }
        ],
        department: 'Orthopedics'
    },
    {
        patientId: 'P009',
        name: 'Ivy Scott',
        age: 30,
        gender: 'Female',
        bloodGroup: 'O+',
        contactInfo: 'ivy.s@example.com',
        allergies: [],
        medicalHistory: [
            { condition: 'Iron Deficiency Anemia', diagnosisDate: new Date('2021-04-10'), notes: 'Controlled with supplements.' }
        ],
        currentPrescriptions: [
            { medication: 'Iron Sulfate', dosage: '325mg daily', startDate: new Date('2021-04-15'), endDate: null }
        ],
        doctorNotes: ['Iron supplements continued'],
        appointmentLogs: [
            { date: new Date('2024-02-14'), reason: 'Anemia review', doctor: 'Dr. Evans' }
        ],
        department: 'Hematology'
    },
    {
        patientId: 'P010',
        name: 'Jack King',
        age: 55,
        gender: 'Male',
        bloodGroup: 'AB-',
        contactInfo: 'jack.k@example.com',
        allergies: ['Dust Mites'],
        medicalHistory: [
            { condition: 'Chronic Sinusitis', diagnosisDate: new Date('2017-11-01'), notes: 'Recurrent infections.' }
        ],
        currentPrescriptions: [
            { medication: 'Fluticasone Nasal Spray', dosage: '2 sprays daily', startDate: new Date('2024-01-01'), endDate: null }
        ],
        doctorNotes: ['Referral to ENT'],
        appointmentLogs: [
            { date: new Date('2024-03-20'), reason: 'Sinusitis consultation', doctor: 'Dr. Peterson' }
        ],
        department: 'ENT'
    },
];

async function seedDatabase() {
    console.log('Starting database seeding...');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding.');

        // Clear existing data to avoid duplicates with structured fields, but only if you want a fresh start
        // WARNING: This will delete ALL existing patient data in your database!
        // console.log('Clearing existing patient data...');
        // await Patient.deleteMany({});
        // console.log('Existing patient data cleared.');

        let insertedCount = 0;
        let skippedCount = 0;

        for (const patientData of samplePatients) {
            try {
                // Check if patient already exists by patientId
                const existingPatient = await Patient.findOne({ patientId: patientData.patientId });

                if (existingPatient) {
                    console.log(`Patient with ID ${patientData.patientId} already exists. Skipping.`);
                    skippedCount++;
                } else {
                    const newPatient = new Patient(patientData);
                    await newPatient.save();
                    console.log(`Inserted patient: ${newPatient.name} (${newPatient.patientId})`);
                    insertedCount++;
                }
            } catch (error) {
                console.error(`Error inserting patient ${patientData.patientId}:`, error.message);
            }
        }

        console.log(`\nSeeding complete!`);
        console.log(`Total patients inserted: ${insertedCount}`);
        console.log(`Total patients skipped (already existed): ${skippedCount}`);

    } catch (err) {
        console.error('Error during seeding process:', err);
    } finally {
        // Disconnect from MongoDB after seeding
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

seedDatabase(); // Execute the seeding function
