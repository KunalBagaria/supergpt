import { Message } from "./interfaces";

async function handleRegisterRequest(address: string, signature: Uint8Array) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address,
      signature
    })
  });
  const data = await res.json();
  return data;
}

async function handleSendMessageRequest(address: string, signature: Uint8Array, model: string, messages: Message[]) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address,
      signature,
      model,
      messages
    })
  });
  const data = await res.json();
  return data;
}

export { handleRegisterRequest, handleSendMessageRequest };