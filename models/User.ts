import bcrypt from 'bcryptjs';
import { Model, Schema, HydratedDocument, Mongoose } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  provider?: 'local' | 'github' | 'google';
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
      type: String,
      required: false,
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

// Hash password before saving (with correct 'this' type)
userSchema.pre<HydratedDocument<IUser>>('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Factory pattern with typed mongoose instance
const createUserModel = (mongooseInstance: Mongoose): Model<IUser> => {
  return mongooseInstance.model<IUser>('users', userSchema);
};

export default createUserModel;
