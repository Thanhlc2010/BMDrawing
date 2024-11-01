const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const cors = require('cors'); // Import cors

// Khóa bí mật để mã hóa và giải mã JWT
const secretKey = 'your_secret_key';

// Sử dụng body-parser để xử lý JSON và urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Mảng để lưu trữ các tài khoản đã đăng ký
const users = [];

// API Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem username và password có tồn tại không
  if (!username || !password) {
    return res.status(400).send("Username và password là bắt buộc!");
  }

  // Thêm tài khoản vào mảng
  users.push({ username, password });

  // Mã hóa username thành JWT token
  const token = jwt.sign({ username }, secretKey);

  console.log(`Registered user:`, { username, password });
  res.status(201).send({ message: `User ${username} registered successfully!`, token });
});

// API Login
app.post('/login', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("Token là bắt buộc!");
  }

  try {
    // Giải mã token để lấy username
    const decoded = jwt.verify(token, secretKey);
    const { username } = decoded;

    // Kiểm tra xem username đã đăng ký chưa
    const userFound = users.some(user => user.username === username);

    if (userFound) {
      console.log(`User ${username} logged in successfully!`);
      res.status(200).send("Login success!");
    } else {
      console.log(`Login failed for username: ${username}`);
      res.status(401).send("Username không tồn tại!");
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).send("Token không hợp lệ!");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
