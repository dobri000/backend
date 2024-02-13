const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = db.User;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (user) => {
    const payload = {
      id: user.id,
      username: user.username,
    };
    return jwt.sign(payload, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });
};

const verifyToken = async (req, res, next) => {
    try {
      var token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ message: 'Niste dostavili JWT token' });
      }

      token = token.split(" ")[1];
  
      jwt.verify(token, process.env.SECRET_JWT_KEY, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Nevalidan JWT token' });
        }
  
        const user = await User.findOne({ where: { username: decoded.username } });
        if (!user) {
          return res.status(401).json({ message: 'Korisnik sa datim korisničkim imenom ne postoji' });
        }
  
        // Postavljanje dekodiranih informacija o korisniku u req objekat
        req.user = decoded;
        next();
      });
    } catch (error) {
      console.error('Greška prilikom verifikacije JWT tokena:', error);
      res.status(500).json({ message: 'Greška prilikom verifikacije JWT tokena' });
    }
  };

module.exports = {
    hashPassword,
    comparePasswords,
    generateToken,
    verifyToken
}
