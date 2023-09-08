import { getUser } from "@/lib/networkRequests";
import { userAtom } from "@/store/user";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const useUser = () => {
  const { publicKey } = useWallet();

  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    (async () => {
      const user = (await getUser(publicKey.toBase58())).user;

      setUser(user);
    })();
  }, [publicKey]);

  const refetch = async () => {
    if (!publicKey) {
      return;
    }
    const user = (await getUser(publicKey.toBase58())).user;
    setUser(user);
  };

  return { user, refetch };
};

export default useUser;
