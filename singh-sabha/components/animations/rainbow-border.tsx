"use client";

import { motion } from "framer-motion";

export const RainbowBorder: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative group">
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
        animate={{
          background: [
            "linear-gradient(to right, #ff5f6d, #ffc371)",
            "linear-gradient(to right, #24c6dc, #514a9d)",
            "linear-gradient(to right, #ff00cc, #333399)",
            "linear-gradient(to right, #ff5f6d, #ffc371)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
};
