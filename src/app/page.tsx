'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// A simple placeholder for the Logo component
const Logo = ({ size = "large", withText = false, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <div className="w-10 h-10 bg-primary rounded-md mr-4"></div>
    {withText && <span className="text-2xl font-bold">Qonnectme</span>}
  </div>
);

// A simple placeholder for the Button component
const CustomButton = ({ children, className, variant, href, ...props }) => {
  const baseClasses = "font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 text-lg";
  const variantClasses = variant === 'outline'
    ? "border border-primary text-primary hover:bg-primary/10 neon-text-purple"
    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white neon-border";
  
  const content = (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};


export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverQR, setHoverQR] = useState(false);
  const { theme } = useTheme();

  // This would be replaced by your app's user state
  const user = null; 

  // Track mouse movement for dynamic lighting effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const customQrImageBase64 = "https://i.imgur.com/46KNt6c.png";

  return (
    <div className={cn(
      "min-h-screen text-white overflow-hidden relative",
      theme === 'dark' ? 'bg-black diagonal-lines' : 'bg-white'
      )}>
      
      {theme === 'dark' && (
        <>
          {/* Dynamic lighting effects that follow mouse movement */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 filter blur-[150px] pointer-events-none transition-all duration-300"
              style={{ 
                left: `${mousePosition.x - 400}px`,
                top: `${mousePosition.y - 400}px`,
              }}
            />
            <motion.div 
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"
            />
            <motion.div 
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10,
                delay: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"
            />
            <motion.div 
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 12,
                delay: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl"
            />
          </div>

          {/* Laser light effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="laser-effect h-screen" style={{ left: '20%', animationDelay: '0s', transform: 'rotate(45deg)' }}></div>
            <div className="laser-effect h-screen" style={{ left: '65%', animationDelay: '3s', transform: 'rotate(135deg)' }}></div>
            <div className="laser-effect h-screen" style={{ left: '40%', animationDelay: '6s', transform: 'rotate(30deg)' }}></div>
            <div className="laser-effect h-screen" style={{ left: '85%', animationDelay: '9s', transform: 'rotate(150deg)' }}></div>
          </div>
          
          {/* Scan lines */}
          <div className="scan-line"></div>
          <div className="scan-line" style={{ animationDelay: '2.5s' }}></div>
          
          {/* Geometric patterns in background - adds depth */}
          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-purple-500/30 rotate-45" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-blue-500/30 -rotate-12" />
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 border border-pink-500/30 rotate-30" />
            <div className="absolute -bottom-20 right-1/3 w-full h-48 bg-gradient-to-t from-purple-900/20 to-transparent" />
          </div>
        </>
      )}

      {/* Content */}
      <main className="container mx-auto px-4 py-16 relative z-10 text-foreground">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Logo size="large" withText={false} className="mr-4" />
              <h1 className={cn(
                "text-5xl md:text-7xl font-bold",
                theme === 'dark' ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 neo-glow glow-text" : "text-black"
              )}>
                Qonnectme
              </h1>
            </div>
            <p className={cn("text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto", theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
              Connect with friends in a whole new way. Your identity, your style, your QR code.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <CustomButton href="/dashboard">Go to Profile</CustomButton>
              ) : (
                <>
                  <CustomButton href="/signup">Get Your QR Code</CustomButton>
                  <CustomButton href="/login" variant="outline">Login</CustomButton>
                </>
              )}
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-16"
          >
            <div className={cn("p-6 rounded-xl relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300", theme === 'dark' ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-nightlife' : 'bg-gray-100/80 border')}>
              {theme === 'dark' && <>
                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-purple-500/20 rounded-full filter blur-xl group-hover:bg-purple-500/30 transition-all duration-300"></div>
                <motion.div 
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -left-2 w-16 h-16 bg-purple-500/10 rounded-full filter blur-lg"
                />
              </>
              }
              <h3 className={cn("text-xl font-bold mb-3", theme === 'dark' ? 'neon-text-purple' : 'text-primary')}>Get Your Identity</h3>
              <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Sign up and receive your unique QR code that represents you in the Qonnectme community.</p>
            </div>

            <div className={cn("p-6 rounded-xl relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300", theme === 'dark' ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-nightlife' : 'bg-gray-100/80 border')}>
              {theme === 'dark' && <>
                <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-pink-500/20 rounded-full filter blur-xl group-hover:bg-pink-500/30 transition-all duration-300"></div>
                <motion.div 
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-2 -left-2 w-16 h-16 bg-pink-500/10 rounded-full filter blur-lg"
                />
              </>}
              <h3 className={cn("text-xl font-bold mb-3", theme === 'dark' ? 'neon-text-pink' : 'text-primary')}>Connect with Friends</h3>
              <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Scan QR codes to instantly connect with other members and build your social network.</p>
            </div>

            <div className={cn("p-6 rounded-xl relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300", theme === 'dark' ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-nightlife' : 'bg-gray-100/80 border')}>
              {theme === 'dark' && <>
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-500/20 rounded-full filter blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <motion.div 
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-2 -left-2 w-16 h-16 bg-blue-500/10 rounded-full filter blur-lg"
                />
              </>}
              <h3 className={cn("text-xl font-bold mb-3", theme === 'dark' ? 'neon-text-blue' : 'text-primary')}>Wear Your Code</h3>
              <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>Shop exclusive products featuring your personal QR code and showcase your digital identity.</p>
            </div>
          </motion.div>

          {/* QR Code Demo Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-24 max-w-5xl w-full"
          >
            <div className={cn("p-8 rounded-xl relative overflow-hidden", theme === 'dark' ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-nightlife' : 'bg-gray-100/80 border')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className={cn("text-3xl font-bold mb-4", theme === 'dark' ? 'text-white neo-glow glow-text' : 'text-black')}>Your Social Identity</h2>
                  <p className={cn("mb-6", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                    Your QR code is more than just a pattern – it's your digital identity.
                    Wear it, share it, and connect instantly with new friends.
                  </p>
                  <ul className={cn("space-y-2", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Each code is uniquely generated for you
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      When scanned, it sends a friend request
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Get it printed on clothing, accessories and more
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <div 
                    className="relative" 
                    onMouseEnter={() => setHoverQR(true)} 
                    onMouseLeave={() => setHoverQR(false)}
                  >
                    {theme === 'dark' && <>
                      {/* Animated radial rings around QR */}
                      <div className="absolute inset-0 -m-12 pointer-events-none">
                        <div className={`absolute inset-0 rounded-full bg-purple-500/10 transition-all duration-500 ${hoverQR ? 'scale-110 opacity-70' : 'scale-100 opacity-40'}`} style={{ animation: 'pulse-slow 3s infinite' }}></div>
                        <div className={`absolute inset-0 rounded-full bg-pink-500/10 transition-all duration-500 ${hoverQR ? 'scale-125 opacity-70' : 'scale-100 opacity-30'}`} style={{ animation: 'pulse-slow 4s infinite 1s' }}></div>
                        <div className={`absolute inset-0 rounded-full bg-blue-500/10 transition-all duration-500 ${hoverQR ? 'scale-150 opacity-70' : 'scale-100 opacity-20'}`} style={{ animation: 'pulse-slow 5s infinite 2s' }}></div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg filter blur-md opacity-50 -m-1 animated-gradient"></div>
                    </>}
                    <motion.div
                      animate={theme === 'dark' ? { rotate: [3, -3, 3], y: [0, -10, 0] } : {}}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className={cn("p-4 rounded-lg relative transition-all duration-300", theme === 'dark' ? `bg-black ${hoverQR ? 'scale-110 shadow-[0_0_30px_rgba(168,85,247,0.8)]' : 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'}` : 'bg-white shadow-lg')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Image 
                        src={customQrImageBase64}
                        alt="Demo QR Code"
                        width={200} 
                        height={200}
                        className={cn("mx-auto transition-all duration-300 rounded-md", theme === 'dark' && hoverQR ? 'qr-pulse scale-105' : '')}
                        data-ai-hint="qr code"
                      />
                      <p className={cn("text-center mt-2 text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>   Scan Me I like you</p>
                      
                      {theme === 'dark' && <>
                        {/* Decorative corner elements for QR code */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500 opacity-80"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-pink-500 opacity-80"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500 opacity-80"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500 opacity-80"></div>
                      </>}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-24 text-center max-w-3xl"
          >
            <h2 className={cn("text-3xl md:text-4xl font-bold mb-6", theme === 'dark' ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 neo-glow glow-text" : "text-black")}>
              Ready to join the community?
            </h2>
            <p className={cn("mb-8", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
              Create your account, get your unique QR code, and start connecting with friends in an exciting new way.
            </p>
            <CustomButton href="/signup" className="py-4 px-10 text-xl relative overflow-hidden group">
              {/* Shine effect */}
              <div className="absolute w-24 h-full -skew-x-12 top-0 -left-32 bg-white/10 group-hover:animate-shine pointer-events-none"></div>
              {user ? 'Go to Profile' : 'Get Started'}
            </CustomButton>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn("relative z-10 border-t", theme === 'dark' ? 'bg-black/40 backdrop-blur-sm border-gray-800' : 'bg-gray-50 border-gray-200', 'py-8')}>
        {theme === 'dark' && (
          <div className="absolute top-0 -translate-y-full right-10 flex items-end space-x-1 h-16">
            <div className="equalizer-bar h-5"></div>
            <div className="equalizer-bar h-8"></div>
            <div className="equalizer-bar h-4"></div>
            <div className="equalizer-bar h-10"></div>
            <div className="equalizer-bar h-6"></div>
            <div className="equalizer-bar h-3"></div>
          </div>
        )}
        <div className="container mx-auto px-4 text-center">
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-500">© {new Date().getFullYear()} Qonnectme. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
