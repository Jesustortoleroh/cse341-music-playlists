import { Request, Response } from 'express';
import db from '../models';
import { IUser } from '../models/User';

const User = db.User;

// POST create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({ message: 'Content can not be empty!' });
      return;
    }

    const user = new User(req.body);
    const data = await user.save();

    // Hide password from the response
    const userResponse = data.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: 'User created', data: userResponse });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }
    res
      .status(500)
      .json({ message: err.message || 'Some error occurred while creating the user.' });
  }
};

// GET all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await User.find();
    res.status(200).json({ success: true, count: data.length, data: data });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Some error occurred while retrieving users.' });
  }
};

// GET user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await User.findById(req.params.id);
    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: data });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Some error occurred.' });
  }
};

// PUT update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: 'Invalid ID Supplied' });
      return;
    }

    const data = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Some error occurred while updating.' });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: 'Invalid ID Supplied' });
      return;
    }

    const data = await User.findByIdAndDelete(id);
    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting.' });
  }
};

// Find or create a user from OAuth login
export const findOrCreateOAuthUser = async (
  profile: { email: string; name: string },
  provider: string
): Promise<IUser> => {
  let currentUser = await User.findOne({ email: profile.email });

  if (currentUser) {
    return currentUser;
  }

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    provider: provider,
    role: 'user'
  });

  await newUser.save();
  return newUser;
};

// Find user by ID (used by Passport for deserialization)
export const getUserByIdForAuth = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};
