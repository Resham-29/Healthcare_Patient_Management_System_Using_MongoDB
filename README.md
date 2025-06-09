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

### 1. Clone the Repository

First, clone this GitHub repository to your local machine:

```bash
git clone https://github.com/Resham-29/Healthcare_Patient_Management_System_Using_MongoDB.git
cd Healthcare_Patient_Management_System_Using_MongoDB
