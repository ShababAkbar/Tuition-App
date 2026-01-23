import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, CheckCircle, Clock } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleResendEmail = () => {
    // Placeholder for resend functionality
    setResendDisabled(true);
    setCountdown(60);
    // TODO: Add actual resend logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-16 h-16" />
            <h1 className="text-5xl font-bold">TutorHub</h1>
          </div>
          
          <p className="text-xl text-blue-100">
            Empowering education through quality tutoring
          </p>

          <div className="space-y-4 mt-12">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Connect with experienced tutors</h3>
                <p className="text-blue-200 text-sm">Find the perfect match for your learning needs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Flexible scheduling</h3>
                <p className="text-blue-200 text-sm">Learn at your own pace and convenience</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Personalized learning</h3>
                <p className="text-blue-200 text-sm">Tailored approach to meet your goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Verification Message */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">TutorHub</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
              <CardDescription className="text-base">
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {email && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Email sent to:</p>
                  <p className="font-medium text-gray-900 break-all">{email}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Click the verification link in your email to activate your account.
                    The link will expire in 1 hour.
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p>
                    After verification, you'll be able to sign in and complete your tutor profile.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={resendDisabled}
                    variant="outline"
                    className="w-full"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Verification Email"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/auth?type=tutor")}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>

              <div className="text-xs text-center text-gray-500 pt-4 border-t">
                <p>💡 Tip: Check your spam folder if you don't see the email</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
