# Healthcare Patient Management System

## Project Overview

A full-stack web application designed for efficient management of patient records in a healthcare setting. This system allows for secure user authentication, comprehensive patient data management (Create, Read, Update, Delete), advanced searching and filtering, detailed medical record keeping (history, prescriptions, appointments), and insightful analytics dashboard.

**Technologies Used:**
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Frontend:** Vanilla HTML, CSS (Tailwind CSS via CDN), JavaScript
* **Authentication:** JWT (JSON Web Tokens), bcryptjs (password hashing)

## Features

* **User Authentication:** Secure login and registration for different roles (e.g., Receptionist, Doctor, Nurse, Admin).
* **Patient Management (CRUD):** Add, view, update, and delete patient records.
* **Advanced Search & Filtering:** Efficiently find patients by ID, name, age range, gender, or department.
* **Detailed Patient Profiles:** Store comprehensive information including contact, allergies, medical history (conditions, diagnosis dates, notes), current prescriptions (medication, dosage, dates), doctor's notes, and appointment logs.
* **Appointment Reminders:** Manage and view upcoming patient reminders.
* **Analytics Dashboard:** Visualize key metrics like patients per condition, most prescribed medications, average age per department, and visits per month.
* **Recently Viewed Patients:** Quick access to recently accessed patient profiles.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (Community Server)
* Git


* **Install Dependencies:**
    ```bash
    npm install
    ```

* **Configure Environment Variables:**
    Create a file named `.env` in the root of your project folder (the same folder as `server.js`).
    Add the following lines to the `.env` file, replacing `YOUR_MONGODB_CONNECTION_STRING` with your actual MongoDB URI (e.g., `mongodb://localhost:27017/healthcare_cms` for local, or your Atlas URI). Replace `YOUR_JWT_SECRET_KEY` with a strong, random string.

    ```env
    MONGO_URI=mongodb+srv://healthcareAdmin:resham29122002@cluster0.qwnt3gw.mongodb.net/?retryWrites=true&w=majority&appName=cluster0
    JWT_SECRET=43710911e4e8f28aa98708c16421eae578a8986f348b41d757988dd9119d1367
    PORT=8001
    ```




* **Start the Backend Server:**
    ```bash
    node server.js
    ```
    The server should start on `http://localhost:8001/` (or the port you specified). You should see "MongoDB connected successfully" and "Server running on port 8001".
   now you can open `http://localhost:8001/` on any browser


### 1. Clone the Repository

First, clone this GitHub repository to your local machine:

```bash
git clone https://github.com/Resham-29/Healthcare_Patient_Management_System_Using_MongoDB.git
cd Healthcare_Patient_Management_System_Using_MongoDB
