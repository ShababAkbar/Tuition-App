import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userType = searchParams.get("type") || "parent";

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (userType === "tutor") {
          // Check if tutor profile exists
          const { data: tutorData } = await supabase
            .from("tutor")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!tutorData) {
            navigate("/tutor-onboarding");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/tuitions");
        }
      }
    };
    checkUser();
  }, [navigate, userType]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email for verification.",
      });

      if (userType === "tutor") {
        navigate("/tutor-onboarding");
      } else {
        navigate("/tuitions");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      if (userType === "tutor") {
        // Check if tutor profile exists
        const { data: tutorData } = await supabase
          .from("tutor")
          .select("*")
          .eq("id", data.user?.id)
          .single();

        if (!tutorData) {
          navigate("/tutor-onboarding");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/tuitions");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-700 text-white p-12">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <GraduationCap size={80} />
          </div>
          <h1 className="text-5xl font-bold">TutorHub</h1>
          <p className="text-xl opacity-90">
            Empowering education through quality tutoring
          </p>
          <div className="space-y-4 text-lg opacity-80">
            <p>✓ Connect with experienced tutors</p>
            <p>✓ Flexible scheduling</p>
            <p>✓ Personalized learning</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Sign in to your account to continue"
                : `Sign up to get started as a ${userType}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
