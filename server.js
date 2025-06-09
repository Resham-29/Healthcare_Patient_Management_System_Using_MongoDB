// 1. Load environment variables and import necessary modules
require('dotenv').config(); // Loads MONGO_URI and JWT_SECRET from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JSON Web Tokens

// 2. Initialize Express application and define the port
const app = express();
const PORT = process.env.PORT || 8001; // Ensure this is consistent with your frontend API_BASE_URL

// 3. Configure Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors({
    origin: '*', // Allows requests from any origin (DEVELOPMENT ONLY!)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods for CORS requests
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
}));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// 4. MongoDB Connection
// Connect to MongoDB using Mongoose. The connection string is loaded from the .env file.
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// 5. Define Schemas and Models

// User Schema for Authentication
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'nurse', 'receptionist'], default: 'receptionist' } 
}, { timestamps: true });

// Hash password before saving to database for security
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

// Patient Schema (isDeleted field removed)
const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    department: { type: String },
    contactInfo: { type: String },
    allergies: [String],
    medicalHistory: [{ // Embedded array of objects for medical conditions
        condition: String,
        diagnosisDate: Date,
        notes: String
    }],
    currentPrescriptions: [{ // Embedded array of objects for current medications
        medication: String,
        dosage: String,
        startDate: Date,
        endDate: Date
    }],
    doctorNotes: [String], // Array of strings for doctor's notes
    appointmentLogs: [{ // Embedded array of objects for appointment history
        date: Date,
        reason: String,
        doctor: String
    }],
    appointmentReminders: [{ // Array of objects for appointment reminders
        reminderDate: Date,
        reminderNotes: String
    }]
}, { timestamps: true }); // No 'isDeleted' field
const Patient = mongoose.model('Patient', patientSchema);

// --- 6. Authentication Middleware ---
// This middleware checks for a valid JWT in the Authorization header.
function authenticateToken(req, res, next) {
    // Get token from header (usually 'Bearer TOKEN')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        // If no token is provided, respond with 401 Unauthorized
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            // If token is invalid or expired, respond with 403 Forbidden
            console.error('JWT verification error:', err);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user; // Attach user payload (id, username, role) to the request
        next(); // Proceed to the next middleware/route handler
    });
}

// JWT Secret from environment variables
const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';


// --- 7. Authentication Routes ---

// Register User: Allows new users to create an account.
app.post('/api/auth/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user instance (password hashing is handled by pre-save hook in schema)
        user = new User({ username, password, role }); // Schema's pre-save hook will hash this
        await user.save(); // Save the new user

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

// Login User: Authenticates existing users and provides a JWT.
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Create and send JWT upon successful login
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully!', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// 8. Protected Patient API Routes (Authentication middleware applied directly) 

// Route 1: Add a New Patient Record (POST request)
app.post('/api/patients', authenticateToken, async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json(newPatient); // 201 Created
    } catch (error) {
        console.error('Error adding patient:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Patient ID already exists.' });
        }
        res.status(500).json({ message: 'Error adding patient record', error: error.message });
    }
});

// Route 2: Get All Patient Records (GET request)
app.get('/api/patients', authenticateToken, async (req, res) => {
    try {
        const { search, patientId, minAge, maxAge, gender, department } = req.query;

        let query = {}; // No 'isDeleted' filter

        if (patientId) {
            query.patientId = patientId; // Search by exact patientId
        } else if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { patientId: { $regex: search, $options: 'i' } } // Also search by patientId if a general search query is given
            ];
        }

        if (minAge) query.age = { ...query.age, $gte: parseInt(minAge) };
        if (maxAge) query.age = { ...query.age, $lte: parseInt(maxAge) };
        if (gender) query.gender = gender;
        if (department) query.department = { $regex: department, $options: 'i' };

        const patients = await Patient.find(query).limit(10); // Limit results for efficiency
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error searching patients:', error);
        res.status(500).json({ message: 'Error searching patient records', error: error.message });
    }
});

// Route 3: Get a Single Patient by ID (GET request)
app.get('/api/patients/:patientId', authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await Patient.findOne({ patientId: patientId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error('Error fetching single patient:', error);
        res.status(500).json({ message: 'Error fetching patient record', error: error.message });
    }
});

// Route 4: Update Patient Record (PUT request)
app.put('/api/patients/:patientId', authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.params;
        // Destructure to omit 'patientId' from the update payload
        const { patientId: omittedPatientId, ...updateData } = req.body;

        const updatedPatient = await Patient.findOneAndUpdate(
            { patientId: patientId }, // Find the patient by their current patientId
            { $set: updateData }, // Apply the updates from the request body
            { new: true, runValidators: true } // Return the updated document, run Mongoose validators
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        res.status(200).json(updatedPatient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ message: 'Error updating patient record', error: error.message });
    }
});

// Route 5: Permanently Delete Patient Record (DELETE request - now the standard delete)
app.delete('/api/patients/:patientId', authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.params;
        const deletedPatient = await Patient.findOneAndDelete({ patientId: patientId }); // No 'isDeleted: true' condition

        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found or already deleted.' });
        }
        res.status(200).json({ message: 'Patient record permanently deleted successfully.' });
    } catch (error) {
        console.error('Error permanently deleting patient:', error);
        res.status(500).json({ message: 'Error permanently deleting patient record', error: error.message });
    }
});


// 9. Analytics API Routes (Protected by Authentication) 
// All analytics routes now operate on all patients, as there is no 'isDeleted' concept.

// Get patients per condition
app.get('/api/analytics/conditions', authenticateToken, async (req, res) => {
    try {
        const conditions = await Patient.aggregate([
            { $unwind: '$medicalHistory' },
            { $group: {
                _id: '$medicalHistory.condition',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);
        res.status(200).json(conditions);
    } catch (error) {
        console.error('Error fetching conditions analytics:', error);
        res.status(500).json({ message: 'Error fetching conditions analytics', error: error.message });
    }
});

// Get most prescribed medications
app.get('/api/analytics/prescriptions', authenticateToken, async (req, res) => {
    try {
        const prescriptions = await Patient.aggregate([
            { $unwind: '$currentPrescriptions' },
            { $group: {
                _id: '$currentPrescriptions.medication',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);
        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions analytics:', error);
        res.status(500).json({ message: 'Error fetching prescriptions analytics', error: error.message });
    }
});

// Get average age per department
app.get('/api/analytics/avg-age-per-department', authenticateToken, async (req, res) => {
    try {
        const avgAgePerDepartment = await Patient.aggregate([
            { $match: { department: { $ne: null, $ne: '' } } }, // Only patients with a department
            { $group: {
                _id: '$department',
                averageAge: { $avg: '$age' },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(avgAgePerDepartment);
    } catch (error) {
        console.error('Error fetching average age per department analytics:', error);
        res.status(500).json({ message: 'Error fetching average age per department analytics', error: error.message });
    }
});

// Get visits per month
app.get('/api/analytics/visits-per-month', authenticateToken, async (req, res) => {
    try {
        const visitsPerMonth = await Patient.aggregate([
            { $unwind: '$appointmentLogs' },
            { $group: {
                _id: {
                    year: { $year: '$appointmentLogs.date' },
                    month: { $month: '$appointmentLogs.date' }
                },
                count: { $sum: 1 }
            }},
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.status(200).json(visitsPerMonth);
    } catch (error) {
        console.error('Error fetching visits per month analytics:', error);
        res.status(500).json({ message: 'Error fetching visits per month analytics', error: error.message });
    }
});


// 10. To Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
