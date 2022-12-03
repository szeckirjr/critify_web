import { MySession } from "../types/types";

export const customGet = async (url: string, session: MySession | null) => {
  // console.log("customGet", url, session);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  }).then((res) => res.json());

  return res;
};
