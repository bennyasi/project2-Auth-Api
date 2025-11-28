import jwt from 'jsonwebtoken';

export const issueTokenForUser = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    roles: user.roles
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
  return token;
};

export const me = async (req, res) => {
  return res.json({ user: req.user || null });
};
