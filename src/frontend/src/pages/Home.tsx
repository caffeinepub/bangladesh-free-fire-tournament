import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Flame,
  Loader2,
  Megaphone,
  Shield,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { Tournament } from "../backend.d.ts";
import { TournamentCard } from "../components/TournamentCard";
import { useAnnouncements, useTournaments } from "../hooks/useQueries";

const SAMPLE_TOURNAMENTS: Tournament[] = [
  {
    id: BigInt(1),
    title: "Season 1 Grand Prix",
    date: "March 25, 2026",
    prizePool: "৳50,000",
    totalSlots: BigInt(32),
    filledSlots: BigInt(18),
    format: "Squad",
    rules: "Standard Free Fire rules apply. No emulators.",
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
];

const stats = [
  {
    icon: Trophy,
    value: "৳90,000+",
    label: "Total Prize Pool",
    color: "text-fire-yellow",
  },
  {
    icon: Users,
    value: "500+",
    label: "Registered Players",
    color: "text-fire-orange",
  },
  {
    icon: Swords,
    value: "12",
    label: "Tournaments Held",
    color: "text-bd-green",
  },
  {
    icon: Shield,
    value: "#1",
    label: "BD Gaming Platform",
    color: "text-fire-red",
  },
];

function AnnouncementsSection() {
  const { data: announcements, isLoading } = useAnnouncements();

  const hasLive = announcements && announcements.length > 0;

  return (
    <section className="container mx-auto px-4 mt-16 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-fire-yellow" />
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Announcements
        </h2>
        {hasLive && (
          <Badge className="bg-fire-orange/20 border-fire-orange/40 text-fire-orange text-xs">
            <Megaphone className="w-3 h-3 mr-1" />
            {announcements.length} new
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div data-ocid="home.loading_state" className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="fire-border bg-card rounded-lg p-5 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : !hasLive ? (
        <div
          data-ocid="home.empty_state"
          className="fire-border bg-card rounded-lg p-8 text-center text-muted-foreground"
        >
          No announcements yet. Check back soon!
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann, i) => {
            const dateStr = new Date(
              Number(ann.createdAt) / 1_000_000,
            ).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <motion.div
                key={String(ann.id)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                data-ocid={`home.item.${i + 1}`}
                className="fire-border bg-card rounded-lg p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-fire-orange/15 border border-fire-orange/30 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-fire-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-foreground">
                    {ann.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ann.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {dateStr}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function Home() {
  const { data: tournaments, isLoading } = useTournaments();
  const displayTournaments = (
    tournaments && tournaments.length > 0 ? tournaments : SAMPLE_TOURNAMENTS
  ).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-freefire-bd.dim_1400x500.jpg"
            alt="Bangladesh Free Fire Tournament"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-fire-orange/20 border-fire-orange/40 text-fire-orange font-semibold text-xs px-3 py-1">
                <Flame className="w-3 h-3 mr-1" />
                Official Platform
              </Badge>
              <Badge className="bg-bd-green/20 border-bd-green/40 text-bd-green font-semibold text-xs px-3 py-1">
                🇧🇩 Bangladesh
              </Badge>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-extrabold leading-tight mb-4">
              <span className="text-gradient-fire">Bangladesh</span>
              <br />
              <span className="text-foreground">Free Fire</span>
              <br />
              <span className="text-foreground">Tournament</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Compete in Bangladesh's most prestigious Free Fire tournaments.
              Glory, prize money, and legendary status await the best.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/tournaments">
                <Button
                  data-ocid="home.primary_button"
                  size="lg"
                  className="bg-fire-orange hover:bg-fire-orange/90 text-background font-bold text-base px-8 gap-2 animate-pulse-glow"
                >
                  <Swords className="w-5 h-5" />
                  Join Tournament
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button
                  data-ocid="home.secondary_button"
                  size="lg"
                  variant="outline"
                  className="border-fire-orange/40 text-foreground hover:bg-fire-orange/10 font-semibold text-base px-8 gap-2"
                >
                  <Trophy className="w-5 h-5 text-fire-yellow" />
                  Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="fire-border bg-card rounded-lg p-4 text-center"
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div
                  className={`font-heading text-2xl font-extrabold ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Featured Tournaments */}
      <section className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Featured Tournaments
            </h2>
            <p className="text-muted-foreground mt-1">
              Join the action — limited slots available
            </p>
          </div>
          <Link to="/tournaments" data-ocid="home.link">
            <Button
              variant="ghost"
              className="text-fire-orange hover:text-fire-orange/80 gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div
            data-ocid="tournaments.loading_state"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="fire-border bg-card rounded-lg p-5 h-56 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayTournaments.map((t, i) => (
              <TournamentCard key={String(t.id)} tournament={t} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Announcements from backend */}
      <AnnouncementsSection />
    </div>
  );
}
