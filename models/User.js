const bcrypt = require('bcryptjs');

module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
      },
      password: {
        type: String,
        required: false, // <-- CAMBIO IMPORTANTE: Opcional para usuarios de OAuth
        minlength: [6, 'Password must be at least 6 characters long']
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      provider: {
        type: String,
        enum: ['local', 'github', 'google'],
        default: 'local'
      }
    },
    { timestamps: true }
  );

  // Hash password before saving (only if it exists and has been modified)
  userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  return mongoose.model('users', userSchema);
};
