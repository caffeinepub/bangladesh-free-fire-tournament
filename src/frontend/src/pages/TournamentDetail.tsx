import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  Download,
  FileText,
  Loader2,
  Smartphone,
  Swords,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Tournament } from "../backend.d.ts";
import { useRegisterForTournament, useTournament } from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";

const SAMPLE_TOURNAMENT: Tournament = {
  id: BigInt(1),
  title: "Season 1 Grand Prix",
  date: "March 25, 2026",
  prizePool: "৳50,000",
  totalSlots: BigInt(32),
  filledSlots: BigInt(18),
  format: "Squad",
  rules:
    "1. All players must use their official Free Fire IDs.\n2. No emulators allowed — mobile only.\n3. Squad format: teams of 4 players.\n4. Cheating or hacking results in immediate disqualification.\n5. Matches will be conducted via custom rooms.\n6. Final decision rests with tournament admins.\n7. Cash prizes will be transferred within 7 business days.",
  status: "Open",
  entryFee: "৳500",
  pdfKey: "",
  createdAt: BigInt(Date.now()),
};

const prizeBreakdown = [
  { place: "1st Place 🥇", prize: "৳25,000" },
  { place: "2nd Place 🥈", prize: "৳15,000" },
  { place: "3rd Place 🥉", prize: "৳7,000" },
  { place: "4th–5th Place", prize: "৳1,500 each" },
];

const BKASH_NUMBER = "01712-345678";

