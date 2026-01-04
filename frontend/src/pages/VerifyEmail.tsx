import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/lib/api";
import { CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "input">("input");
  const [message, setMessage] = useState<string>("");
  const [manualToken, setManualToken] = useState<string>("");
  const [verifying, setVerifying] = useState(false);
  const token = searchParams.get("token");
  const email = new URLSearchParams(window.location.search).get("email") || 
                localStorage.getItem("pendingEmail") || "";

  useEffect(() => {
    if (token) {
      setStatus("loading");
      verifyEmail(token);
    } else {
      // If no token in URL, show input form
      setStatus("input");
    }
  }, [token]);

  const verifyEmail = async (tokenToVerify?: string) => {
    const tokenValue = tokenToVerify || manualToken;
    if (!tokenValue) {
      setMessage("Please enter a verification token");
      return;
    }
    
    setVerifying(true);
    setMessage("");
    
    try {
      await authApi.verifyEmail({ token: tokenValue });
      setStatus("success");
      setMessage("Email verified successfully!");
      setTimeout(() => {
        navigate("/auth/verify-phone", { state: { phoneNumber: localStorage.getItem("pendingPhone") } });
      }, 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Email verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      verifyEmail(manualToken);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-blush-subtle p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Email</CardTitle>
          <CardDescription className="text-center">
            {email && `Verifying ${email}...`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {status === "input" && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Mode:</strong> Check your backend console/logs for the verification link or token.
                  <br />
                  <br />
                  Copy the token from the URL (the part after <code>?token=</code>) or enter it below.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="token">Verification Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Paste your verification token here"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  disabled={verifying}
                />
                <p className="text-xs text-muted-foreground">
                  The token can be found in the backend console logs after registration.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!manualToken.trim() || verifying}
              >
                {verifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/auth/register")}
              >
                Back to Register
              </Button>
            </form>
          )}

          {status === "success" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    setStatus("input");
                    setMessage("");
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/auth/register")}
                >
                  Back to Register
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;

