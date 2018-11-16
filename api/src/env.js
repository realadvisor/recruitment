import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
