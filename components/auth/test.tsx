"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export const Test = () => {
  return (
    <Button variant="secondary" size="lg" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};
