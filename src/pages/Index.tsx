import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto py-4 px-5 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-gray-800">
            Acme
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Blog
            </a>
            {!session ? (
              <a
                href="/auth"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Login
              </a>
            ) : (
              <button
                className="ml-2 px-4 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 text-sm font-medium"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSession(null);
                  navigate("/auth");
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-5">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create a new project</CardTitle>
              <CardDescription>
                Enter the details for your new project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create project</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
