import prisma from "db";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyKeys, verifyMethod, authenticate } from "@/lib/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!verifyMethod(req, res, "POST")) return;
    const requiredKeys = ["address", "signature", "messages", "model"];
    if (!verifyKeys(req, res, requiredKeys)) return;
    const { address, signature, messages, model } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: address },
    });
    if (!user) {
      res.status(200).json({ success: false, message: "User does not exist" });
      return;
    }
    const authenticated = authenticate(address, signature, res);
    if (!authenticated) return;

    const modelId = model === "3.5" ? "gpt-3.5-turbo" : "gpt-4";

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: modelId,
    });

    res.status(200).json({ success: true, result: completion });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
}

export default handler;
