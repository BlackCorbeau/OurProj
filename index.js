import 'dotenv/config'
import express from 'express'
import path from 'path'
import morgan from 'morgan'
import methodOverride from 'method-override'
import multer from 'multer'
import { createPath } from './helpers/createPath.js'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { createChartDataJson } from './build_data/build_data.js'
import { createChartTableDataJson } from './build_data/Build_tableData.js'
import { createHRChartDataJson } from './build_data/build_HRData.js'
import { createChartHRTableDataJson } from './build_data/build_HRTableData.js'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcryptjs'
import { Recruter, Vacancy, Resume, Interview, Metric, RecruterMetric } from './db.js';
Interview.addInterview(1, 1)
Interview.addInterview(2, 1)
Interview.addInterview(3, 2)
Interview.addInterview(4, 2)
const app = express();
app.set('view engine', 'ejs');

app.listen(3000, (err) => {
  err ? console.log(err) : console.log('Listening on port 3000, we are online.');
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Получаем путь к текущему файлу
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Обслуживание статических файлов из папки 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/account/:email', (req, res) => {
  const title = 'Profile';

  const User = Recruter.findByEmail(req.params.email, (err, user) => {
    if (err) {
      console.error('Error fetching user by email:', err);
      return reject(err);
    }

    const dataPath = path.join(__dirname, 'data', 'data.json');
    const tableDataPath = path.join(__dirname, 'data', 'tabledata.json');
    createChartDataJson(dataPath, user.id);
    createChartTableDataJson(tableDataPath);
    const chartData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const chartTableData = JSON.parse(fs.readFileSync(tableDataPath, 'utf8'));
    res.render(createPath('index'), { user, chartData, chartTableData });
  });

});

/*// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'images/'); // Папка для сохранения загруженных файлов
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname); // Используем оригинальное имя файла
  }
});

const upload = multer({ storage: storage });

// Маршрут для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});*/

app.get('/hr-manager', (req, res) => {
  const hrManager = {
    fullName: 'John Doe',
    department: 'HR',
  };

  

  const dataPath = path.join(__dirname, 'data', 'HRData.json');
  const tableDataPath = path.join(__dirname, 'data', 'HRTableData.json');
  createHRChartDataJson(dataPath);
  createChartHRTableDataJson(tableDataPath);
  const chartData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const chartTableData = JSON.parse(fs.readFileSync(tableDataPath, 'utf8'));

  res.render(createPath('manager-page'), { hrManager, chartData, chartTableData });
});

app.get('/login', (req, res) => {
  const title = 'Login';
  res.render(createPath('login'));
});

app.post('/login', async (req, res) => {
  const { userEmail, password } = req.body;
  console.log('Received login data:', { userEmail, password });
  try {
    const existingUser = await new Promise((resolve, reject) => {
      Recruter.findByEmail(userEmail, (err, user) => {
        if (err) {
          console.error('Error fetching user by email:', err);
          return reject(err);
        }
        resolve(user);
      });
    });

    if (!existingUser) {
      console.log('User not found with email:', userEmail);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      console.log('Password does not match for email:', userEmail);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Перенаправление на главную страницу после успешного входа
    res.redirect(`/account/${userEmail}`);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/manager-login', (req, res) => {
  const title = 'Manager Login';
  res.render(createPath('manager-login'));
});

app.post('/manager-login', async (req, res) => {
  const { managerEmail, password } = req.body;

  try {
    const existingUser = await new Promise((resolve, reject) => {
      Recruter.allRecruters((err, rows) => {
        if (err) return reject(err);
        resolve(rows.find(user => user.email === managerEmail));
      });
    });

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password :(' });
    }

    // Перенаправление на главную страницу после успешного входа
    res.redirect('/hr-manager');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/registration', (req, res) => {
  const title = 'Registration';
  res.render(createPath('registration'));
});

app.post('/register', async (req, res) => {
  const { UserFirstName, UserLastName, email, password } = req.body;
  const registration_date = new Date().toISOString().split('T')[0];

  try {
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await new Promise((resolve, reject) => {
      Recruter.allRecruters((err, rows) => {
        if (err) return reject(err);
        resolve(rows.find(user => user.email === email));
      });
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Добавляем нового рекрутера в базу данных
    Recruter.addRecruter(UserFirstName, UserLastName, hashedPassword, email, registration_date, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }

      // Перенаправляем на страницу входа после успешной регистрации
      res.redirect('/login');
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


