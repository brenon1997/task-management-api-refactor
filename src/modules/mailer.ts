import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailConfig = {
  host: process.env.EMAIL_HOST || '',
  port: parseInt(process.env.EMAIL_PORT || '2525', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
};

const transporter = nodemailer.createTransport(mailConfig);

export default transporter;
