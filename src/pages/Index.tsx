import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Ticket, Shield, Award, Zap, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/lib/mockData";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Ticket,
    title: "NFT Tickets",
    description: "Secure, verifiable tickets as NFTs on the blockchain.",
  },
  {
    icon: Shield,
    title: "Fraud-Proof",
    description: "Eliminate counterfeits with on-chain verification.",
  },
  {
    icon: Award,
    title: "POAP Badges",
    description: "Earn soulbound proof of attendance NFTs.",
  },
  {
    icon: Zap,
    title: "Gasless",
    description: "No gas fees for attendees. Ever.",
  },
  {
    icon: Users,
    title: "Social Login",
    description: "Sign in with email or Google. No crypto experience needed.",
  },
  {
    icon: Globe,
    title: "Move Protocol",
    description: "Built on Endless Protocol using Move smart contracts.",
  },
];

const Index = () => {
  const featuredEvents = mockEvents.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Powered by Endless Protocol
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            >
              The Future of{" "}
              <span className="text-gradient">Event Ticketing</span>{" "}
              is Here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Create events, mint NFT tickets, and earn proof of attendance badges. 
              Gasless, fraud-proof, and accessible to everyone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild variant="gradient" size="xl">
                <Link to="/events">
                  Browse Events <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/create-event">Create Your Event</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
            >
              {[
                { value: "10K+", label: "Tickets Minted" },
                { value: "500+", label: "Events Created" },
                { value: "5K+", label: "POAPs Earned" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Why Choose <span className="text-gradient">Endless Events</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of event management with blockchain-powered features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl glass hover:border-primary/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-hero rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                Featured Events
              </h2>
              <p className="text-muted-foreground">
                Discover the hottest events in the Web3 space.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/events">
                View All Events <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} variant="featured" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-primary opacity-90" />
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to Host Your Event?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Join thousands of event organizers who are already using Endless Events 
                to create unforgettable experiences with NFT tickets and POAPs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90">
                  <Link to="/create-event">
                    Create Your First Event <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="link" className="text-primary-foreground">
                  <Link to="/events">Learn More</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
