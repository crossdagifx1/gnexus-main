import { useEffect, useRef, useState } from "react";
import { TimelineSection } from "@/components/TimelineSection";
import { Sparkles, Users, Box, Brain, Rocket, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Icon mapping
const iconMap: Record<string, JSX.Element> = {
    Sparkles: <Sparkles className="w-4 h-4 text-gold" />,
    Users: <Users className="w-4 h-4 text-cyan" />,
    Box: <Box className="w-4 h-4 text-gold" />,
    Brain: <Brain className="w-4 h-4 text-cyan" />,
    Rocket: <Rocket className="w-4 h-4 text-gold" />,
    TrendingUp: <TrendingUp className="w-4 h-4 text-cyan" />,
};

// Fallback static data if API fails
const defaultTimeline = [
    {
        year: "2019",
        title: "Founded",
        description: "G-Nexus was established with a vision to digitize Ethiopian businesses through innovative technology solutions.",
        icon: "Sparkles",
    },
    {
        year: "2020",
        title: "First 50 Clients",
        description: "Reached the milestone of serving 50+ businesses across Ethiopia with web development and digital solutions.",
        icon: "Users",
    },
    {
        year: "2021",
        title: "3D Studio Launch",
        description: "Expanded our services to include architectural visualization, 3D rendering, and immersive virtual tours.",
        icon: "Box",
    },
    {
        year: "2022",
        title: "AI Integration",
        description: "Introduced AI-powered tools, automation services, and intelligent business solutions to our portfolio.",
        icon: "Brain",
    },
    {
        year: "2023",
        title: "G-Nexus Platform Beta",
        description: "Launched our comprehensive business management platform designed specifically for Ethiopian SMEs.",
        icon: "Rocket",
    },
    {
        year: "2024",
        title: "Nationwide Expansion",
        description: "Scaled operations to serve businesses across all major Ethiopian cities with 24/7 support.",
        icon: "TrendingUp",
    },
];

export const CompanyTimelineSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [timelineData, setTimelineData] = useState(defaultTimeline);

    useEffect(() => {
        // Fetch timeline data from API (future implementation)
        // For now, use default static data
        const fetchTimeline = async () => {
            try {
                // const response = await fetch('/api/timeline');
                // const data = await response.json();
                // setTimelineData(data);
            } catch (error) {
                console.log("Using default timeline data");
            }
        };

        fetchTimeline();
    }, []);

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
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Transform data to include icon components
    const timelineItems = timelineData.map((item) => ({
        year: item.year,
        title: item.title,
        description: item.description,
        icon: iconMap[item.icon] || iconMap.Sparkles,
    }));

    return (
        <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

            {/* Animated Orbs */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <span className="header-anim inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
                        Our Journey
                    </span>
                    <h2 className="header-anim text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                        Building the Future{" "}
                        <span className="text-gradient-gold">Since 2019</span>
                    </h2>
                    <p className="header-anim text-xl text-muted-foreground max-w-2xl mx-auto">
                        From a vision to transform Ethiopian businesses to becoming a leading
                        digital innovation partner — here's our story.
                    </p>
                </div>

                {/* Timeline */}
                <TimelineSection items={timelineItems} />
            </div>
        </section>
    );
};
