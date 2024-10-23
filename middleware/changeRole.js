const jwt = require('jsonwebtoken');
// Import your User model
const { User } = require('../models/models'); // Adjust based on your project structure

module.exports = async function (req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer asfasnfkajsfnjk

    if (!token) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    // Update user role locally
    req.user.role = 'ADMIN';

    // Update role in the database
    await User.update(
      { role: 'ADMIN' },
      { where: { id: req.user.id } } // Assuming the token contains user ID as "id"
    );

    next();
  } catch (e) {
    console.error('Error updating user role:', e);
    return res.status(401).json({ message: 'Не авторизован' });
  }
};
