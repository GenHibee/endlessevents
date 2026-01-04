import { POAP } from "@/lib/types";
import { motion } from "framer-motion";
import { Award, Calendar, MapPin, Shield } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface POAPCardProps {
  poap: POAP;
}

export const POAPCard = ({ poap }: POAPCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, rotate: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
      
      <div className="relative overflow-hidden rounded-2xl glass p-6">
        {/* Soulbound indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/20 border border-accent/30">
            <Shield className="w-3 h-3 text-accent" />
            <span className="text-xs text-accent font-medium">Soulbound</span>
          </div>
        </div>

        {/* POAP Badge */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-50 animate-pulse-slow" />
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary/50 shadow-glow">
              <img
                src={poap.image}
                alt={poap.eventTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="text-center">
          <Badge className="mb-3 bg-secondary text-secondary-foreground capitalize">
            {poap.role}
          </Badge>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">
            {poap.eventTitle}
          </h3>
          
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(poap.eventDate, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{poap.eventLocation}</span>
            </div>
          </div>
        </div>

        {/* Token Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Token ID</span>
            <span className="font-mono text-foreground">{poap.tokenId}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">Minted</span>
            <span className="text-foreground">{format(poap.mintedAt, "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
