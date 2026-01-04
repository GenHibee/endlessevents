import { Event } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
  variant?: "default" | "featured" | "compact";
}

export const EventCard = ({ event, variant = "default" }: EventCardProps) => {
  const spotsLeft = event.maxAttendees - event.registeredCount;
  const isSoldOut = spotsLeft <= 0;

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="group relative overflow-hidden rounded-2xl glass shadow-card"
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-0">
              {event.category}
            </Badge>
            {event.poapEnabled && (
              <Badge variant="secondary" className="bg-accent/90 text-accent-foreground border-0">
                POAP
              </Badge>
            )}
          </div>
          {isSoldOut && (
            <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
              Sold Out
            </Badge>
          )}
        </div>
        <div className="relative p-6">
          <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-gradient transition-all">
            {event.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(event.date, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>{event.registeredCount}/{event.maxAttendees}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                {event.registrationType === "free" ? "Free" : `$${event.price}`}
              </span>
            </div>
            <Button asChild variant="gradient" size="sm">
              <Link to={`/events/${event.id}`}>
                View Event <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        className="group flex gap-4 p-4 rounded-xl glass hover:border-primary/30 transition-all cursor-pointer"
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {event.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Calendar className="w-3 h-3" />
            <span>{format(event.date, "MMM d")}</span>
            <MapPin className="w-3 h-3 ml-1" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {event.category}
            </Badge>
            {!isSoldOut && (
              <span className="text-xs text-success">{spotsLeft} spots left</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl glass shadow-card hover:border-primary/30 transition-all"
    >
      <Link to={`/events/${event.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
              {event.category}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(event.date, "MMM d")}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{event.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {event.registrationType === "free" ? "Free" : `$${event.price}`}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{spotsLeft > 0 ? `${spotsLeft} left` : "Sold out"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
