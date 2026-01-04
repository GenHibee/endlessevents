import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TicketCard } from "@/components/TicketCard";
import { useApp } from "@/contexts/AppContext";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyTickets = () => {
  const { tickets, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view your tickets</h2>
          <Button asChild variant="gradient" className="mt-4">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My <span className="text-gradient">Tickets</span></h1>
          <p className="text-muted-foreground">Your NFT tickets for upcoming and past events.</p>
        </motion.div>

        {tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket, i) => (
              <motion.div key={ticket.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <TicketCard ticket={ticket} showQR />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
            <p className="text-muted-foreground mb-4">Browse events and register to get your first NFT ticket.</p>
            <Button asChild variant="gradient"><Link to="/events">Browse Events</Link></Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
