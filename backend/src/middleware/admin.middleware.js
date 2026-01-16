function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
}

module.exports = adminMiddleware;
