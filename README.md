# Event Registration & Attendance System 🎟️

A simple, full-stack web application to manage event registrations and track attendance using QR codes. This project was built with Node.js, Express, and SQLite on the backend, and plain HTML, CSS, and JavaScript on the frontend.



---

## ✨ Features

* **User Registration:** A clean form for participants to register with their name and email.
* **Unique QR Code Generation:** Automatically generates a unique QR code for each registered participant.
* **Web-Based QR Scanner:** An attendance marking page that uses the device's camera to scan QR codes.
* **Real-time Attendance Tracking:** An admin dashboard that displays attendance status live as participants are scanned in.
* **Duplicate Prevention:** The backend logic prevents the same participant from being marked as "Attended" more than once.
* **Data Export:** A one-click option on the admin dashboard to download the complete attendance list as an Excel (`.xlsx`) file.

---

## 💻 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** SQLite
* **Frontend:** HTML, CSS, JavaScript (no frameworks)
* **Key Libraries:**
    * `express`: Web server framework
    * `sqlite3`: Database driver
    * `cors`: Cross-Origin Resource Sharing middleware
    * `exceljs`: Excel file generation
    * `qrcode.js`: Frontend QR code generation
    * `html5-qrcode`: Frontend QR code scanning

---

## 🚀 How to Run Locally

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

* Node.js installed on your machine.

### **Installation & Setup**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/event-system.git](https://github.com/YOUR_USERNAME/event-system.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd event-system
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Start the server:**
    ```bash
    node server.js
    ```
5.  **Access the application:**
    * Registration Page: `http://localhost:3000/index.html`
    * Scanner Page: `http://localhost:3000/scanner.html`
    * Admin Dashboard: `http://localhost:3000/admin.html`