const db = require('../database/db');

const createOrder = (req, res) => {
  const { event_date, guest_count, location, observations } = req.body;
  const user_id = req.user.id;

  if (!event_date || !guest_count || !location) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  db.prepare(`
    INSERT INTO orders (user_id, event_date, guest_count, location, observations)
    VALUES (?, ?, ?, ?, ?)
  `).run(user_id, event_date, guest_count, location, observations || null);

  res.status(201).json({ message: 'Pedido criado com sucesso' });
};

const getMyOrders = (req, res) => {
  const user_id = req.user.id;

  const orders = db.prepare(`
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `).all(user_id);

  res.json(orders);
};

const getAllOrders = (req, res) => {
  const orders = db.prepare(`
    SELECT orders.*, users.name as client_name, users.email as client_email
    FROM orders
    JOIN users ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
  `).all();

  res.json(orders);
};

const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

  res.json({ message: 'Status atualizado com sucesso' });
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };