import db from '../models';
import { IUser } from '../models/User';
import { HydratedDocument } from 'mongoose';

const User = db.User;

// Get all users
export const getAllUsers = async (): Promise<HydratedDocument<IUser>[]> => {
  return await User.find().select('-password');
};

// Get user by ID
export const getUserById = async (id: string): Promise<HydratedDocument<IUser> | null> => {
  return await User.findById(id).select('-password');
};

// Create a new user
export const createUser = async (userData: Partial<IUser>): Promise<Partial<IUser>> => {
  const user = new User(userData);
  const savedUser = await user.save();

  // Return without password
  const userResponse = savedUser.toObject();
  delete userResponse.password;
  return userResponse;
};

// Update a user
export const updateUser = async (
  id: string,
  userData: Partial<IUser>
): Promise<HydratedDocument<IUser> | null> => {
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true
  }).select('-password');
};

// Delete a user
export const deleteUser = async (id: string): Promise<HydratedDocument<IUser> | null> => {
  return await User.findByIdAndDelete(id);
};

// Find or create a user from OAuth login
export const findOrCreateOAuthUser = async (
  profile: { email: string; name: string },
  provider: string
): Promise<HydratedDocument<IUser>> => {
  let currentUser = await User.findOne({ email: profile.email });
  if (currentUser) return currentUser;

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    provider: provider,
    role: 'user'
  });

  await newUser.save();
  return newUser;
};

// Find user by ID for Passport
export const getUserByIdForAuth = async (id: string): Promise<HydratedDocument<IUser> | null> => {
  return await User.findById(id);
};
