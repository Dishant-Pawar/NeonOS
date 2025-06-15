import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Monitor, Smartphone, Gamepad2, Shield, Palette, Zap, Download, Play, Star, Check, X, ChevronRight, Cpu, HardDrive, Wifi, Camera, Music, FileText, Terminal, Image, Video, Mail, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedFeatures, setAnimatedFeatures] = useState<number[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through featured highlights
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 6);
    }, 3000);

    // Add floating animation to random features
    const animationInterval = setInterval(() => {
      const randomFeatures = Array.from({ length: 2 }, () => Math.floor(Math.random() * 6));
      setAnimatedFeatures(randomFeatures);
      
      setTimeout(() => setAnimatedFeatures([]), 2000);
    }, 4000);

    return () => {
      clearInterval(featureInterval);
      clearInterval(animationInterval);
    };
  }, []);

  const features = [{
    icon: <Monitor className="w-8 h-8" />,
    title: "Multiple Desktop Layouts",
    description: "Switch between Windows, macOS, and Linux desktop environments seamlessly",
    color: "from-blue-500 to-cyan-500"
  }, {
    icon: <Smartphone className="w-8 h-8" />,
    title: "D008 Connect",
    description: "Sync your Android phone with file transfer and notifications",
    color: "from-green-500 to-emerald-500"
  }, {
    icon: <Gamepad2 className="w-8 h-8" />,
    title: "Gaming Ready",
    description: "Steam, Proton, Lutris pre-installed with game mode optimization",
    color: "from-purple-500 to-pink-500"
  }, {
    icon: <Shield className="w-8 h-8" />,
    title: "D008 Assist AI",
    description: "Voice assistant with local LLM for privacy-first productivity",
    color: "from-red-500 to-orange-500"
  }, {
    icon: <Palette className="w-8 h-8" />,
    title: "Deep Customization",
    description: "Accent colors, themes, live wallpapers with motion blur and parallax",
    color: "from-indigo-500 to-purple-500"
  }, {
    icon: <Zap className="w-8 h-8" />,
    title: "Performance Optimized",
    description: "Built on Ubuntu LTS with hardware-accelerated animations",
    color: "from-yellow-500 to-amber-500"
  }];

  const editions = [{
    name: "D008 Core",
    price: "Free",
    description: "Perfect for everyday users",
    features: ["All core features", "Multiple desktop layouts", "D008 Connect", "Basic AI assistant", "Software center", "Gaming support", "Community support"],
    highlighted: false
  }, {
    name: "D008 Pro",
    price: "$49",
    description: "For power users and professionals",
    features: ["Everything in Core", "Wine + PlayOnLinux", "Advanced productivity tools", "Priority support", "Extended customization", "Pro-grade development tools", "Enhanced security features"],
    highlighted: true
  }, {
    name: "D008 Lite",
    price: "Free",
    description: "Lightweight for older hardware",
    features: ["XFCE/LXQt base", "Essential apps only", "Optimized performance", "Low resource usage", "Basic customization", "Community support"],
    highlighted: false
  }, {
    name: "D008 Edu",
    price: "$19",
    description: "Educational institutions",
    features: ["Educational apps pre-installed", "Classroom management tools", "Student-friendly interface", "Bulk licensing available", "Educational support", "Parental controls"],
    highlighted: false
  }];

  const apps = [{
    category: "Office",
    app: "LibreOffice",
    icon: <FileText className="w-6 h-6" />
  }, {
    category: "Browser",
    app: "Firefox",
    icon: <Monitor className="w-6 h-6" />
  }, {
    category: "Email",
    app: "Thunderbird",
    icon: <Mail className="w-6 h-6" />
  }, {
    category: "Photo Editor",
    app: "GIMP",
    icon: <Image className="w-6 h-6" />
  }, {
    category: "Video Editor",
    app: "Kdenlive",
    icon: <Video className="w-6 h-6" />
  }, {
    category: "Music Player",
    app: "Rhythmbox",
    icon: <Music className="w-6 h-6" />
  }, {
    category: "Terminal",
    app: "GNOME Terminal",
    icon: <Terminal className="w-6 h-6" />
  }, {
    category: "Development",
    app: "VS Code",
    icon: <Settings className="w-6 h-6" />
  }];

  const testimonials = [{
    name: "Sarah Chen",
    role: "Software Developer",
    content: "D008 OS combines the best of all worlds. Finally, an OS that just works!",
    rating: 5
  }, {
    name: "Marcus Rodriguez",
    role: "Gaming Enthusiast",
    content: "Gaming performance is incredible. Steam games run better than on Windows!",
    rating: 5
  }, {
    name: "Dr. Emily Watson",
    role: "University Professor",
    content: "D008 Edu edition is perfect for our computer labs. Students love it!",
    rating: 5
  }];

  const faqs = [{
    question: "Is D008 OS compatible with my hardware?",
    answer: "D008 OS includes automatic driver installation and supports most modern hardware. Check our compatibility list on the download page."
  }, {
    question: "Can I run Windows applications?",
    answer: "Yes! D008 Pro includes Wine and PlayOnLinux pre-configured for Windows app compatibility."
  }, {
    question: "How does D008 Connect work?",
    answer: "D008 Connect seamlessly integrates with Android phones for file transfer, notifications, and more through a secure wireless connection."
  }, {
    question: "Is my data secure with D008 Assist AI?",
    answer: "Absolutely! D008 Assist prioritizes privacy with local LLM processing and offline fallbacks for all critical features."
  }, {
    question: "Can I upgrade between editions?",
    answer: "Yes, you can upgrade from any edition to Pro at any time. Educational licenses have special upgrade paths."
  }];

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-4 py-20 relative z-10 bg-slate-950">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  D008
                </span>
                <span className="text-white"> OS</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light animate-fade-in">
                One System. Endless Possibilities.
              </p>
            </div>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              The next-generation operating system that combines the best of Windows, macOS, and Linux. 
              Modern, fast, and infinitely customizable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 animate-bounce">
                <Download className="w-5 h-5 mr-2" />
                Download Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/demo')} className="border-white/20 hover:bg-white/10 px-8 py-4 text-lg rounded-full text-rose-600 hover:scale-105 transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/pdf-editor')} className="border-white/20 hover:bg-white/10 px-8 py-4 text-lg rounded-full text-green-600 hover:scale-105 transition-all duration-300">
                <FileText className="w-5 h-5 mr-2" />
                PDF Editor
              </Button>
            </div>
            
            <div className="mt-12 text-center animate-fade-in">
              <p className="text-gray-400 text-sm mb-2">Trusted by developers worldwide</p>
              <div className="flex justify-center items-center space-x-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                <span className="text-gray-300 ml-2">4.9/5 from 10,000+ users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto animate-fade-in">
              Experience the future of computing with innovative features designed for modern workflows
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const isHighlighted = currentFeature === index;
              const isFloating = animatedFeatures.includes(index);
              
              return (
                <Card 
                  key={index} 
                  className={`relative bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-500 hover:scale-105 ${
                    isHighlighted ? 'ring-2 ring-blue-400 scale-105 shadow-2xl' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {isHighlighted && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 rounded-lg animate-pulse`}></div>
                  )}
                  
                  <CardHeader className="relative z-10">
                    <div className={`${isHighlighted ? `bg-gradient-to-r ${feature.color}` : ''} text-blue-400 mb-4 p-2 rounded-lg inline-block transition-all duration-500 ${isHighlighted ? 'animate-pulse' : ''}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className={`text-white text-xl transition-all duration-300 ${isHighlighted ? 'text-2xl' : ''}`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-300 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Animated particles for highlighted feature */}
                  {isHighlighted && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          
          {/* Live feature indicator */}
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentFeature === index ? 'bg-blue-400 scale-150' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live feature showcase</span>
            </p>
          </div>
        </div>
      </section>

      {/* Editions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Edition
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From individual users to enterprises, we have the perfect D008 OS edition for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {editions.map((edition, index) => <Card key={index} className={`relative ${edition.highlighted ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-blue-400 scale-105' : 'bg-white/5 border-white/10'} hover:scale-110 transition-all duration-300`}>
                {edition.highlighted && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                    Most Popular
                  </Badge>}
                <CardHeader className="text-center bg-black">
                  <CardTitle className="text-white text-2xl">{edition.name}</CardTitle>
                  <div className="text-3xl font-bold text-white mt-4">
                    {edition.price}
                  </div>
                  <CardDescription className="text-gray-400">{edition.description}</CardDescription>
                </CardHeader>
                <CardContent className="bg-zinc-950">
                  <ul className="space-y-3">
                    {edition.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>)}
                  </ul>
                  <Button className={`w-full mt-6 ${edition.highlighted ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-white/10 hover:bg-white/20'}`}>
                    {edition.price === "Free" ? "Download" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Built-in Applications */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need, Built-in
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              D008 OS comes with a complete suite of applications for work, creativity, and entertainment
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apps.map((app, index) => <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-400 mb-4 flex justify-center">
                    {app.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{app.category}</h3>
                  <p className="text-gray-400 text-sm">{app.app}</p>
                </CardContent>
              </Card>)}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Plus support for Snap, Flatpak, and traditional Debian packages
            </p>
            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-zinc-950">
              View All Applications
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Users Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-white/5 border-white/10 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-blue-400 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of users who have already made the switch to D008 OS. 
              Download now and transform your computing experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105">
                <Download className="w-5 h-5 mr-2" />
                Download D008 OS
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 px-8 py-4 text-lg rounded-full text-rose-500">
                View System Requirements
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Minimum Requirements</h3>
                <p className="text-gray-400 text-sm">2GB RAM, 20GB Storage</p>
              </div>
              <div>
                <HardDrive className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Recommended</h3>
                <p className="text-gray-400 text-sm">4GB RAM, 50GB Storage</p>
              </div>
              <div>
                <Wifi className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Internet</h3>
                <p className="text-gray-400 text-sm">Required for updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">D008 OS</h3>
            <p className="text-gray-400 mb-6">One System. Endless Possibilities.</p>
            <div className="flex justify-center space-x-8 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
            <p className="text-gray-500 text-xs mt-6">
              © 2024 D008 OS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
