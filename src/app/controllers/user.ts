import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { IUser } from '../models/User';
import UserModel from '../models/User';
import { RequestWithUserId } from '../middlewares/authToken';
import transporter from '../../modules/mailer';

const generateToken = (params: { id: string }): string => {
  return jwt.sign(params, process.env.JWT_KEY as string, {
    expiresIn: 86400,
  });
};

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  try {
    if (await UserModel.findOne({ email })) {
      res.status(400).send({ error: 'User already exists.' });
      return;
    }

    const user = new UserModel({ email, name, password });
    await user.save();

    user.password = undefined;

    res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    res.status(400).send({ error: 'Registration failed.' });
  }
};

const auth = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      res.status(400).send({ error: 'User not found.' });
      return;
    }

    if (!user.password) {
      res.status(500).send({ error: 'User password not set.' });
      return;
    }

    const passwordMatch: boolean = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).send({ error: 'Invalid password.' });
      return;
    }

    user.password = undefined;

    res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error.' });
  }
};

const userProfile = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const user: IUser | null = await UserModel.findById(req.userId);
    if (!user) {
      res.status(404).send({ error: 'User not found.' });
      return;
    }
    res.send({ ok: true, user });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error.' });
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user: IUser | null = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).send({ error: 'User not found.' });
      return;
    }

    const token: string = crypto.randomBytes(20).toString('hex');

    const now: Date = new Date();
    now.setHours(now.getHours() + 1);

    await UserModel.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@example.com',
      to: email,
      subject: 'Link para Resetar sua Senha ✔',
      text: `Utilize o token ${token} para resetar sua senha`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: 'Error sending email.' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send({ message: 'Email sent successfully.' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error on forgot password, try again.' });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;

  try {
    const user: IUser | null = await UserModel.findOne({
      email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      res.status(400).send({ error: 'Invalid or expired token.' });
      return;
    }

    user.password = password;
    await user.save();

    res.status(200).send({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).send({ error: 'Cannot reset password, try again.' });
  }
};

export { register, auth, userProfile, forgotPassword, resetPassword };
