import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Ticket,
  Award,
  ArrowLeft,
  Share2,
  Heart,
  Check,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp } from "@/contexts/AppContext";
import { mockEvents } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, tickets } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const spotsLeft = event.maxAttendees - event.registeredCount;
  const isSoldOut = spotsLeft <= 0;
  const hasTicket = tickets.some((t) => t.eventId === event.id);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsRegistering(true);
    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegistering(false);
    
    toast({
      title: "Registration Successful! 🎉",
      description: "Your NFT ticket has been minted and added to your wallet.",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/events">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary/90 text-primary-foreground">
                  {event.category}
                </Badge>
                {event.poapEnabled && (
                  <Badge className="bg-accent/90 text-accent-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    POAP
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="glass" size="icon-sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="glass" size="icon-sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>

            {/* Host Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl glass"
            >
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Event Host
              </h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/30">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.hostName}`} />
                  <AvatarFallback>{event.hostName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{event.hostName}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
            </motion.div>

            {/* POAP Info */}
            {event.poapEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Proof of Attendance NFT
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Attend this event and check in to receive a unique, non-transferable 
                      POAP badge that proves you were there. This soulbound NFT will be 
                      permanently linked to your wallet.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-28 p-6 rounded-2xl glass"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {event.registrationType === "free" ? "Free" : `$${event.price}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Spots Left</p>
                  <p className={`text-xl font-bold ${isSoldOut ? "text-destructive" : "text-success"}`}>
                    {isSoldOut ? "Sold Out" : spotsLeft}
                  </p>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.registeredCount} registered
                  </span>
                  <span>{event.maxAttendees} max</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.registeredCount / event.maxAttendees) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full bg-gradient-primary rounded-full"
                  />
                </div>
              </div>

              {hasTicket ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-success/20 text-success">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">You're registered!</span>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/my-tickets">
                      <Ticket className="w-4 h-4 mr-2" />
                      View Your Ticket
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  variant="gradient"
                  size="lg"
                  disabled={isSoldOut || isRegistering}
                  onClick={handleRegister}
                >
                  {isRegistering ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Minting Ticket...
                    </>
                  ) : isSoldOut ? (
                    "Sold Out"
                  ) : (
                    <>
                      <Ticket className="w-4 h-4 mr-2" />
                      Register Now
                    </>
                  )}
                </Button>
              )}

              {/* Smart Contract Info */}
              {event.contractAddress && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Smart Contract</p>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs font-mono text-primary hover:underline"
                  >
                    {event.contractAddress}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
