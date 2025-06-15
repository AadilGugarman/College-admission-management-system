CREATE DATABASE college_admission;
USE college_admission;


CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);


CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);


CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  course_id INT,
  personal_details JSON,
  academic_details JSON,
  document_path VARCHAR(255),
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO courses (name, description) VALUES
  ('BCA', 'Bachelor of Computer Applications'),
  ('BBA', 'Bachelor of Business Administration'),
  ('MCA' , 'Master of Computer Applications'),
  ('MBA' , 'Master of Business Administration'),
  ('BA' , 'Bachelor of Arts');

INSERT INTO admins(email , password) VALUES ('Your_Email_Id' , 'Your_Hashed_Password')