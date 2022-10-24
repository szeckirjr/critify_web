import { DefaultSession } from "next-auth/core/types";

export type Range = "short" | "medium" | "long";

export interface MyUser {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  image?: string | null;
  accessToken?: string | null;
}

export interface MySession extends Omit<DefaultSession, "user"> {
  user?: MyUser;
  expires: string;
}
