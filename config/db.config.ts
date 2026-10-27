import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  url: process.env.MONGO_URI as string
};

export default dbConfig;
