const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (userExists) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);

  res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Email ou senha inválidos' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: 'Email ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, name: user.name });
};

module.exports = { register, login };