import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
        if (err || !decodedToken?.id) {
            console.log(err?.message || 'Token không có user id');
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        } else {
            req.userId = decodedToken.id;
            next();
        }
    });
};