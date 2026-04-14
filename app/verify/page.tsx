"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newCode.every((d) => d)) {
      handleSubmit(newCode.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      handleSubmit(pasted);
    }
  }

  async function handleSubmit(fullCode?: string) {
    const codeStr = fullCode || code.join("");
    if (codeStr.length !== 6) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code: codeStr }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      sessionStorage.setItem("scanToken", data.scanToken);
      sessionStorage.setItem("identifier", identifier);
      router.push("/scan");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs text-center">
        <h1 className="mb-2 font-heading text-2xl tracking-tight">
          Check your {identifier.includes("@") ? "email" : "phone"}
        </h1>
        <p className="mb-8 text-[13px] text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="text-foreground">{identifier}</span>
        </p>

        <div className="mb-6 flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className="h-12 w-10 rounded-lg border border-border bg-secondary text-center text-lg font-medium text-foreground outline-none transition-colors focus:border-muted-foreground/50 disabled:opacity-50"
            />
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <button
          onClick={() => handleSubmit()}
          disabled={loading || code.some((d) => !d)}
          className="w-full rounded-xl bg-teal py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={() => router.back()}
          className="mt-5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Different phone or email
        </button>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[13px] text-muted-foreground">Loading...</p>
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
