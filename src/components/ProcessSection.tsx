import { useEffect, useRef } from "react";
import { Lightbulb, Layers, Rocket, CheckCircle, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
    {
        icon: <Lightbulb className="w-6 h-6" />,
        number: "01",
        title: "Discovery & Strategy",
        description: "We dive deep into your business goals, target audience, and unique challenges to craft a tailored digital strategy.",
        color: "gold",
    },
    {
        icon: <Layers className="w-6 h-6" />,
        number: "02",
        title: "Design & Development",
        description: "Our team creates stunning designs and builds robust solutions using cutting-edge technologies and best practices.",
        color: "cyan",
    },
    {
        icon: <Rocket className="w-6 h-6" />,
        number: "03",
        title: "Launch & Optimize",
        description: "We deploy your solution with confidence and continuously optimize for performance, growth, and user satisfaction.",
        color: "gold",
    },
    {
        icon: <CheckCircle className="w-6 h-6" />,
        number: "04",
        title: "Support & Scale",
        description: "Ongoing maintenance, updates, and strategic guidance to ensure your digital presence grows with your business.",
        color: "cyan",
    },
];

export const ProcessSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);
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

            // Process steps animation
            const steps = stepsRef.current?.querySelectorAll(".process-step");
            if (steps) {
                steps.forEach((step, index) => {
                    gsap.fromTo(
                        step,
                        { opacity: 0, x: index % 2 === 0 ? -80 : 80, scale: 0.9 },
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: step,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });
            }

            // Connecting lines animation
            const lines = stepsRef.current?.querySelectorAll(".connecting-line");
            if (lines) {
                lines.forEach((line, index) => {
                    gsap.fromTo(
                        line,
                        { scaleX: 0, transformOrigin: "left" },
                        {
                            scaleX: 1,
                            duration: 0.6,
                            delay: index * 0.1 + 0.4,
                            ease: "power2.inOut",
                            scrollTrigger: {
                                trigger: line,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        }
                    );
                });
            }

            // Parallax orbs
            if (orb1Ref.current) {
                gsap.to(orb1Ref.current, {
                    yPercent: 35,
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
                    yPercent: -30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />

            {/* Animated Orbs */}
            <div ref={orb1Ref} className="absolute top-1/4 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl will-change-transform" />
            <div ref={orb2Ref} className="absolute bottom-1/4 left-10 w-96 h-96 bg-cyan/5 rounded-full blur-3xl will-change-transform" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <span className="header-anim inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
                        Our Process
                    </span>
                    <h2 className="header-anim text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                        From Concept to{" "}
                        <span className="text-gradient-gold">Launch</span>
                    </h2>
                    <p className="header-anim text-xl text-muted-foreground max-w-2xl mx-auto">
                        A proven methodology that transforms your vision into reality through
                        strategic planning, expert execution, and continuous optimization.
                    </p>
                </div>

                {/* Process Steps */}
                <div ref={stepsRef} className="space-y-8">
                    {processSteps.map((step, index) => (
                        <div key={step.number} className="relative">
                            {/* Process Step Card */}
                            <div className="process-step group relative opacity-0">
                                <div className="relative p-8 md:p-10 rounded-2xl glass border-glow hover:scale-[1.02] transition-all duration-500">
                                    {/* Hover Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-${step.color}/10 via-transparent to-${step.color}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        {/* Step Number & Icon */}
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-${step.color}/20 to-${step.color}/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                                <div className={`text-${step.color}`}>
                                                    {step.icon}
                                                </div>
                                            </div>
                                            <div className={`text-5xl md:text-6xl font-display font-bold text-${step.color}/20 group-hover:text-${step.color}/40 transition-colors duration-300`}>
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className={`text-2xl md:text-3xl font-display font-bold text-foreground mb-3 group-hover:text-${step.color} transition-colors duration-300`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed text-lg">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Arrow Indicator */}
                                        <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-${step.color}/10 group-hover:bg-${step.color}/20 transition-all duration-300`}>
                                            <ArrowRight className={`w-5 h-5 text-${step.color} group-hover:translate-x-1 transition-transform duration-300`} />
                                        </div>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-${step.color}/0 group-hover:border-${step.color}/50 rounded-tl-2xl transition-all duration-500`} />
                                    <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-${step.color}/0 group-hover:border-${step.color}/50 rounded-br-2xl transition-all duration-500`} />
                                </div>
                            </div>

                            {/* Connecting Line */}
                            {index < processSteps.length - 1 && (
                                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 -bottom-8 z-0">
                                    <div className="connecting-line w-full h-full bg-gradient-to-b from-gold/50 to-cyan/50" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <div className="p-8 md:p-12 rounded-2xl glass border-glow">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                            Ready to Transform Your Business?
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Let's discuss how we can help you achieve your digital goals with our proven process.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold to-gold-glow text-background font-semibold hover:scale-105 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300"
                            >
                                Start Your Project
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="/gnexus"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-cyan/50 text-foreground hover:bg-cyan/10 hover:border-cyan hover:scale-105 transition-all duration-300"
                            >
                                Explore Platform
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
