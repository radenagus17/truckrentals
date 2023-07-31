import { motion } from "framer-motion";

function FadeVertical({ children }: { children: React.ReactNode }) {
  const container = {
    hidden: { opcaity: 0, y: 100 },
    show: { opacity: 1, y: 0 },
  };
  return <motion.div variants={container}>{children}</motion.div>;
}

export default FadeVertical;
