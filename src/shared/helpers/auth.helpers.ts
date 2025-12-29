import * as bcrypt from 'bcrypt';

const hash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const verify = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const AuthHelpers = {
  hash,
  verify,
};
