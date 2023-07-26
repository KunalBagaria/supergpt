import { MESSAGE_TO_SIGN } from '@/lib/constants';

export const getUserSignature = async (
  sign: (message: Uint8Array) => Promise<Uint8Array | undefined>,
  wallet: string
): Promise<Uint8Array | undefined> => {
  try {
    const localSignature = localStorage.getItem(wallet);
    if (localSignature) return new Uint8Array(JSON.parse(localSignature));
    const message = new TextEncoder().encode(MESSAGE_TO_SIGN);
    const signature = await sign(message);
    if (signature) {
      localStorage.setItem(wallet, JSON.stringify(Array.from(signature)));
      return signature;
    }
  }
  catch {
    console.log('User rejected message signature request');
  }
};