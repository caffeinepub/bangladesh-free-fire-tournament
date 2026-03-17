import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, Search, Swords } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Tournament } from "../backend.d.ts";
import { TournamentCard } from "../components/TournamentCard";
import { useTournaments } from "../hooks/useQueries";

const SAMPLE_TOURNAMENTS: Tournament[] = [
  {
    id: BigInt(1),
    title: "Season 1 Grand Prix",
    date: "March 25, 2026",
    prizePool: "৳50,000",
    totalSlots: BigInt(32),
    filledSlots: BigInt(18),
    format: "Squad",
    rules: "Standard Free Fire rules. No emulators allowed. Squad of 4.",
    status: "Open",
    entryFee: "৳500",
    pdfKey: "",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    title: "Pro League: Dhaka Cup",
    date: "April 10, 2026",
    prizePool: "৳25,000",
    totalSlots: BigInt(16),
    filledSlots: BigInt(16),
    format: "Duo",
    rules: "Standard Free Fire rules. Top 10 teams qualify.",
    status: "Closed",
    entryFee: "৳1,000",
    pdfKey: "",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    title: "Chittagong Blaze Open",
    date: "April 28, 2026",
    prizePool: "৳15,000",
    totalSlots: BigInt(64),
    filledSlots: BigInt(12),
    format: "Solo",
    rules: "Open for all. Standard rules apply.",
    status: "Open",
    entryFee: "Free",
    pdfKey: "",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    title: "Sylhet Thunder Championship",
    date: "March 20, 2026",
    prizePool: "৳20,000",
    totalSlots: BigInt(32),
    filledSlots: BigInt(32),
    format: "Squad",
    rules: "Invitation only for qualified teams.",
    status: "Ongoing",
    entryFee: "৳5,000",
    pdfKey: "",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(5),
    title: "Rajshahi Rising Stars",
    date: "February 14, 2026",
    prizePool: "৳10,000",
    totalSlots: BigInt(20),
    filledSlots: BigInt(20),
    format: "Duo",
    rules: "Standard rules. Players under 18 only.",
    status: "Completed",
    entryFee: "৳100",
    pdfKey: "",
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(6),
    title: "Khulna Battle Royale",
    date: "May 5, 2026",
    prizePool: "৳12,000",
    totalSlots: BigInt(40),
    filledSlots: BigInt(5),
    format: "Solo",
    rules: "Open for all. Classic mode only.",
    status: "Open",
    entryFee: "Free",
    pdfKey: "",
    createdAt: BigInt(Date.now()),
  },
];

const STATUS_FILTERS = ["All", "Open", "Ongoing", "Closed", "Completed"];

export function Tournaments() {
  const { data: tournaments, isLoading } = useTournaments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const allTournaments =
    tournaments && tournaments.length > 0 ? tournaments : SAMPLE_TOURNAMENTS;

  const filtered = allTournaments.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.format.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Swords className="w-8 h-8 text-fire-orange" />
          <h1 className="font-heading text-4xl font-extrabold text-gradient-fire">
            Tournaments
          </h1>
        </div>
        <p className="text-muted-foreground">
          Bangladesh's premier Free Fire competition hub
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="tournaments.search_input"
            placeholder="Search tournaments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border focus:border-fire-orange/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {STATUS_FILTERS.map((s) => (
            <button
              type="button"
              key={s}
              data-ocid="tournaments.tab"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-fire-orange text-background font-bold"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-muted-foreground">
          {filtered.length} tournament{filtered.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          data-ocid="tournaments.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="fire-border bg-card rounded-lg p-5 h-64 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="tournaments.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Swords className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-heading text-xl font-bold text-muted-foreground">
            No tournaments found
          </h3>
          <p className="text-muted-foreground/60 mt-2">
            Try changing your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <TournamentCard key={String(t.id)} tournament={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