function BkashPaymentPanel() {
  return (
    <div
      className="rounded-xl p-4 mb-5"
      style={{
        background: "linear-gradient(135deg, #3d0521 0%, #1a0010 100%)",
        border: "1px solid #E2136E55",
        boxShadow: "0 0 18px #E2136E30, inset 0 0 12px #E2136E10",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-sm"
          style={{ background: "#E2136E", color: "#fff" }}
        >
          b
        </div>
        <div>
          <span
            className="font-heading font-bold text-sm"
            style={{ color: "#E2136E" }}
          >
            bKash Payment Required
          </span>
          <div className="text-[10px]" style={{ color: "#E2136E99" }}>
            Mobile Financial Service
          </div>
        </div>
        <Badge
          className="ml-auto text-[10px] border px-2 py-0.5"
          style={{
            background: "#E2136E20",
            borderColor: "#E2136E50",
            color: "#E2136E",
          }}
        >
          Required
        </Badge>
      </div>

      <div
        className="rounded-lg p-3 mb-3 text-sm space-y-1.5"
        style={{ background: "#E2136E15", border: "1px solid #E2136E30" }}
      >
        <p className="font-medium" style={{ color: "#f9b4d0" }}>
          Send registration fee to:
        </p>
        <div className="flex items-center gap-2">
          <Smartphone
            className="w-4 h-4 shrink-0"
            style={{ color: "#E2136E" }}
          />
          <span
            className="font-heading font-extrabold text-base tracking-wider"
            style={{ color: "#fff" }}
          >
            {BKASH_NUMBER}
          </span>
          <Badge
            className="text-[10px] px-1.5"
            style={{
              background: "#E2136E30",
              color: "#f9b4d0",
              border: "none",
            }}
          >
            Merchant
          </Badge>
        </div>
      </div>

      <p className="text-[11px] leading-snug" style={{ color: "#E2136E99" }}>
        ⚠️ Please send payment{" "}
        <strong style={{ color: "#f9b4d0" }}>before submitting</strong>. Your
        registration will be verified against your Transaction ID.
      </p>
    </div>
  );
}

export function TournamentDetail() {
  const { id } = useParams({ from: "/tournaments/$id" });
  const tournamentId = (() => {
    try {
      return BigInt(id);
    } catch {
      return BigInt(1);
    }
  })();
  const { data: tournament, isLoading } = useTournament(tournamentId);
  const registerMutation = useRegisterForTournament();
  const { getFileUrl } = useStorageClient();

  const [form, setForm] = useState({
    teamName: "",
    captainName: "",
    playerIds: "",
    contact: "",
    bkashTxId: "",
  });
  const [registered, setRegistered] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const t = tournament ?? SAMPLE_TOURNAMENT;
  const isOpen = t.status === "Open" || t.status === "open";
  const slotsLeft = Number(t.totalSlots) - Number(t.filledSlots);
  const entryFee = t.entryFee || "Free";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const combinedContact = `${form.contact} | bKash: ${form.bkashTxId}`;
    const result = await registerMutation.mutateAsync({
      tournamentId: t.id,
      teamName: form.teamName,
      captainName: form.captainName,
      playerIds: form.playerIds,
      contact: combinedContact,
    });
    if (result.__kind__ === "ok") setRegistered(true);
  };

  const handleDownloadPdf = async () => {
    if (!t.pdfKey) return;
    setPdfLoading(true);
    try {
      const url = await getFileUrl(t.pdfKey);
      window.open(url, "_blank");
    } catch {
      // ignore
    } finally {
      setPdfLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="tournament.loading_state"
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Loader2 className="w-8 h-8 text-fire-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link
        to="/tournaments"
        data-ocid="tournament.link"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Tournaments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="fire-border bg-card rounded-lg p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      className={`${
                        isOpen
                          ? "bg-green-400/10 border-green-400/30 text-green-400"
                          : "bg-muted border-muted text-muted-foreground"
                      }`}
                    >
                      {t.status}
                    </Badge>
                    <Badge
                      className={`border text-xs font-semibold ${
                        entryFee === "Free"
                          ? "bg-bd-green/10 border-bd-green/30 text-bd-green"
                          : "bg-fire-yellow/10 border-fire-yellow/30 text-fire-yellow"
                      }`}
                    >
                      <Wallet className="w-3 h-3 mr-1" />
                      {entryFee}
                    </Badge>
                  </div>
                  <h1 className="font-heading text-3xl font-extrabold text-foreground">
                    {t.title}
                  </h1>
                </div>
                {t.pdfKey && (
                  <Button
                    data-ocid="tournament.secondary_button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPdf}
                    disabled={pdfLoading}
                    className="border-fire-orange/40 text-fire-orange hover:bg-fire-orange/10 gap-1.5 shrink-0"
                  >
                    {pdfLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <Download className="w-3 h-3" />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Trophy className="w-5 h-5 text-fire-yellow mx-auto mb-1" />
                  <div className="font-heading font-bold text-gradient-fire text-lg">
                    {t.prizePool}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Prize Pool
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Swords className="w-5 h-5 text-fire-orange mx-auto mb-1" />
                  <div className="font-heading font-bold text-foreground">
                    {t.format}
                  </div>
                  <div className="text-xs text-muted-foreground">Format</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-bd-green mx-auto mb-1" />
                  <div className="font-heading font-bold text-foreground text-sm">
                    {t.date}
                  </div>
                  <div className="text-xs text-muted-foreground">Date</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="w-5 h-5 text-fire-red mx-auto mb-1" />
                  <div className="font-heading font-bold text-foreground">
                    {slotsLeft}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Slots Left
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="fire-border bg-card rounded-lg p-6">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-fire-orange" /> Tournament
                Rules
              </h2>
              <div className="space-y-2">
                {t.rules.split("\n").map((rule) => (
                  <div
                    key={rule.slice(0, 30)}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-fire-orange font-bold mt-0.5">›</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Prize breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="fire-border bg-card rounded-lg p-6">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-fire-yellow" /> Prize Breakdown
              </h2>
              <div className="space-y-3">
                {prizeBreakdown.map((p) => (
                  <div
                    key={p.place}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-foreground font-medium">
                      {p.place}
                    </span>
                    <span className="font-heading font-bold text-gradient-fire">
                      {p.prize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Registration panel */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {registered ? (
              <div
                data-ocid="tournament.success_state"
                className="fire-border bg-card rounded-lg p-6 text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Registered! 🎮
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your team has been registered. SK Sport BD will verify your
                  bKash payment and confirm your slot.
                </p>
              </div>
            ) : isOpen ? (
              <div className="fire-border bg-card rounded-lg p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #006a4e, #009060)",
                      }}
                    >
                      <span className="text-white font-extrabold text-xs">
                        SK
                      </span>
                    </div>
                    <h2 className="font-heading text-lg font-extrabold text-foreground leading-tight">
                      SK Sport Bangladesh Club
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground pl-9">
                    Official Tournament Registration
                  </p>
                  <div className="pl-9 mt-1">
                    <Badge
                      className="text-[10px] px-2 py-0.5 border"
                      style={{
                        background: "oklch(0.47 0.14 155 / 0.15)",
                        borderColor: "oklch(0.47 0.14 155 / 0.40)",
                        color: "oklch(0.65 0.14 155)",
                      }}
                    >
                      Powered by SK Sport BD
                    </Badge>
                  </div>
                </div>

                <Separator className="mb-4 bg-border" />

                <BkashPaymentPanel />

                <p className="text-xs text-muted-foreground mb-4">
                  {slotsLeft} slots remaining
                </p>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Team Name</Label>
                    <Input
                      data-ocid="tournament.input"
                      required
                      placeholder="e.g. Phoenix Squad"
                      value={form.teamName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, teamName: e.target.value }))
                      }
                      className="bg-muted border-border focus:border-fire-orange/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Captain Name</Label>
                    <Input
                      data-ocid="tournament.input"
                      required
                      placeholder="Captain's in-game name"
                      value={form.captainName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, captainName: e.target.value }))
                      }
                      className="bg-muted border-border focus:border-fire-orange/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Player IDs</Label>
                    <Textarea
                      data-ocid="tournament.textarea"
                      required
                      placeholder="Free Fire IDs, comma-separated"
                      value={form.playerIds}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, playerIds: e.target.value }))
                      }
                      className="bg-muted border-border focus:border-fire-orange/50 min-h-[72px] resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      Contact (Phone/Email)
                    </Label>
                    <Input
                      data-ocid="tournament.input"
                      required
                      placeholder="01XXXXXXXXX"
                      value={form.contact}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, contact: e.target.value }))
                      }
                      className="bg-muted border-border focus:border-fire-orange/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold"
                        style={{ background: "#E2136E", color: "#fff" }}
                      >
                        b
                      </span>
                      bKash Transaction ID
                      <span
                        className="text-xs font-normal"
                        style={{ color: "#E2136E" }}
                      >
                        (required)
                      </span>
                    </Label>
                    <Input
                      data-ocid="tournament.input"
                      required
                      placeholder="e.g. 8N7A3X2Q1P"
                      value={form.bkashTxId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, bkashTxId: e.target.value }))
                      }
                      className="bg-muted border-border focus:border-[#E2136E]/60"
                      style={{
                        boxShadow: form.bkashTxId
                          ? "0 0 0 1px #E2136E60"
                          : undefined,
                      }}
                    />
                    <p className="text-[11px]" style={{ color: "#E2136E88" }}>
                      Send payment to {BKASH_NUMBER} first, then enter the
                      transaction ID.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    data-ocid="tournament.submit_button"
                    disabled={registerMutation.isPending}
                    className="w-full bg-fire-orange hover:bg-fire-orange/90 text-background font-bold mt-1"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Registering...
                      </>
                    ) : (
                      <>
                        <Swords className="w-4 h-4 mr-2" /> Register Team
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground pt-1 leading-snug">
                    For support contact{" "}
                    <a
                      href="https://wa.me/8801712345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                      style={{ color: "#25D366" }}
                    >
                      SK Sport BD via WhatsApp
                    </a>{" "}
                    +880 1712-345678
                  </p>
                </form>
              </div>
            ) : (
              <div
                data-ocid="tournament.panel"
                className="fire-border bg-card rounded-lg p-6 text-center"
              >
                <Swords className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-muted-foreground">
                  Registration {t.status}
                </h3>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  This tournament is no longer accepting registrations.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
