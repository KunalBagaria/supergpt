import { MESSAGE_TO_SIGN } from '@/lib/constants';

export const getUserSignature = async (
  sign: (message: Uint8Array) => Promise<Uint8Array | undefined>
): Promise<Uint8Array | undefined> => {
  try {
    const message = new TextEncoder().encode(MESSAGE_TO_SIGN);
    const signature = await sign(message);
    return signature;
  }
  catch {
    console.log('User rejected message signature request');
  }
};

export const getLocalSignature = (): Uint8Array|null => {
  const localUser = localStorage.getItem('user');
  if (localUser) {
    const user = JSON.parse(localUser);
    return user.auth;
  } else {
    return null;
  }
}