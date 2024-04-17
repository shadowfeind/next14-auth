"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../formError";
import { FormSuccess } from "../FormSuccess";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing Token");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => setError("Someting went wrong"));
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
