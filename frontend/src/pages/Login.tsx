import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/lib/api";
import { getIntendedRoute } from "@/lib/auth";
import HumanVerification from "@/components/HumanVerification";
import { AlertCircle, Loader2 } from "lucide-react";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string>("");
  const [challengeAnswer, setChallengeAnswer] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleVerification = (token: string, answer: string) => {
    setChallengeToken(token);
    setChallengeAnswer(answer);
    setVerificationError("");
    // Don't submit automatically - wait for form submission
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!challengeToken || !challengeAnswer) {
      setVerificationError("Please complete the human verification");
      return;
    }

    setError("");
    setVerificationError("");
    setLoading(true);

    try {
      const response = await authApi.login({
        ...data,
        challengeToken,
        challengeAnswer,
      });

      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to intended route or home
      const intendedRoute = getIntendedRoute();
      navigate(intendedRoute || "/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setChallengeToken("");
      setChallengeAnswer("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-blush-subtle p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to your Codentt account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="usernameOrEmail">Username or Email</Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  placeholder="johndoe or john@example.com"
                  {...register("usernameOrEmail")}
                />
                {errors.usernameOrEmail && (
                  <p className="text-sm text-destructive">{errors.usernameOrEmail.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter your username or email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <HumanVerification
                onVerified={handleVerification}
                error={verificationError}
              />

              <Button type="submit" className="w-full" disabled={loading || !challengeToken}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm space-y-2">
                <div>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/auth/forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div>
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate("/auth/register")}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

