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