import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Crown, Star, Sword, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { LeaderboardEntry, Tournament } from "../backend.d.ts";
import {
  useGlobalLeaderboard,
  useLeaderboard,
  useTournaments,
} from "../hooks/useQueries";

const SAMPLE_ENTRIES: LeaderboardEntry[] = [
  {
    id: BigInt(1),
    rank: BigInt(1),
    teamName: "Phoenix Blaze",
    kills: BigInt(87),
    points: BigInt(2450),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(2),
    rank: BigInt(2),
    teamName: "Dragon Squad BD",
    kills: BigInt(74),
    points: BigInt(2180),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(3),
    rank: BigInt(3),
    teamName: "Tiger Force",
    kills: BigInt(69),
    points: BigInt(1990),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(4),
    rank: BigInt(4),
    teamName: "Storm Chasers",
    kills: BigInt(61),
    points: BigInt(1760),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(5),
    rank: BigInt(5),
    teamName: "Dhaka Destroyers",
    kills: BigInt(55),
    points: BigInt(1540),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(6),
    rank: BigInt(6),
    teamName: "Sylhet Snipers",
    kills: BigInt(48),
    points: BigInt(1320),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(7),
    rank: BigInt(7),
    teamName: "Chittagong Warriors",
    kills: BigInt(43),
    points: BigInt(1180),
    tournamentId: BigInt(0),
  },
  {
    id: BigInt(8),
    rank: BigInt(8),
    teamName: "Rajshahi Royals",
    kills: BigInt(38),
    points: BigInt(980),
    tournamentId: BigInt(0),
  },
];

const rankBadge = (rank: bigint) => {
  const n = Number(rank);
  if (n === 1) return <Crown className="w-5 h-5 text-fire-yellow" />;
  if (n === 2) return <Crown className="w-5 h-5 text-muted-foreground" />;
  if (n === 3) return <Crown className="w-5 h-5 text-amber-600" />;
  return (
    <span className="font-heading font-bold text-muted-foreground text-sm">
      #{n}
    </span>
  );
};

function LeaderboardTable({
  entries,
  loading,
}: { entries: LeaderboardEntry[]; loading?: boolean }) {
  const display = entries.length > 0 ? entries : SAMPLE_ENTRIES;

  if (loading) {
    return (
      <div data-ocid="leaderboard.loading_state" className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={`lb-loading-${i}`}
            className="h-12 bg-card rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (display.length === 0) {
    return (
      <div data-ocid="leaderboard.empty_state" className="text-center py-16">
        <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-heading text-lg font-bold text-muted-foreground">
          No entries yet
        </h3>
        <p className="text-sm text-muted-foreground/60">
          Leaderboard will populate after tournaments complete.
        </p>
      </div>
    );
  }

  return (
    <div className="fire-border rounded-lg overflow-hidden">
      <Table data-ocid="leaderboard.table">
        <TableHeader>
          <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-muted-foreground w-16">Rank</TableHead>
            <TableHead className="text-muted-foreground">Team</TableHead>
            <TableHead className="text-muted-foreground text-center">
              <Sword className="w-4 h-4 inline mr-1" />
              Kills
            </TableHead>
            <TableHead className="text-muted-foreground text-center">
              <Star className="w-4 h-4 inline mr-1" />
              Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {display.map((entry, i) => (
            <TableRow
              key={String(entry.id)}
              data-ocid={`leaderboard.row.${i + 1}`}
              className={`border-border transition-colors ${
                Number(entry.rank) === 1
                  ? "bg-fire-yellow/5 hover:bg-fire-yellow/10"
                  : Number(entry.rank) === 2
                    ? "bg-muted/20 hover:bg-muted/30"
                    : Number(entry.rank) === 3
                      ? "bg-amber-600/5 hover:bg-amber-600/10"
                      : "hover:bg-muted/20"
              }`}
            >
              <TableCell className="w-16">
                <div className="flex items-center justify-center">
                  {rankBadge(entry.rank)}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-heading font-bold text-foreground">
                  {entry.teamName}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-fire-red/20 border-fire-red/30 text-fire-red font-bold">
                  {String(entry.kills)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-fire-yellow/20 border-fire-yellow/30 text-fire-yellow font-bold">
                  {String(entry.points)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TournamentLeaderboard({ tournament }: { tournament: Tournament }) {
  const { data: entries, isLoading } = useLeaderboard(tournament.id);
  return <LeaderboardTable entries={entries ?? []} loading={isLoading} />;
}

export function Leaderboard() {
  const { data: globalEntries, isLoading: globalLoading } =
    useGlobalLeaderboard();
  const { data: tournaments } = useTournaments();
  const [selectedTab, setSelectedTab] = useState("global");

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-fire-orange" />
          <h1 className="font-heading text-4xl font-extrabold text-gradient-fire">
            Leaderboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Top teams from Bangladesh's Free Fire tournaments
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      {!globalLoading && (globalEntries ?? SAMPLE_ENTRIES).length >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto"
        >
          {[1, 0, 2].map((pos) => {
            const entry = (globalEntries ?? SAMPLE_ENTRIES)[pos];
            const heights = ["h-28", "h-36", "h-24"];
            const posIdx = [1, 0, 2].indexOf(pos);
            return (
              <div
                key={pos}
                className={`flex flex-col items-center justify-end ${heights[posIdx]}`}
              >
                <div className="text-center mb-2">
                  {rankBadge(entry.rank)}
                  <div className="font-heading font-bold text-foreground text-sm mt-1 truncate max-w-[100px]">
                    {entry.teamName}
                  </div>
                  <div className="text-xs text-fire-yellow font-bold">
                    {String(entry.points)} pts
                  </div>
                </div>
                <div
                  className={`w-full fire-border bg-card rounded-t-lg ${
                    pos === 0
                      ? "bg-fire-yellow/10"
                      : pos === 1
                        ? "bg-muted/30"
                        : "bg-amber-600/10"
                  } flex-1`}
                />
              </div>
            );
          })}
        </motion.div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-muted mb-6">
          <TabsTrigger
            data-ocid="leaderboard.tab"
            value="global"
            className="data-[state=active]:bg-fire-orange data-[state=active]:text-background"
          >
            Global
          </TabsTrigger>
          {(tournaments ?? []).map((t) => (
            <TabsTrigger
              key={String(t.id)}
              data-ocid="leaderboard.tab"
              value={String(t.id)}
              className="data-[state=active]:bg-fire-orange data-[state=active]:text-background"
            >
              {t.title.length > 20 ? `${t.title.slice(0, 20)}…` : t.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="global">
          <LeaderboardTable
            entries={globalEntries ?? []}
            loading={globalLoading}
          />
        </TabsContent>

        {(tournaments ?? []).map((t) => (
          <TabsContent key={String(t.id)} value={String(t.id)}>
            <TournamentLeaderboard tournament={t} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
