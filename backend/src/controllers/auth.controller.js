import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/user.model.js';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'username, email และ password จำเป็นต้องกรอก' });
    if (password.length < 6)
      return res.status(400).json({ error: 'password ต้องมีอย่างน้อย 6 ตัวอักษร' });
    if (await User.findByEmail(email))
      return res.status(409).json({ error: 'อีเมลนี้ถูกใช้แล้ว' });
    if (await User.findByUsername(username))
      return res.status(409).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.createUser({ username, email, password: hashed });
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email และ password จำเป็นต้องกรอก' });

    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET, { expiresIn: '7d' });
    const { password: _, ...safe } = user;
    res.json({ token, user: safe });
  } catch (err) { next(err); }
}
