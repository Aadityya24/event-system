
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const resultDiv = document.getElementById('result');
    const qrCodeDiv = document.getElementById('qrCode');


    resultDiv.innerHTML = '';
    qrCodeDiv.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `Registration successful! Your ID is: <strong>${data.registrationId}</strong>`;
            
            new QRCode(qrCodeDiv, {
                text: data.registrationId,
                width: 128,
                height: 128
            });
        } else {
            resultDiv.innerHTML = `Error: ${data.message}`;
        }
    } catch (error) {
        resultDiv.innerHTML = `Error: Could not connect to the server.`;
        console.error('Fetch error:', error);
    }
});