import { authenticate, verifyKeys, verifyMethod } from "@/lib/server";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!verifyMethod(req, res, "GET")) return;

    const address = req.query.address as string;

    const user = await prisma.user.findUnique({
      where: { id: address },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User does not exist" });
      return;
    }

    return res.status(200).json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e });
  }
}

export default handler;
