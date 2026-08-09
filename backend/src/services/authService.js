import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import env from '../config/env.js';
import { userModel } from '../models/userModel.js';
import { createAppError } from '../utils/helpers.js';

const SALT_ROUNDS = 12;

export const authService = {
  async signup({ name, email, password }) {
    const existing = await userModel.findByEmail(email);
    if (existing) {
      throw createAppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw createAppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createAppError('Invalid email or password', 401);
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async getMe(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw createAppError('User not found', 404);
    }
    return user;
  },

  async googleLogin(payload = {}) {
    let email = payload.email;
    let name = payload.name;
    let avatar = payload.avatar;
    let dob = payload.dob || '';

    if (payload.access_token) {
      try {
        // Try Google People API first for rich profile details including Date of Birth (DOB)
        try {
          const peopleRes = await axios.get('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,birthdays', {
            headers: { Authorization: `Bearer ${payload.access_token}` },
          });

          if (peopleRes.data) {
            const pData = peopleRes.data;
            if (pData.emailAddresses?.[0]?.value) {
              email = pData.emailAddresses[0].value;
            }
            if (pData.names?.[0]?.displayName) {
              name = pData.names[0].displayName;
            }
            if (pData.photos?.[0]?.url) {
              avatar = pData.photos[0].url;
            }
            if (pData.birthdays && Array.isArray(pData.birthdays)) {
              for (const bItem of pData.birthdays) {
                if (bItem.date) {
                  const { year, month, day } = bItem.date;
                  if (year && month && day) {
                    dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    break;
                  } else if (month && day) {
                    dob = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    break;
                  }
                } else if (bItem.text) {
                  dob = bItem.text;
                  break;
                }
              }
            }
          }
        } catch {
          // Fallback to UserInfo API if People API is unconfigured
          const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${payload.access_token}` },
          });
          if (userInfoRes.data?.email) {
            email = userInfoRes.data.email;
            name = userInfoRes.data.name || userInfoRes.data.email.split('@')[0];
            avatar = userInfoRes.data.picture || avatar;
          }
        }
      } catch (err) {
        console.error('Failed to verify Google token:', err.response?.data || err.message);
        throw createAppError('Google account verification failed', 401);
      }
    } else if (payload.credential) {
      try {
        const decoded = jwt.decode(payload.credential);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.email.split('@')[0];
          avatar = decoded.picture || avatar;
        }
      } catch (err) {
        console.warn('Could not decode Google JWT credential:', err);
      }
    }

    if (!email) {
      throw createAppError('Please select a valid Google account to sign in', 400);
    }

    avatar = avatar || 'https://lh3.googleusercontent.com/a/default-user';
    dob = dob || 'Not specified';

    let user = await userModel.findByEmail(email);

    if (!user) {
      const dummyPassword = await bcrypt.hash(`google-auth-${Date.now()}`, SALT_ROUNDS);
      user = await userModel.create({
        name,
        email,
        password: dummyPassword,
        role: 'user',
        avatar,
        dob,
        provider: 'google',
      });
    } else {
      // Preserve custom uploaded photo (data URLs or non-google photos) over Google avatar
      const hasCustomUploadedAvatar = user.avatar && (user.avatar.startsWith('data:') || (!user.avatar.includes('googleusercontent.com') && user.avatar !== 'https://lh3.googleusercontent.com/a/default-user'));
      const preservedAvatar = hasCustomUploadedAvatar ? user.avatar : (avatar || user.avatar);

      user = await userModel.update(user.id, {
        name: name || user.name,
        avatar: preservedAvatar,
        dob: dob !== 'Not specified' ? dob : (user.dob || 'Not specified'),
      }) || { ...user, name: name || user.name, avatar: preservedAvatar, dob: dob !== 'Not specified' ? dob : user.dob };
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
