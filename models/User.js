import pool from '../config/db.js';
import validator from 'validator';
import bcrypt from 'bcrypt';

const { isEmail } = validator;

class User {
    // Tạo user mới và lưu vào database
    static async create({ email, password }) {
        if (!email) throw Error('Please enter an email');
        if (!isEmail(email)) throw Error('Please enter a valid email');
        if (!password) throw Error('Please enter a password');
        if (password.length < 6) throw Error('Minimum password length is 6 characters');

        // Hash password trước khi lưu vào database
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const [result] = await pool.execute(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email.toLowerCase(), hashedPassword]
            );

            return {
                _id: result.insertId,
                email: email.toLowerCase()
            };

        } catch (err) {
            // Xử lý lỗi email bị trùng
            if (err.code === 'ER_DUP_ENTRY') {
                throw Object.assign(
                    new Error('duplicate email'),
                    { code: 11000 }
                );
            }

            throw err;
        }
    }

    // Kiểm tra email/password và đăng nhập user
    static async login(email, password) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email.toLowerCase()]
        );

        const user = rows[0];

        if (user) {
            // So sánh password nhập vào với password đã hash
            const auth = await bcrypt.compare(password, user.password);

            if (auth) {
                user._id = user.id;
                return user;
            }

            throw Error('incorrect password');
        }

        throw Error('incorrect email');
    }
}

export default User;