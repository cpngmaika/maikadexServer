import User from "../models/User.js";
import pool from "../config/db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('Please enter') || err.message.includes('Minimum password length')) {
    if (err.message.toLowerCase().includes('email')) {
      errors.email = err.message;
    }
    if (err.message.toLowerCase().includes('password')) {
      errors.password = err.message;
    }
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};


export const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const userId = user.id || user._id;
    const token = createToken(userId);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      user: {
        id: userId,
        email: user.email
      }
    });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

export const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user.id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    });
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// check if the user is logged in
export const checkUser_get = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email FROM users WHERE id = ?',
      [req.userId]
    );
    if (!rows[0]) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    res.status(200).json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout_get = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({
    message: 'Đã đăng xuất'
  });
};

export const changePassword_put = async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};

  if (!req.userId) {
    return res.status(401).json({ message: "Không xác định được danh tính người dùng" });
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới"
    });
  }

  try {
    // Tìm user trong database bằng MySQL thay vì Mongoose
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Mật khẩu cũ không đúng"
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Cập nhật mật khẩu mới vào database
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.userId]);
    
    res.status(200).json({
      message: "Đã thay đổi mật khẩu thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message
    });
  }
}

