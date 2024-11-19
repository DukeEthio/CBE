const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');

const app = express();
app.use(bodyParser.json());

// Basic authentication middleware
const auth = (req, res, next) => {
    const user = basicAuth(req);
    if (!user || user.name !== 'admin' || user.pass !== 'password') {
        res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};

// Dummy data for students and their fee details
const students = [
    { id: 1, name: "Abrham", feeAmount: 1000, paymentStatus: false, paymentDate: null },
    { id: 2, name: "Mekuriaw", feeAmount: 1200, paymentStatus: false, paymentDate: null },
    { id: 3, name: "Gashu", feeAmount: 1500, paymentStatus: false, paymentDate: null },
    { id: 4, name: "Nebyou", feeAmount: 1200, paymentStatus: false, paymentDate: null },
    { id: 5, name: "Soresa", feeAmount: 1000, paymentStatus: false, paymentDate: null },
    { id: 6, name: "Hundie", feeAmount: 1200, paymentStatus: false, paymentDate: null },
    { id: 7, name: "Duke Backup", feeAmount: 900, paymentStatus: false, paymentDate: null },
];

// School account information
const schoolAccount = {
    accountNo: '12345',
    balance: 2000
};

// Penalty rate (can be fixed amount or percentage)
const PENALTY_RATE = 0.1; // 10% penalty

// Apply auth middleware to all routes that require authentication
app.use('/api', auth);

// Endpoint to retrieve a list of students
app.get('/api/students', (req, res) => {
    res.json(students);
});

// Endpoint to retrieve a specific student's fee details
app.get('/api/student/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).json({ error: 'There is no student named by that ID' });
    }

    if (student.paymentStatus) {
        res.json({
            message: 'Payment successfully processed',
            student: student,
        });
    } else {
        res.json({
            message: 'Not paid',
            student: student,
        });
    }
});

// Endpoint to get the current balance of the school's account
app.get('/api/school/balance', (req, res) => {
    res.json({
        accountNo: schoolAccount.accountNo,
        balance: schoolAccount.balance,
        currency: 'Birr'
    });
});

// Simulate a successful payment (without Stripe)
app.post('/api/payment/create', async (req, res) => {
    const { studentId, paymentAmount, payeeName } = req.body;
    
    // Find the student by ID
    const student = students.find(s => s.id === studentId);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the provided payment amount matches the student's fee
    if (paymentAmount < student.feeAmount) {
        return res.status(400).json({ error: `Payment amount must be at least ${student.feeAmount} Birr` });
    }

    // Check if the school has enough balance to process payment
    if (schoolAccount.balance < paymentAmount) {
        return res.status(400).json({ error: 'Insufficient funds in school account' });
    }

    // Calculate penalty if the payment is late (for simplicity, assume payments after the 15th of the month are late)
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 15); // Payment due by the 15th of the month

    let penaltyAmount = 0;

    // If the payment is made after the due date, apply the penalty
    if (today > dueDate) {
        penaltyAmount = student.feeAmount * PENALTY_RATE;
    }

    // Total amount to be paid including the penalty
    const totalAmount = student.feeAmount + penaltyAmount;

    // Check if the provided paymentAmount is sufficient to cover both fee and penalty
    if (paymentAmount < totalAmount) {
        return res.status(400).json({ error: `Payment amount must be at least ${totalAmount} Birr (including penalty)` });
    }

    // Deduct the fee (and possibly penalty) from the school account balance
    schoolAccount.balance -= totalAmount;

    // Update the student's payment status and date
    student.paymentStatus = true;
    student.paymentDate = today.toISOString();

    // Record the date of the payment
    const paymentDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    try {
        const paymentResponse = {
            status: 'succeeded',
            message: `Payment for ${student.name} was successful`,
            studentName: student.name,
            payeeName: payeeName,  // Include the name of the person making the payment
            amount: student.feeAmount,
            penaltyAmount: penaltyAmount,
            totalAmount: totalAmount,
            currency: 'Birr',
            paymentDate: paymentDate
        };

        console.log(JSON.stringify({
            message: 'Payment successful',
            paymentResponse: paymentResponse,
        }, null, 2));

        // Send back a simulated success response
        res.status(200).json({
            message: 'Payment successful',
            paymentResponse: paymentResponse,
        });
       
    } catch (error) {
        res.status(400).json({ error: 'Simulated payment failed' });
    }
});

// Start the server
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
