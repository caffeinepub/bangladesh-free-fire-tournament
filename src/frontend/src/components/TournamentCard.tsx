import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, Sword, Trophy, Users, Wallet } from "lucide-react";
import { motion } from "motion/react";
import type { Tournament } from "../backend.d.ts";

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  Open: {
    label: "Open",
    color: "text-green-400",
    bgColor: "bg-green-400/10 border-green-400/30",
  },
  open: {
    label: "Open",
    color: "text-green-400",
    bgColor: "bg-green-400/10 border-green-400/30",
  },
  Ongoing: {
    label: "Ongoing",
    color: "text-fire-yellow",
    bgColor: "bg-fire-yellow/10 border-fire-yellow/30",
  },
  ongoing: {
    label: "Ongoing",
    color: "text-fire-yellow",
    bgColor: "bg-fire-yellow/10 border-fire-yellow/30",
  },
  Closed: {
    label: "Closed",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 border-muted",
  },
  closed: {
    label: "Closed",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 border-muted",
  },
  Completed: {
    label: "Completed",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/30",
  },
  completed: {
    label: "Completed",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/30",
  },
};

interface TournamentCardProps {
  tournament: Tournament;
  index?: number;
}

export function TournamentCard({ tournament, index = 0 }: TournamentCardProps) {
  const status = statusConfig[tournament.status] ?? statusConfig.Closed;
  const slotsLeft =
    Number(tournament.totalSlots) - Number(tournament.filledSlots);
  const filledPercent =
    Number(tournament.totalSlots) > 0
      ? (Number(tournament.filledSlots) / Number(tournament.totalSlots)) * 100
      : 0;
  const entryFee = tournament.entryFee || "Free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      data-ocid={`tournaments.item.${index + 1}`}
    >
      <div className="fire-border bg-card rounded-lg p-5 card-hover flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-lg text-foreground truncate">
              {tournament.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Sword className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {tournament.format}
              </span>
            </div>
          </div>
          <Badge
            className={`shrink-0 border text-xs font-semibold ${status.bgColor} ${status.color}`}
          >
            {status.label}
          </Badge>
        </div>

        {/* Prize + Entry Fee */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-fire-yellow" />
            <span className="font-heading font-bold text-xl text-gradient-fire">
              {tournament.prizePool}
            </span>
          </div>
          <Badge
            className={`text-xs border font-semibold ${
              entryFee === "Free"
                ? "bg-bd-green/10 border-bd-green/30 text-bd-green"
                : "bg-fire-yellow/10 border-fire-yellow/30 text-fire-yellow"
            }`}
          >
            <Wallet className="w-3 h-3 mr-1" />
            {entryFee}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="truncate">{tournament.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{slotsLeft} slots left</span>
          </div>
        </div>

        {/* Slot progress */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fire-orange to-fire-red transition-all"
              style={{ width: `${filledPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{String(tournament.filledSlots)} filled</span>
            <span>{String(tournament.totalSlots)} total</span>
          </div>
        </div>

        {/* Action */}
        <Link
          to="/tournaments/$id"
          params={{ id: String(tournament.id) }}
          className="mt-auto"
        >
          <Button
            data-ocid={`tournaments.primary_button.${index + 1}`}
            className="w-full bg-fire-orange hover:bg-fire-orange/90 text-background font-semibold"
            size="sm"
          >
            {tournament.status === "Open" || tournament.status === "open"
              ? "Register Now"
              : "View Details"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
