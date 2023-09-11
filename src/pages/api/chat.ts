import prisma from "db";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyKeys, verifyMethod, authenticate } from "@/lib/server";
import OpenAI from "openai";
import { COST } from "@/lib/constants";
import { Decimal } from "@prisma/client/runtime/library";

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

    if (!completion.usage) {
      res.status(200).json({ success: false, result: completion });
      return;
    }

    const inputTokens = completion.usage.prompt_tokens;
    const ouputTokens = completion.usage.completion_tokens;

    const esimatedInputCost = inputTokens * COST[modelId].input;
    const esimatedOutputCost = ouputTokens * COST[modelId].output;

    const totalCost = esimatedInputCost + esimatedOutputCost;

    console.log(`Previous usage: ${user.usage || 0}`);
    console.log(`Total cost: ${totalCost}`);

    const currentUsage = new Decimal(user.usage || 0).add(totalCost).toNumber();

    console.log(`Current usage: ${currentUsage}`);

    if (currentUsage > 0.001) {
      const creditsUsed = Math.floor(currentUsage / 0.001);

      const usageLeft = currentUsage - creditsUsed * 0.001;

      console.log(`Credits used: ${creditsUsed}`);

      if (user.credits < creditsUsed) {
        res.status(200).json({
          success: false,
          message: "Not enough credits",
          result: completion,
        });
        return;
      }

      console.log(`Credits left: ${user.credits - creditsUsed}`);

      await prisma.user.update({
        where: { id: address },
        data: {
          credits: user.credits - creditsUsed,
          usage: usageLeft,
        },
      });

      console.log(`User ${address} used ${totalCost} tokens`);
    } else {
      await prisma.user.update({
        where: { id: address },
        data: {
          usage: currentUsage,
        },
      });
    }

    console.log(
      `User ${address} used ${totalCost} tokens for ${inputTokens} input tokens and ${ouputTokens} output tokens`
    );

    res.status(200).json({ success: true, result: completion });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e });
  }
}

export default handler;
