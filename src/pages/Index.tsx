import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalcIcon, ArrowLeftRight } from "lucide-react";
import Calculator from "@/components/Calculator";
import CurrencyConverter from "@/components/CurrencyConverter";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

type Tab = "calc" | "fx";

const Index = () => {
  const [tab, setTab] = useState<Tab>("calc");
  const haptic = useHaptics();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "calc", label: "Calculator", icon: <CalcIcon className="h-3.5 w-3.5" /> },
    { id: "fx", label: "Converter", icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
  ];

  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center bg-card/60 border border-border/40 rounded-full p-1 mb-5">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { haptic(10); setTab(t.id); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-full transition-all",
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "calc" ? <Calculator /> : <CurrencyConverter />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Index;
