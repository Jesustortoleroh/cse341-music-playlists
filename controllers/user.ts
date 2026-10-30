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
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }
    const message =
      err instanceof Error ? err.message : 'Some error occurred while creating the user.';
    res.status(500).json({ message });
  }
};

// GET all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await User.find();
    res.status(200).json({ success: true, count: data.length, data: data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Some error occurred while retrieving users.';
    res.status(500).json({ message });
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Some error occurred.';
    res.status(500).json({ message });
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Some error occurred while updating.';
    res.status(500).json({ message });
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Some error occurred while deleting.';
    res.status(500).json({ message });
  }
};

// Find or create a user from OAuth login
export const findOrCreateOAuthUser = async (
  profile: { email: string; name: string },
  provider: string
): Promise<IUser> => {
  let currentUser = await User.findOne({ email: profile.email });

  if (currentUser) {
    // Return without the 'as IUser' cast (TypeScript knows it's not null)
    return currentUser;
  }

  const newUser = new User({
    name: profile.name,
    email: profile.email,
    provider: provider,
    role: 'user'
  });

  await newUser.save();
  // Return without the 'as IUser' cast
  return newUser;
};

// Find user by ID (used by Passport for deserialization)
export const getUserByIdForAuth = async (id: string): Promise<IUser | null> => {
  // Return without the cast; Mongoose's Document type is assignable to IUser
  return await User.findById(id);
};
