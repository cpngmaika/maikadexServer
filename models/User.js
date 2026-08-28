import pool from '../config/db.js';

const User = {
    create: async ({ email, password }) => {
        const [result] = await pool.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, password]
        );

        return {
            id: result.insertId,
            email
        };
    }
};

export default User;