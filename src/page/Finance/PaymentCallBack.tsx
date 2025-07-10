import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/services/constant/axiosInstance";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const errorMessage = searchParams.get("errorMessage");
  const isSuccess = status?.toLowerCase() !== "failed";
  const errorCode = searchParams.get("errorCode");

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(16); // 16 giây như hình mẫu

  useEffect(() => {
    // Auto redirect sau 16 giây
    const timeout = setTimeout(() => {
      navigate("/claims");
    }, 16000); // 16 giây = 16000ms

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [navigate]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment processed successfully!", { autoClose: 3000 });
    } else {
      const errorText = errorCode
        ? `Payment failed: ${errorMessage} with code: ${errorCode}`
        : `Payment failed: ${errorMessage}`;
      toast.error(errorText, { autoClose: 5000 });
    }
  }, [isSuccess, errorMessage, errorCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-8">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl">
            {isSuccess ? (
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            ) : (
              <XCircle className="h-10 w-10 text-red-500" />
            )}
            <span>{isSuccess ? "Payment Successful" : "Payment Failed"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          {isSuccess ? (
            <>
              <p className="text-center text-gray-600">
                Your payment has been processed successfully.
              </p>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600">
                There was an issue processing your payment.
              </p>
              <p className="text-red-600 text-center">
                Error: {errorMessage}
              </p>
            </>
          )}

          <div className="pt-6 space-y-4">
            <p className="text-center text-gray-500">
              Will automatically bring you back to View Claims after {countdown}s
            </p>
            <div className="flex justify-center">
              <Button
                className={`rounded-2xl text-lg px-6 py-6 ${
                  isSuccess
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={() => navigate("/claims")}
              >
                Return to View Claims
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}