// admin.js
async function fetchAttendance() {
    try {
        const response = await fetch('http://localhost:3000/attendees');
        const attendees = await response.json();
        const tableBody = document.querySelector('#attendanceTable tbody');

        // Clear existing rows
        tableBody.innerHTML = ''; 

        attendees.forEach(attendee => {
            const row = `
                <tr>
                    <td>${attendee.name}</td>
                    <td>${attendee.email}</td>
                    <td style="color: ${attendee.status === 'Attended' ? 'green' : 'orange'};">${attendee.status}</td>
                    <td>${attendee.timestamp || 'N/A'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('Failed to fetch attendance:', error);
    }
}

// Fetch data every 3 seconds to simulate "live" tracking
setInterval(fetchAttendance, 3000);

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchAttendance);