"use client";

import { motion } from "framer-motion";
import PlanCard, { Plan } from "./PlanCard";

interface PlanListProps {
  plans: Plan[];
  onBuyNow: (plan: Plan) => void;
}

export default function PlanList({ plans, onBuyNow }: PlanListProps) {
  return (
    <section className="relative py-8">
      <div className="flex justify-center">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-center items-stretch mx-auto w-fit"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <PlanCard plan={plan} onBuyNow={onBuyNow} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
