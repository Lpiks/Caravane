const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT token helper
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'kouini_caravane_jwt_secret_key_2026_super_secure';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// @desc    Seed super admin account from .env configuration if DB is empty
exports.seedAdminIfEmpty = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kouinicaravane.dz';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Kouini2026!';

    const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      console.log(`[Admin Seed] Seeding super admin account (${adminEmail})...`);
      await Admin.create({
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        name: 'Kouini Admin Manager',
        role: 'super_admin'
      });
      console.log(`[Admin Seed] Successfully created super admin account!`);
    } else {
      console.log(`[Admin Seed] Admin account (${adminEmail}) verified in database.`);
    }
  } catch (error) {
    console.error('[Admin Seed Error]:', error);
  }
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);
      return res.status(200).json({
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    return res.status(500).json({ message: 'Server error processing admin login' });
  }
};

// @desc    Get logged in admin profile
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    return res.status(200).json(req.admin);
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({ message: 'Server error fetching admin profile' });
  }
};
