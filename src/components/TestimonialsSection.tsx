import { useEffect, useRef } from "react";
import { Star, Quote, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        name: "Abebe Kebede",
        role: "CEO, TechHub Ethiopia",
        quote: "G-Nexus transformed our operations completely. The Telebirr integration made payment collection seamless, and the AI insights helped us grow revenue by 300%.",
        rating: 5,
        accentColor: "gold",
    },
    {
        name: "Mekdes Alemu",
        role: "Founder, EthioFashion",
        quote: "The team's attention to detail and understanding of Ethiopian market needs is unmatched. Our website now rivals international brands.",
        rating: 5,
        accentColor: "cyan",
    },
    {
        name: "Dawit Tesfaye",
        role: "Director, Addis Innovations",
        quote: "From concept to launch, the experience was incredible. The 3D renders brought our architectural vision to life before construction even began.",
        rating: 5,
        accentColor: "gold",
    },
];

export const TestimonialsSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const orb1Ref = useRef<HTMLDivElement>(null);
    const orb2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Header animations
            const headerElements = headerRef.current?.querySelectorAll(".header-anim");
            if (headerElements) {
                gsap.fromTo(
                    headerElements,
                    { opacity: 0, y: 60, filter: "blur(10px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1,
                        stagger: 0.15,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: headerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }

            // Testimonial cards stagger animation
            const cards = cardsRef.current?.querySelectorAll(".testimonial-card");
            if (cards) {
                cards.forEach((card, index) => {
                    gsap.fromTo(
                        card,
                        { opacity: 0, y: 80, scale: 0.95, rotateX: 10 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            duration: 0.8,
                            delay: index * 0.15,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: cardsRef.current,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );

                    // Animate avatar rings
                    const rings = card.querySelectorAll(".avatar-ring");
                    gsap.to(rings, {
                        rotation: 360,
                        duration: 10 + index * 2,
                        ease: "none",
                        repeat: -1,
                    });

                    // Animate sparkles
                    const sparkles = card.querySelectorAll(".floating-sparkle");
                    sparkles.forEach((sparkle, i) => {
                        gsap.to(sparkle, {
                            y: "random(-10, 10)",
                            x: "random(-10, 10)",
                            opacity: "random(0.3, 1)",
                            duration: "random(2, 3)",
                            ease: "sine.inOut",
                            repeat: -1,
                            yoyo: true,
                            delay: i * 0.3,
                        });
                    });
                });
            }

            // Parallax orbs
            if (orb1Ref.current) {
                gsap.to(orb1Ref.current, {
                    yPercent: 40,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2,
                    },
                });
            }

            if (orb2Ref.current) {
                gsap.to(orb2Ref.current, {
                    yPercent: -25,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2,
                    },
                });
            }

            // Animate stat numbers
            const stats = document.querySelectorAll(".stat-number");
            stats.forEach((stat) => {
                gsap.fromTo(
                    stat,
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        ease: "back.out(1.5)",
                        scrollTrigger: {
                            trigger: stat,
                            start: "top 90%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

            {/* Animated Orbs */}
            <div ref={orb1Ref} className="absolute top-1/3 left-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl will-change-transform" />
            <div ref={orb2Ref} className="absolute bottom-1/3 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl will-change-transform" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gold/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <span className="header-anim inline-block px-4 py-2 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-6">
                        Client Success Stories
                    </span>
                    <h2 className="header-anim text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                        Trusted by{" "}
                        <span className="text-gradient-gold">Ethiopian Innovators</span>
                    </h2>
                    <p className="header-anim text-xl text-muted-foreground max-w-2xl mx-auto">
                        Real results from real businesses transforming their digital presence
                        with G-Nexus solutions.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.name}
                            className="testimonial-card group relative p-8 rounded-2xl glass border-glow hover:scale-[1.03] transition-all duration-500 opacity-0"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-gold/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            </div>

                            {/* Quote Icon */}
                            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Quote className="w-6 h-6 text-gold" />
                            </div>

                            <div className="relative z-10">
                                {/* Stars with animation */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-gold text-gold group-hover:scale-125 transition-transform duration-300"
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-foreground leading-relaxed mb-6 group-hover:text-muted-foreground transition-colors duration-300">
                                    "{testimonial.quote}"
                                </p>

                                {/* Author with Animated Avatar */}
                                <div className="flex items-center gap-4">
                                    {/* Animated Geometric Avatar */}
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        {/* Rotating Rings */}
                                        <div className={`avatar-ring absolute inset-0 rounded-full border-2 border-${testimonial.accentColor}/30`} />
                                        <div className={`avatar-ring absolute inset-0 rounded-full border-2 border-dashed border-${testimonial.accentColor}/20`}
                                            style={{ animationDirection: "reverse" }} />

                                        {/* Center Circle with Pulse */}
                                        <div className={`absolute inset-2 rounded-full bg-gradient-to-br from-${testimonial.accentColor}/30 to-${testimonial.accentColor}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <div className={`w-3 h-3 rounded-full bg-${testimonial.accentColor} animate-pulse`} />
                                        </div>

                                        {/* Floating Sparkles */}
                                        <Sparkles className={`floating-sparkle absolute -top-1 -right-1 w-3 h-3 text-${testimonial.accentColor}`} />
                                        <Sparkles className={`floating-sparkle absolute -bottom-1 -left-1 w-3 h-3 text-${testimonial.accentColor === "gold" ? "cyan" : "gold"}`} />
                                    </div>

                                    <div>
                                        <div className="font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan/0 group-hover:border-cyan/50 rounded-br-2xl transition-all duration-500" />
                        </div>
                    ))}
                </div>

                {/* Trust Indicators with enhanced animation */}
                <div className="mt-16 pt-10 border-t border-border/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "100+", label: "Happy Clients", color: "gold" },
                            { value: "98%", label: "Satisfaction Rate", color: "cyan" },
                            { value: "50+", label: "5-Star Reviews", color: "gold" },
                            { value: "24/7", label: "Support", color: "cyan" },
                        ].map((stat) => (
                            <div key={stat.label} className="group cursor-default">
                                <div className={`stat-number text-3xl md:text-4xl font-display font-bold text-${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
