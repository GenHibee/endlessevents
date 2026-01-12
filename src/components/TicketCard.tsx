import { Ticket } from "@/lib/types";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, CheckCircle2, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TicketCardProps {
  ticket: Ticket;
  showQR?: boolean;
}

export const TicketCard = ({ ticket, showQR = false }: TicketCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl ${
        ticket.isUsed ? "glass opacity-75" : "glass"
      }`}
    >
      {/* Ticket perforation effect */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-background rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-background rounded-l-full" />
      
      <div className="relative flex flex-col md:flex-row">
        {/* Left section - Event info */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                NFT Ticket
              </span>
            </div>
            {ticket.isUsed ? (
              <Badge className="bg-success/20 text-success border-success/30">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Used
              </Badge>
            ) : (
              <Badge variant="outline" className="border-primary/30 text-primary">
                Valid
              </Badge>
            )}
          </div>

          <div className="relative h-24 rounded-lg overflow-hidden mb-4">
            <img
              src={ticket.eventBanner}
              alt={ticket.eventTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card/80 to-transparent" />
          </div>

          <h3 className="font-display font-bold text-lg text-foreground mb-3">
            {ticket.eventTitle}
          </h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(ticket.eventDate, "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{ticket.eventLocation}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Token ID</span>
              <span className="font-mono text-foreground">#{ticket.tokenId}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-border my-6" style={{ borderStyle: 'dashed' }} />

        {/* Right section - QR Code */}
        {showQR && (
          <div className="flex flex-col items-center justify-center p-6 md:w-48 border-t md:border-t-0 border-border">
            <div className="bg-foreground p-3 rounded-xl">
              <QRCodeSVG
                value={ticket.qrCode}
                size={100}
                bgColor="white"
                fgColor="black"
                level="H"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Scan at entry
            </p>
          </div>
        )}
      </div>

      {/* Decorative gradient */}
      {!ticket.isUsed && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary" />
      )}
    </motion.div>

    
  );
};
