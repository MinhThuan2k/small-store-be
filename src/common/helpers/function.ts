import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { ClsServiceManager } from 'nestjs-cls';

export const hashBcrypt = async (
  text: string,
  length: number = 10,
): Promise<string> => await bcrypt.hash(text, length);

export const compareBcrypt = async (
  text: string,
  hash: string,
): Promise<boolean> => await bcrypt.compare(text, hash);

export const encrypt = (text: string): string =>
  CryptoJS.AES.encrypt(text).toString();

export const decrypt = (text: any) => {
  const bytes = CryptoJS.AES.decrypt(text);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getCurrentUserId = () => {
  const cls = ClsServiceManager.getClsService();
  return cls.get('userId');
};
