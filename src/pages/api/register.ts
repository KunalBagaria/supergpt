import prisma from "db";
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  verifyKeys,
  verifyMethod,
  authenticate,
} from "@/lib/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!verifyMethod(req, res, 'POST')) return;
    const requiredKeys = ['address', 'signature'];
    if (!verifyKeys(req, res, requiredKeys)) return;
    const { address, signature } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: address },
    });
    if (user) {
      res.status(200).json({ success: true, message: 'User already exists', user });
      return;
    }
    const authenticated = authenticate(address, signature, res);
    if (!authenticated) return;
    const newUser = await prisma.user.create({
      data: {
        id: address
      }
    });
    res.status(200).json({ success: true, message: 'User created', user: newUser });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
}

export default handler;