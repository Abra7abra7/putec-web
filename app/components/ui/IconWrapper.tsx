"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface IconWrapperProps {
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function IconWrapper({
    children,
    size = "md",
    className = ""
}: IconWrapperProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12"
    };

    return (
        <motion.div
            whileHover={{
                scale: 1.1,
                rotate: 5,
                backgroundColor: "rgba(214, 173, 96, 0.15)"
            }}
            whileTap={{ scale: 0.9 }}
            className={`
        relative flex items-center justify-center rounded-2xl
        bg-accent/5 border border-accent/20 transition-all duration-300
        group cursor-pointer overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {/* Duo-tone Background Element */}
            <motion.div
                className="absolute -inset-1 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
            />

            {/* The Icon */}
            <div className="relative z-10 text-accent group-hover:text-accent-dark transition-colors duration-300">
                {children}
            </div>

            {/* Shine Effect */}
            <motion.div
                className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"
            />
        </motion.div>
    );
}
