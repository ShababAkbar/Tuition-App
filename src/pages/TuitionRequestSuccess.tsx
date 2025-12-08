import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, MessageCircle } from "lucide-react";

const TuitionRequestSuccess = () => {
  const navigate = useNavigate();

  // Prevent back navigation to form
  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleWhatsApp = () => {
    // Replace with your WhatsApp business number
    window.open(`https://wa.me/923001234567`, "_blank");
  };

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl border-green-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle size={80} className="text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Request Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Thank you for your interest! We have received your tuition request.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-gray-700 text-lg mb-2">
                <strong>What happens next?</strong>
              </p>
              <p className="text-gray-600">
                Our team will review your request and connect you with a qualified tutor shortly. 
                You'll receive a confirmation call or message within 24 hours.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              <p className="text-center text-gray-600 font-medium">
                Need immediate assistance?
              </p>
              
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Contact us on WhatsApp
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full py-6 text-lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <p>
                Want to submit another request?{" "}
                <button
                  onClick={() => navigate("/tuition-request", { replace: true })}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Click here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TuitionRequestSuccess;
