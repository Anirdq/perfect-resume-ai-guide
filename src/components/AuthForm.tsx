
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Github, Twitter, Google } from "lucide-react";

type View = "sign_in" | "sign_up";

export function AuthForm() {
  const [view, setView] = useState<View>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (!email || !password) {
        setErrorMsg("Please enter email and password.");
        setLoading(false);
        return;
      }
      const redirectTo = `${window.location.origin}/`;
      if (view === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setErrorMsg(error.message);
        else toast.success("Logged in!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) setErrorMsg(error.message);
        else toast.success("Check your email to confirm your account!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Auth failed");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: "google" | "github" | "twitter") => {
    setLoading(true);
    setErrorMsg("");
    try {
      const redirectTo = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo }
      });
      if (error) setErrorMsg(error.message);
    } catch (err: any) {
      setErrorMsg(err.message || "Social login failed");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">{view === "sign_in" ? "Sign In" : "Sign Up"}</h2>
      {errorMsg && <div className="mb-2 text-center text-red-500">{errorMsg}</div>}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAuth();
        }}
        className="space-y-4"
      >
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : view === "sign_in" ? "Sign In" : "Sign Up"}
        </Button>
      </form>
      <div className="flex justify-between items-center my-4">
        <span className="flex-grow border-t border-gray-200" />
        <span className="px-2 text-xs text-gray-400">OR</span>
        <span className="flex-grow border-t border-gray-200" />
      </div>
      <div className="flex flex-col gap-2">
        <Button type="button" variant="outline" className="w-full flex items-center gap-2 justify-center" onClick={() => handleOAuth("google")} disabled={loading}>
          <Google className="w-4 h-4" /> Continue with Google
        </Button>
        <Button type="button" variant="outline" className="w-full flex items-center gap-2 justify-center" onClick={() => handleOAuth("github")} disabled={loading}>
          <Github className="w-4 h-4" /> Continue with GitHub
        </Button>
        <Button type="button" variant="outline" className="w-full flex items-center gap-2 justify-center" onClick={() => handleOAuth("twitter")} disabled={loading}>
          <Twitter className="w-4 h-4" /> Continue with Twitter
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        {view === "sign_in" ? (
          <>
            Don&apos;t have an account?{" "}
            <button type="button" className="font-semibold text-blue-600 hover:underline" onClick={() => setView("sign_up")}>
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" className="font-semibold text-blue-600 hover:underline" onClick={() => setView("sign_in")}>
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
