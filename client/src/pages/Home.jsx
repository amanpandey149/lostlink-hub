import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ShieldCheck, Camera, Star, ArrowRight } from 'lucide-react';

const AnimatedCounter = ({ target, label, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let current = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, 20);
        return () => clearInterval(timer);
    }, [target]);

    return (
        <div className="flex flex-col items-center p-8 glass rounded-3xl relative overflow-hidden group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl"></div>
            <span className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3 relative z-10">
                {count}{suffix}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium tracking-wide text-sm uppercase relative z-10">{label}</span>
        </div>
    );
};

const Home = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-mesh pb-24 flex flex-col items-center overflow-x-hidden">
            {/* Hero Section */}
            <div className="text-center max-w-5xl px-6 pt-24 pb-16 relative w-full">
                {/* Decorative blob */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-white/40 dark:border-slate-700 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">AI Matching System Live</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                    Find what's lost, <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-accent relative">
                         connect your campus.
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-14 max-w-2xl mx-auto leading-relaxed">
                    A premium, AI-powered matching ecosystem designed to effortlessly unite lost items with found ones. Just snap a photo, and let our vision intelligence do the rest.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 px-4 relative z-10">
                    <Link
                        to="/report/lost"
                        className="group flex items-center justify-between p-6 glass glass-hover rounded-3xl w-full sm:w-[320px] text-left overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div>
                            <div className="bg-red-50 dark:bg-red-500/10 p-3 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-500">
                                <Search className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">I Lost Something</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Report & track your item</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full group-hover:bg-red-500 group-hover:translate-x-2 transition-all duration-300 shadow-sm">
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                    </Link>

                    <Link
                        to="/report/found"
                        className="group flex items-center justify-between p-6 glass glass-hover rounded-3xl w-full sm:w-[320px] text-left overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div>
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-500">
                                <MapPin className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">I Found Something</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Help the community</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-full group-hover:bg-secondary group-hover:translate-x-2 transition-all duration-300 shadow-sm">
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="w-full max-w-6xl mx-auto px-6 mt-16 mb-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <AnimatedCounter target={1250} label="Items Reported" suffix="+" />
                    <AnimatedCounter target={890} label="Items Recovered" suffix="+" />
                    <AnimatedCounter target={98} label="Match Accuracy" suffix="%" />
                </div>
            </div>

            {/* Features Row */}
            <div className="max-w-6xl mx-auto px-6 mb-24 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Camera className="w-6 h-6 text-primary" />}
                        title="AI Visual Matching"
                        description="Our neural network analyzes your images to intelligently match colors and shapes without manual tagging."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-6 h-6 text-primary" />}
                        title="Privacy Protected"
                        description="Your identity and personal contact info are shielded securely until you mutually confirm a match."
                    />
                    <FeatureCard
                        icon={<Search className="w-6 h-6 text-primary" />}
                        title="Faceted Search"
                        description="Leverage deep filters across categories, locations, and timestamps to drill down into the database instantly."
                    />
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="w-full max-w-6xl mx-auto px-6 mt-12 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Loved by the community</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">See how Campus Connect is returning countless items back to their rightful owners every single day.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TestimonialCard 
                        name="Sarah Jenkins" 
                        role="Computer Science Student"
                        text="I dropped my keys near the library. Within 2 hours, I got a notification that they were matched using the AI. Literally a lifesaver!"
                        avatar="SJ"
                    />
                    <TestimonialCard 
                        name="Mike Torres" 
                        role="Campus Security"
                        text="The automated matching algorithms save our staff hundreds of hours manually checking logs. The UI is just gorgeous to use every day."
                        avatar="MT"
                    />
                    <TestimonialCard 
                        name="Emily Ross" 
                        role="Design Faculty"
                        text="I uploaded a photo of a wallet I found, and it immediately matched with someone looking for it. A flawless, premium experience."
                        avatar="ER"
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 glass glass-hover rounded-3xl flex flex-col justify-between group">
        <div>
            <div className="bg-primary/10 dark:bg-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                {icon}
            </div>
            <h4 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{description}</p>
        </div>
    </div>
);

const TestimonialCard = ({ name, role, text, avatar }) => (
    <div className="p-8 glass glass-hover rounded-3xl flex flex-col relative group">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-yellow-400 text-slate-900 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-12 scale-50 group-hover:scale-100">
            <Star className="w-4 h-4 fill-current" />
        </div>
        <div className="flex text-yellow-400 mb-6 space-x-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current drop-shadow-sm" />)}
        </div>
        <p className="text-slate-700 dark:text-slate-300 flex-1 font-medium italic mb-8 leading-relaxed">"{text}"</p>
        <div className="flex items-center pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white font-display font-bold text-sm mr-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                {avatar}
            </div>
            <div>
                <h5 className="font-display font-bold text-slate-900 dark:text-white text-sm">{name}</h5>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{role}</span>
            </div>
        </div>
    </div>
);

export default Home;
