// scanner.js
function onScanSuccess(decodedText, decodedResult) {
    // decodedText is the registrationId from the QR code
    const resultDiv = document.getElementById('result');

    // Stop scanning after a successful scan to prevent multiple requests
    html5QrcodeScanner.clear(); 
    resultDiv.innerHTML = `Scanned ID: ${decodedText}. Verifying...`;

    markAttendance(decodedText);
}

async function markAttendance(registrationId) {
    const resultDiv = document.getElementById('result');
    try {
        const response = await fetch('http://localhost:3000/mark-attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registrationId: registrationId })
        });

        const data = await response.json();
        if (response.ok) {
            resultDiv.innerHTML = `<strong style="color:green;">Success!</strong> ${data.message}`;
        } else {
            resultDiv.innerHTML = `<strong style="color:red;">Error!</strong> ${data.message}`;
        }

    } catch (error) {
        resultDiv.innerHTML = 'Could not connect to the server.';
    }
}

// Initialize the scanner
var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);