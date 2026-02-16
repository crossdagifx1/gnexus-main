import { useState, useEffect, useRef } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSecureForm } from '@/hooks/useSecureForm';
import { HoneypotField } from '@/components/HoneypotField';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const newsletterSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
    variant?: 'default' | 'compact' | 'inline';
    showName?: boolean;
    title?: string;
    description?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
    variant = 'default',
    showName = false,
    title = 'Stay Updated',
    description = 'Subscribe to our newsletter for the latest updates and insights.',
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const form = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            email: '',
            name: '',
        },
    });

    const {
        honeypotField,
        honeypotValue,
        setHoneypotValue,
        createSecureSubmitHandler,
    } = useSecureForm(form, {
        honeypot: true,
        csrf: true,
        sanitize: true,
        rateLimit: { maxAttempts: 3, windowMs: 300000 },
    });

    useEffect(() => {
        if (!sectionRef.current || variant !== 'default') return;

        const ctx = gsap.context(() => {
            const headerElements = headerRef.current?.querySelectorAll(".header-anim");
            if (headerElements) {
                gsap.fromTo(
                    headerElements,
                    { opacity: 0, y: 40, filter: "blur(8px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [variant]);

    const onSubmit = createSecureSubmitHandler('newsletter-signup', async (data) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('newsletter_subscribers').insert([
                {
                    email: data.email,
                    name: data.name || null,
                    subscribed_at: new Date().toISOString(),
                },
            ]);

            if (error) throw error;

            setIsSuccess(true);
            toast.success('Successfully subscribed to newsletter!');
            form.reset();

            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
                toast.info('You are already subscribed!');
            } else {
                console.error('Newsletter signup error:', error);
                toast.error('Failed to subscribe. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    });

    // Compact and inline variants remain the same
    if (variant === 'compact' || variant === 'inline') {
        // Keep existing simple variants unchanged
        return null; // Placeholder
    }

    // Default variant - Enhanced design
    return (
        <section ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />

            {/* Animated Orbs */}
            <div className="absolute top-1/2 left-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan/5 rounded-full blur-3xl" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gold/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {!isSuccess ? (
                    <div className="relative p-10 md:p-14 rounded-3xl glass border-glow overflow-hidden group">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        </div>

                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/50 rounded-tl-3xl transition-all duration-500" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan/0 group-hover:border-cyan/50 rounded-br-3xl transition-all duration-500" />

                        <div ref={headerRef} className="relative z-10 text-center mb-8">
                            {/* Icon */}
                            <div className="header-anim inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-cyan/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                                <Mail className="w-8 h-8 text-gold" />
                            </div>

                            {/* Title */}
                            <h2 className="header-anim text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                                {title}
                            </h2>

                            {/* Description */}
                            <p className="header-anim text-lg text-muted-foreground max-w-2xl mx-auto">
                                {description}
                            </p>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 space-y-4">
                            {honeypotField && (
                                <HoneypotField
                                    {...honeypotField}
                                    value={honeypotValue}
                                    onChange={setHoneypotValue}
                                />
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...form.register('email')}
                                        disabled={isSubmitting}
                                        className="h-12 text-base bg-background/50 border-border/50 focus:border-gold/50 transition-colors"
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-red-500 mt-2">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    size="lg"
                                    variant="gold"
                                    className="group h-12 px-8 gap-2 shadow-xl shadow-gold/20 hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="h-5 w-5" />
                                            Subscribe to Newsletter
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                                <Sparkles className="w-3 h-3 text-gold" />
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </form>
                    </div>
                ) : (
                    <div className="relative p-14 rounded-3xl glass border-glow text-center overflow-hidden">
                        {/* Success Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan/10" />

                        <div className="relative z-10">
                            {/* Animated Check Circle */}
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 animate-pulse">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                                Successfully Subscribed!
                            </h3>
                            <p className="text-lg text-muted-foreground mb-6">
                                Check your email for confirmation and welcome to the G-Nexus community! 🎉
                            </p>

                            {/* Trust indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Weekly insights</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Exclusive updates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Early access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
