import { Brain, Zap, TrendingUp, Users, Shield, Sparkles, ArrowRight, Globe, Cpu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
    { icon: Users, value: "10K+", label: "Businesses Empowered", color: "gold" },
    { icon: Zap, value: "95%", label: "Faster Workflows", color: "cyan" },
    { icon: TrendingUp, value: "300%", label: "ROI Increase", color: "gold" },
    { icon: Shield, value: "99.9%", label: "Uptime Guaranteed", color: "cyan" },
];

const benefits = [
    {
        icon: Brain,
        title: "AI-Powered Intelligence",
        description: "Leverage cutting-edge machine learning to automate complex tasks and make data-driven decisions.",
        gradient: "from-gold/20 via-amber-500/20 to-yellow-500/20"
    },
    {
        icon: Globe,
        title: "Built for Ethiopia",
        description: "Designed specifically for Ethiopian businesses with local language support and regional insights.",
        gradient: "from-cyan/20 via-blue-500/20 to-indigo-500/20"
    },
    {
        icon: Rocket,
        title: "Lightning Fast",
        description: "Process thousands of operations in seconds with our optimized cloud infrastructure.",
        gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20"
    },
];

export const GNexusAIImportance = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-background via-black/50 to-background">
            {/* 3D Background Grid */}
            <div className="absolute inset-0 opacity-20" style={{ perspective: '1000px' }}>
                <div
                    className="absolute inset-0 bg-gradient-to-b from-gold/10 to-cyan/10"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,215,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                        transform: 'rotateX(60deg) translateZ(-100px)',
                        transformStyle: 'preserve-3d'
                    }}
                />
            </div>

            {/* Floating 3D Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gold/30 rounded-full blur-3xl animate-pulse" style={{ transform: 'translateZ(50px)' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', transform: 'translateZ(30px)' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', transform: 'translate(-50%, -50%) translateZ(20px)' }} />
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#00FFFF' : '#A855F7',
                            animationDelay: `${i * 0.15}s`,
                            opacity: 0.6,
                            filter: 'blur(1px)'
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto" style={{ perspective: '2000px' }}>
                {/* Section Header with 3D Effect */}
                <div className="text-center mb-20">
                    <div
                        className="inline-block mb-6"
                        style={{
                            transform: 'translateZ(50px)',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-gold/20 via-amber-500/20 to-gold/20 border border-gold/40 text-gold text-sm font-bold backdrop-blur-xl shadow-2xl shadow-gold/50">
                            <Cpu className="w-4 h-4 inline mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                            Why G-Nexus AI?
                        </span>
                    </div>

                    <h2
                        className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6"
                        style={{
                            transform: 'translateZ(40px)',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #00FFFF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 80px rgba(255,215,0,0.5)',
                        }}
                    >
                        The Future of{" "}
                        <span className="block mt-2 bg-gradient-to-r from-cyan via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Ethiopian Business
                        </span>
                    </h2>

                    <p
                        className="text-xl text-muted-foreground max-w-3xl mx-auto"
                        style={{ transform: 'translateZ(30px)' }}
                    >
                        Transforming how businesses operate with intelligent automation,
                        real-time insights, and unparalleled efficiency.
                    </p>
                </div>

                {/* 3D Stats Grid with Isometric Design */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isGold = stat.color === "gold";
                        return (
                            <div
                                key={index}
                                className="group cursor-pointer"
                                style={{
                                    transform: `translateZ(${20 + index * 5}px) rotateY(${index * 2}deg)`,
                                    transformStyle: 'preserve-3d',
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = `translateZ(60px) rotateY(${index * 2}deg) scale(1.1)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `translateZ(${20 + index * 5}px) rotateY(${index * 2}deg) scale(1)`;
                                }}
                            >
                                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-2 border-gold/30 shadow-2xl overflow-hidden">
                                    {/* Animated background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${isGold ? 'from-gold/20 to-amber-500/20' : 'from-cyan/20 to-blue-500/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                                    {/* 3D Icon Container */}
                                    <div
                                        className="relative z-10 mb-4"
                                        style={{
                                            transform: 'translateZ(20px)',
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isGold ? 'bg-gradient-to-br from-gold to-amber-500' : 'bg-gradient-to-br from-cyan to-blue-500'} shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <div className="relative z-10 text-center">
                                        <div
                                            className={`text-5xl font-black mb-2 ${isGold ? 'text-gradient-gold' : 'text-gradient-cyan'}`}
                                            style={{
                                                transform: 'translateZ(15px)',
                                                textShadow: isGold ? '0 0 30px rgba(255,215,0,0.5)' : '0 0 30px rgba(0,255,255,0.5)'
                                            }}
                                        >
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </div>

                                    {/* 3D Edge highlight */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 3D Benefits Cards */}
                <div className="space-y-8 mb-20">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        const isLeft = index % 2 === 0;
                        return (
                            <div
                                key={index}
                                className="group cursor-pointer"
                                style={{
                                    transform: `translateZ(${30 + index * 10}px) ${isLeft ? 'rotateY(-3deg)' : 'rotateY(3deg)'}`,
                                    transformStyle: 'preserve-3d',
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = `translateZ(80px) rotateY(0deg) scale(1.02)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `translateZ(${30 + index * 10}px) ${isLeft ? 'rotateY(-3deg)' : 'rotateY(3deg)'} scale(1)`;
                                }}
                            >
                                <div className="relative p-10 rounded-3xl bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-2xl border-2 border-gold/20 shadow-2xl overflow-hidden">
                                    {/* Animated gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                    {/* Geometric patterns */}
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gold to-transparent transform rotate-45" />
                                    </div>

                                    <div className="relative z-10 flex items-center gap-8">
                                        {/* 3D Icon */}
                                        <div
                                            className="flex-shrink-0"
                                            style={{
                                                transform: 'translateZ(40px)',
                                                transformStyle: 'preserve-3d'
                                            }}
                                        >
                                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-2xl border-2 border-white/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                                                <Icon className="w-12 h-12 text-white drop-shadow-2xl" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3
                                                className="text-3xl font-black text-foreground mb-3 group-hover:text-gold transition-colors"
                                                style={{
                                                    transform: 'translateZ(20px)',
                                                    textShadow: '0 0 20px rgba(255,215,0,0.3)'
                                                }}
                                            >
                                                {benefit.title}
                                            </h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>

                                        {/* 3D Arrow */}
                                        <ArrowRight
                                            className="w-8 h-8 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500"
                                            style={{ transform: 'translateZ(30px)' }}
                                        />
                                    </div>

                                    {/* Bottom glow */}
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 3D CTA Button */}
                <div
                    className="text-center"
                    style={{
                        transform: 'translateZ(60px)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <Button
                        size="lg"
                        className="relative text-xl px-16 py-8 font-black bg-gradient-to-r from-gold via-amber-500 to-gold text-black rounded-2xl shadow-2xl border-4 border-gold/50 hover:scale-110 hover:shadow-gold/50 transition-all duration-500 group overflow-hidden"
                        onClick={() => navigate('/gnexus')}
                        style={{
                            transform: 'translateZ(20px)',
                            boxShadow: '0 20px 60px rgba(255,215,0,0.4), 0 0 80px rgba(255,215,0,0.2)'
                        }}
                    >
                        {/* Animated shine */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                        <span className="relative z-10 flex items-center gap-3">
                            <Rocket className="w-6 h-6" />
                            Explore G-Nexus Platform
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </span>
                    </Button>

                    <p className="text-base text-muted-foreground mt-6 font-semibold">
                        <Sparkles className="w-4 h-4 inline mr-2 text-gold animate-pulse" />
                        Join <span className="text-gold font-bold">10,000+</span> businesses already using G-Nexus AI
                    </p>
                </div>
            </div>
        </section>
    );
};
