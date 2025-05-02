"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verifyEmail } from "./action";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function runVerify() {
      if (!token) {
        setStatus("error");
        setMessage("Token not found.");
        return;
      }
      setStatus("loading");
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus("success");
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    }
    runVerify();
  }, [token]);

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {status === "loading" && "Verifying your email address..."}
            {status !== "loading" && message}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <Button asChild className="w-full mt-4">
              <Link href="/login">Login</Link>
            </Button>
          )}
          {status === "error" && (
            <Button asChild className="w-full mt-4">
              <Link href="/register">Register Again</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
