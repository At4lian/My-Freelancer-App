"use client"
import { useCustomSession } from "./use-custom-session";

export const useCurrentUser = () => {
  const { session } = useCustomSession()
  return session?.user;
};