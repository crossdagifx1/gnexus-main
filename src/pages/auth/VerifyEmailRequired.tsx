import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/context/AuthContext';

export default function VerifyEmailRequired() {
    const navigate = useNavigate();
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResendEmail = async () => {
        setResending(true);
        try {
            await api.post('?action=resend-verification-email');
            setResent(true);
            toast.success('Verification email resent! Please check your inbox.');
            setTimeout(() => setResent(false), 5000);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to resend verification email');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        Email Verification Required
                    </CardTitle>
                    <CardDescription>
                        Please verify your email address to continue accessing the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-center text-muted-foreground">
                            We've sent a verification email to your registered email address. Please check your inbox and click the verification link.
                        </p>

                        <div className="space-y-2">
                            <Button
                                className="w-full"
                                onClick={handleResendEmail}
                                disabled={resending || resent}
                            >
                                {resending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                                {resent ? 'Email Sent!' : 'Resend Verification Email'}
                            </Button>
                        </div>

                        <div className="text-center">
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/login">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Back to Login
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
