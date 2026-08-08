import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { authClient, isApiConfigured } from "../services";
import "./forgotPasswordPage.css";

export function ForgotPasswordPage() {
  const navigate = useNavigate(); const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setError(""); const normalizedEmail = email.trim().toLowerCase(); if (!normalizedEmail) return setError("Enter your email address."); if (!isApiConfigured) return setError("This app has not been configured with its Vercel API URL."); setBusy(true); try { const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ""); const result = await authClient.requestPasswordReset({ email: normalizedEmail, redirectTo: `${baseUrl}/en/reset-password` }); if (result.error) throw new Error("The reset link could not be requested. Please try again."); setSent(true); } catch { setError("The reset link could not be requested. Please try again."); } finally { setBusy(false); } }
  return <main className="forgot-page"><section className="forgot-card"><button aria-label="Back to sign in" className="forgot-back" onClick={() => navigate(-1)} type="button"><ArrowLeft /></button><img alt="Abune" className="forgot-logo" src="/images/logo.png" /><h1>Forgot Your Password?</h1><p>Enter the email connected to your Abune account and we will send you a secure reset link.</p>{sent ? <section className="forgot-sent"><CheckCircle2 /><h2>Check Your Email</h2><p>If an account exists for that email, a password-reset link has been sent. Check your inbox and spam folder.</p></section> : <form onSubmit={submit}><label className="forgot-field" data-label="Email Address"><Mail /><input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" required type="email" value={email} /></label>{error ? <p className="forgot-error">{error}</p> : null}<button className="forgot-submit" disabled={busy} type="submit">{busy ? "Sending Link…" : "Send Reset Link"}</button></form>}<button className="forgot-signin" onClick={() => navigate("/")} type="button">Back to Sign In</button></section></main>;
}
