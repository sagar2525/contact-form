const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
// Import dotenv and Gemini
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Express app
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Middleware Setup
// Enabling CORS so frontend (port 5173) can talk to backend (port 3000)
app.use(cors());
// Parsing incoming JSON requests
app.use(bodyParser.json());

// ------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------

// Function to read data from the JSON file
// This acts like a simple database query
const readData = () => {
    try {
        // If file doesn't exist, return empty list
        if (!fs.existsSync(DATA_FILE)) {
            return { submissions: [] };
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data:", error);
        return { submissions: [] };
    }
};

// Function to write data to the JSON file
// We use this to save new submissions or updates
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing data:", error);
    }
};

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

// POST /api/contact
// Description: Receives form data and saves it to the file
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    const errors = {};

    // 1. Server-Side Validation
    // We validate here again to be safe even if client validation fails
    if (!name || name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = "Invalid email format.";
    }

    const validSubjects = [
        "General Inquiry",
        "Technical Support",
        "Feedback",
        "Partnership",
        "Other"
    ];
    if (!subject || !validSubjects.includes(subject)) {
        errors.subject = "Invalid subject selection.";
    }

    if (!message || message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters.";
    }

    // If there are errors, return 400 Bad Request
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    // 2. Save Data
    const currentData = readData();

    // Auto-increment ID logic: Find max ID and add 1
    const newId = currentData.submissions.length > 0
        ? Math.max(...currentData.submissions.map(s => s.id)) + 1
        : 1;

    const newSubmission = {
        id: newId,
        name,
        email,
        subject,
        message,
        status: 'new', // New tickets are 'new' by default
        createdAt: new Date().toISOString()
    };

    currentData.submissions.push(newSubmission);
    writeData(currentData);

    // Return success response
    res.status(201).json({
        id: newSubmission.id,
        message: "Thank you for your message!"
    });
});

// GET /api/contact
// Description: Returns all submissions for the Admin Panel
app.get('/api/contact', (req, res) => {
    const data = readData();
    // Sort submissions so the newest ones appear first
    const sortedSubmissions = data.submissions.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ submissions: sortedSubmissions });
});

// PATCH /api/contact/:id/resolve
// Description: Marks a ticket as 'resolved'
app.patch('/api/contact/:id/resolve', (req, res) => {
    const { id } = req.params;
    const data = readData();

    // Find the submission by ID
    const submission = data.submissions.find(s => s.id === parseInt(id));

    if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
    }

    // Update status
    submission.status = 'resolved';
    writeData(data);

    res.json({ message: "Submission resolved", submission });
});

// DELETE /api/contact/:id
// Description: Permanently removes a submission
app.delete('/api/contact/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const initialLength = data.submissions.length;

    // Filter out the submission with the given ID
    data.submissions = data.submissions.filter(s => s.id !== parseInt(id));

    if (data.submissions.length === initialLength) {
        return res.status(404).json({ message: "Submission not found" });
    }

    writeData(data);
    res.json({ message: "Submission deleted" });
});

// POST /api/ai-reply
// Description: Uses Gemini to generate a quick reply
app.post('/api/ai-reply', async (req, res) => {
    const { name, subject, message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Server missing API Key." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
        You are a helpful support agent for a Contact Form application.
        Draft a polite, professional, and concise email reply to the following user inquiry.
        
        User Name: ${name}
        Subject: ${subject}
        Message: "${message}"
        
        The reply should:
        1. Thank them for contacting us.
        2. Address their specific message.
        3. Be ready to copy-paste (no placeholders).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate AI reply." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
