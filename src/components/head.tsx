import Head from "next/head";

function HeadComponent() {
  return (
    <Head>
      <title>SuperGPT</title>
      <meta name="description" content="Use GPT, anonymously. Powered by USDC." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export { HeadComponent };