const express = require('express');
const mysql = require('mysql2');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));



const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb('Error: Only PDF/JPG allowed!');
    }
  }
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Aadil786',
  database: 'college_admission'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

//Root Route
app.get('/onlineuu' , (req, res)=>{
  res.render('welcome')
})

//Student Routes
app.get('/student', (req, res) => {
  res.redirect('/student/login ');
});

app.get('/student/login', (req, res) => {
  res.render('student/login', {error:null});
});

app.post('/student/login', async (req, res) => {
  const { email, password } = req.body;
  const [students] = await db.promise().query('SELECT * FROM students WHERE email = ?', [email]);
  if (students.length && await bcrypt.compare(password, students[0].password)) {
    req.session.studentId = students[0].id;
    res.redirect('/student/dashboard');
  } else {
    res.render('student/login', { error: 'Invalid credentials' });
  }
});

app.get('/student/dashboard', async (req, res) => {
  if (!req.session.studentId) return res.redirect('/student/login');

  const [students] = await db.promise().query(
    'SELECT name FROM students WHERE id = ?', 
    [req.session.studentId]
  );

  if (students.length) {
    res.render('student/dashboard', { studentName: students[0].name });
  } else {
    res.redirect('/student/login');
  }
});




app.get('/student/register', (req, res) => {
  res.render('student/register');
});

app.post('/student/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.promise().query(
    'INSERT INTO students (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  res.redirect('/student/login');
});



app.get('/student/application', async (req, res) => {
  if (!req.session.studentId) return res.redirect('/student/login');
  const [courses] = await db.promise().query('SELECT * FROM courses');
  res.render('student/application', { courses });
});

app.post('/student/application', upload.single('document'), async (req, res) => {
  if (!req.session.studentId) return res.redirect('/student/login');
  const { personal_details, academic_details, course_id } = req.body;
  const document_path = req.file ? `/uploads/${req.file.filename}` : null;
  await db.promise().query(
    'INSERT INTO applications (student_id, course_id, personal_details, academic_details, document_path) VALUES (?, ?, ?, ?, ?)',
    [req.session.studentId, course_id, JSON.stringify(personal_details), JSON.stringify(academic_details), document_path]
  );
  res.redirect('/student/status');
});

app.get('/student/status', async (req, res) => {
  if (!req.session.studentId) return res.redirect('/student/login');
  const [applications] = await db.promise().query(
    'SELECT a.*, c.name AS course_name FROM applications a JOIN courses c ON a.course_id = c.id WHERE a.student_id = ?',
    [req.session.studentId]
  );
  res.render('student/status', { applications });
});

app.get('/student/confirmation/:id', async (req, res) => {
  if (!req.session.studentId) return res.redirect('/student/login');
  const [application] = await db.promise().query(
    'SELECT a.*, c.name AS course_name FROM applications a JOIN courses c ON a.course_id = c.id WHERE a.id = ? AND a.status = "Approved"',
    [req.params.id]
  );
  if (application.length) {
    if (typeof application[0].personal_details === 'string') {
  application[0].personal_details = JSON.parse(application[0].personal_details);
}

    res.render('student/confirmation', { application: application[0] });
  } else {
    res.redirect('/student/status');
  }
});

app.get('/student/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/student');
  });
});

// Admin Routes
app.get('/admin' , (req , res)=>{
res.redirect('/admin/login');
})

app.get('/admin/login', (req, res) => {
  res.render('admin/login', {error:null});
});

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const [admins] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
  if (admins.length && await bcrypt.compare(password, admins[0].password)) {
    req.session.adminId = admins[0].id;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'invalid credentials' });
  }
});

app.get('/admin/dashboard', async (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  const [applications] = await db.promise().query(
    'SELECT a.*, s.name AS student_name, c.name AS course_name FROM applications a JOIN students s ON a.student_id = s.id JOIN courses c ON a.course_id = c.id'
  );
  res.render('admin/dashboard', { applications });
});

app.post('/admin/application/:id', async (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  const { status } = req.body;
  await db.promise().query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
  res.redirect('/admin/dashboard');
});

app.listen(3000, () => console.log('Server running on a port 3000'));

