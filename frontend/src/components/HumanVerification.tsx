import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi, LoginChallengeResponse } from "@/lib/api";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

interface HumanVerificationProps {
  onVerified: (challengeToken: string, challengeAnswer: string) => void;
  error?: string;
}

const HumanVerification = ({ onVerified, error }: HumanVerificationProps) => {
  const [challenge, setChallenge] = useState<LoginChallengeResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchChallenge();
  }, []);

  useEffect(() => {
    if (challenge && challenge.expiresIn) {
      setTimeLeft(challenge.expiresIn);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [challenge]);

  const fetchChallenge = async () => {
    setFetching(true);
    try {
      const challengeData = await authApi.getLoginChallenge();
      setChallenge(challengeData);
      setSelectedAnswer([]);
    } catch (err) {
      console.error("Failed to fetch challenge", err);
    } finally {
      setFetching(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (!challenge) return;

    if (challenge.challengeType === "SENTENCE_ARRANGEMENT") {
      // For sentence arrangement, allow reordering
      setSelectedAnswer((prev) => {
        if (prev.includes(option)) {
          return prev.filter((item) => item !== option);
        }
        return [...prev, option];
      });
    } else {
      // For selection types, single choice
      setSelectedAnswer([option]);
    }
  };

  const handleSubmit = () => {
    if (!challenge || selectedAnswer.length === 0) return;
    
    onVerified(challenge.challengeToken, JSON.stringify(selectedAnswer));
  };

  if (fetching) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load challenge. Please refresh.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Human Verification</CardTitle>
          <div className="flex items-center gap-2">
            {timeLeft > 0 && (
              <span className="text-sm text-muted-foreground">{timeLeft}s</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={fetchChallenge}
              disabled={fetching}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>{challenge.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {challenge.challengeType === "SENTENCE_ARRANGEMENT" ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Selected words (in order):</p>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
              {selectedAnswer.length === 0 ? (
                <span className="text-muted-foreground text-sm">No words selected</span>
              ) : (
                selectedAnswer.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                  >
                    {word}
                  </span>
                ))
              )}
            </div>
            <p className="text-sm text-muted-foreground">Available words:</p>
            <div className="flex flex-wrap gap-2">
              {challenge.options.map((option, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={selectedAnswer.includes(option) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAnswer(option)}
                  disabled={loading}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {challenge.options.map((option, index) => (
              <Button
                key={index}
                type="button"
                variant={selectedAnswer.includes(option) ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleAnswer(option)}
                disabled={loading}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        <Button
          type="button"
          className="w-full"
          onClick={handleSubmit}
          disabled={selectedAnswer.length === 0 || loading || timeLeft === 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>

        {timeLeft === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Challenge expired. Please refresh to get a new one.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HumanVerification;

