// Import the Express library
const express = require('express');

// Create an instance of an Express application
const app = express();

// Tell Express to automatically parse JSON in request bodies
app.use(express.json());

// Define the port your server will run on
// Using 3004 for "Subproject 4" is a good way to avoid conflicts
const PORT = 3004;

// --- Your NEW "Home Page" Route ---
// This handles the browser's "GET /" request
app.get('/', (req, res) => {
  res.status(200).send('<h1>Subproject 4: Payments Backend</h1><p>The server is running! Please use Postman to test the /api/v1/payments endpoint.</p>');
});

// --- Your Mock API Endpoint ---
// This is the "contract" your team agreed on
app.post('/api/v1/payments', (req, res) => {
  // We can see the data other teams send us in the console
  console.log('Received payment request:');
  console.log(req.body);

  const { userId, amount, currency, orderId } = req.body;

  // --- Mock Logic ---
  // For now, just pretend it worked.
  // We don't need a real payment gateway for the prototype.

  if (!userId || !amount) {
    // Send an error if required data is missing
    return res.status(400).json({
      status: "error",
      message: "Missing userId or amount"
    });
  }

  // Send a fake "success" response
  res.status(200).json({
    transactionId: `fake-txn-${Date.now()}`,
    status: "success",
    message: "Payment processed successfully (MOCK DATA)",
    receivedData: req.body 
  });
});

// Start the server and listen for connections
app.listen(PORT, () => {
  console.log(`Subproject 4 (Payments) mock server is running on http://localhost:${PORT}`);
});