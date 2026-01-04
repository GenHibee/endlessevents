import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { POAPCard } from "@/components/POAPCard";
import { useApp } from "@/contexts/AppContext";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyPOAPs = () => {
  const { poaps, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view your POAPs</h2>
          <Button asChild variant="gradient" className="mt-4"><Link to="/login">Sign In</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My <span className="text-gradient">POAPs</span></h1>
          <p className="text-muted-foreground">Your proof of attendance badges - soulbound and non-transferable.</p>
        </motion.div>

        {poaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {poaps.map((poap, i) => (
              <motion.div key={poap.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <POAPCard poap={poap} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No POAPs yet</h3>
            <p className="text-muted-foreground mb-4">Attend events and check in to earn your first POAP.</p>
            <Button asChild variant="gradient"><Link to="/events">Browse Events</Link></Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPOAPs;
