# College Admission Management System

Project Overview:

The College Admission Management System is a web-based platform built for the BCA 5th Semester curriculum. It streamlines the student admission process through digital registration, application submission, and status tracking, while giving administrators full control to manage the process efficiently.

Tech Stack: HTML, CSS , JavaScript , Node.js, Express.js, EJS, MySQL ..

Features

Student Module:

- Student Registration and Login
- Submit Admission Application Form
- Upload Documents (e.g. Marksheet, ID)
- Track Application Status (Pending, Approved, Rejected)
- Dashboard View for Submitted Application

Admin Module:

- Secure Admin Login
- View All Student Applications
- Approve or Reject Applications
- Admin Dashboard for Application Management

Project Structure:

- app.js : Main Express server file that handles routes and middleware
- schema.sql : SQL file used to create tables in your MySQL database
- package.json : Manages project dependencies and scripts
- package-lock.json : Automatically generated; locks exact versions of installed packages
- node_modules/ : Contains all installed npm packages (auto-generated)
- public/ : Folder for static files like CSS and uploaded documents
- public/css/style.css : Your custom styling file
- public/uploads/ : Stores uploaded documents (PDF, JPG)
- views/ : Folder containing all EJS templates (HTML UI)
- views/admin/ : EJS pages for admin section (login, dashboard)
- views/student/ : EJS pages for student section (login, register, dashboard, etc.)

Setup Instructions:
Prerequisites

- Node.js and npm installed
- MySQL installed and running
- Code editor (e.g., VS Code)
- Command Prompt (Windows) or Terminal (macOS/Linux)

Step 1: Clone the Repository

- git clone https://github.com/AadilGugarman/College-admission-management-system.git
- cd College-admission-management-system

Step 2: Install Dependencies

- npm install

Step 3: Set Up the MySQL Database

- Install bcrypt (if not already installed)
- npm install bcrypt
- Import the schema.sql file (already included in the project folder)
- Open schema.sql and replace:
  - Your_Email_Id, your admin email (e.g., 'admin@uu.com')
  - Your_Hashed_Password, generate using:
- node -e "console.log(require('bcrypt').hashSync('your_password_here', 10))"

Step 3: Open MySQL terminal:

- mysql -u root -p
- Run the schema: source schema.sql;

In the app.js file, update your MySQL credentials:
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'your_mysql_password',
database: 'college_admission'
});

Step 5: Install nodemon Globally (Optional)

- npm install -g nodemon

Step 6: Start the Server

- nodemon app.js
- If nodemon is not installed globally, you can use ,
- npx nodemon app.js or node app.js

Step 7: Open in Your Browser

- http://localhost:3000/onlineuu

Admin Credentials Example:

- Email: (the one you chose, e.g., admin@uu.com)
- Password: (the one you chose and hashed)

Project Submission Details:

- Submitted To: project.al@uumail.in
- Submission Date: June 15, 2025
- Developed By: Aadil Gugarman & Ramiz Shaikh
- Learner ID: 2223020083
