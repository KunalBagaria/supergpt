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

export { handleRegisterRequest };