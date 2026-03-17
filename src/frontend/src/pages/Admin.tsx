import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  Megaphone,
  Plus,
  Shield,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type { Tournament } from "../backend.d.ts";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useCreateTournament,
  useDeleteAnnouncement,
  useDeleteTournament,
  useIsAdmin,
  useRegistrations,
  useTournaments,
  useUpdateTournament,
  useUpsertLeaderboardEntry,
} from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";

const ENTRY_FEE_OPTIONS = [
  "Free",
  "৳100",
  "৳500",
  "৳1,000",
  "৳5,000",
  "৳25,000",
];

const emptyForm = {
  title: "",
  date: "",
  prizePool: "",
  totalSlots: "32",
  format: "Squad",
  rules: "",
  status: "Open",
  entryFee: "Free",
  pdfFile: null as File | null,
  pdfKey: "",
};

type TournamentForm = typeof emptyForm;

function TournamentFormFields({
  form,
  setForm,
}: { form: TournamentForm; setForm: (f: TournamentForm) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm({ ...form, pdfFile: file });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Title</Label>
          <Input
            data-ocid="admin.input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Tournament name"
            required
            className="bg-muted border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input
            data-ocid="admin.input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder="e.g. March 25, 2026"
            required
            className="bg-muted border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Prize Pool</Label>
          <Input
            data-ocid="admin.input"
            value={form.prizePool}
            onChange={(e) => setForm({ ...form, prizePool: e.target.value })}
            placeholder="e.g. ৳50,000"
            required
            className="bg-muted border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Total Slots</Label>
          <Input
            data-ocid="admin.input"
            type="number"
            value={form.totalSlots}
            onChange={(e) => setForm({ ...form, totalSlots: e.target.value })}
            required
            className="bg-muted border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Format</Label>
          <Select
            value={form.format}
            onValueChange={(v) => setForm({ ...form, format: v })}
          >
            <SelectTrigger
              data-ocid="admin.select"
              className="bg-muted border-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solo">Solo</SelectItem>
              <SelectItem value="Duo">Duo</SelectItem>
              <SelectItem value="Squad">Squad</SelectItem>
              <SelectItem value="Clash Squad">Clash Squad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v })}
          >
            <SelectTrigger
              data-ocid="admin.select"
              className="bg-muted border-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Entry Fee</Label>
          <Select
            value={form.entryFee}
            onValueChange={(v) => setForm({ ...form, entryFee: v })}
          >
            <SelectTrigger
              data-ocid="admin.select"
              className="bg-muted border-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTRY_FEE_OPTIONS.map((fee) => (
                <SelectItem key={fee} value={fee}>
                  {fee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>PDF (optional)</Label>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfSelect}
              className="hidden"
            />
            <Button
              type="button"
              data-ocid="admin.upload_button"
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground gap-1.5 flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              {form.pdfFile ? "Change PDF" : "Upload PDF"}
            </Button>
            {form.pdfFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive px-2"
                onClick={() => setForm({ ...form, pdfFile: null, pdfKey: "" })}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          {form.pdfFile && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <FileText className="w-3 h-3" />
              {form.pdfFile.name}
            </p>
          )}
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Rules</Label>
          <Textarea
            data-ocid="admin.textarea"
            value={form.rules}
            onChange={(e) => setForm({ ...form, rules: e.target.value })}
            placeholder="Enter rules (one per line)"
            className="bg-muted border-border min-h-[100px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function RegistrationsDialog({ tournament }: { tournament: Tournament }) {
  const { data: registrations, isLoading } = useRegistrations(tournament.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          data-ocid="admin.open_modal_button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="admin.dialog"
        className="bg-card border-border max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-fire-orange" />
            Registrations — {tournament.title}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div
            data-ocid="admin.loading_state"
            className="flex justify-center py-8"
          >
            <Loader2 className="w-6 h-6 animate-spin text-fire-orange" />
          </div>
        ) : !registrations || registrations.length === 0 ? (
          <div
            data-ocid="admin.empty_state"
            className="text-center py-8 text-muted-foreground"
          >
            No registrations yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">#</TableHead>
                  <TableHead className="text-muted-foreground">Team</TableHead>
                  <TableHead className="text-muted-foreground">
                    Captain
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Contact
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg, i) => (
                  <TableRow
                    key={String(reg.id)}
                    data-ocid={`admin.row.${i + 1}`}
                    className="border-border"
                  >
                    <TableCell className="text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {reg.teamName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {reg.captainName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {reg.contact}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AnnouncementsSection() {
  const { data: announcements, isLoading } = useAnnouncements();
  const createMutation = useCreateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const [annForm, setAnnForm] = useState({ title: "", content: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title.trim() || !annForm.content.trim()) return;
    await createMutation.mutateAsync(annForm);
    setAnnForm({ title: "", content: "" });
  };

  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-fire-yellow" />
        Announcements
      </h2>

      <div className="fire-border bg-card rounded-lg p-5 mb-4">
        <h3 className="font-semibold text-foreground text-sm mb-3">
          New Announcement
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input
              data-ocid="admin.input"
              value={annForm.title}
              onChange={(e) =>
                setAnnForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Announcement title"
              className="bg-muted border-border"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Content</Label>
            <Textarea
              data-ocid="admin.textarea"
              value={annForm.content}
              onChange={(e) =>
                setAnnForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Announcement details..."
              className="bg-muted border-border min-h-[80px] resize-none"
              required
            />
          </div>
          <Button
            type="submit"
            data-ocid="admin.submit_button"
            disabled={createMutation.isPending}
            className="bg-fire-yellow/90 hover:bg-fire-yellow text-background font-bold"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Post Announcement
              </>
            )}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div
          data-ocid="admin.loading_state"
          className="h-20 bg-card rounded-lg animate-pulse"
        />
      ) : !announcements || announcements.length === 0 ? (
        <div
          data-ocid="admin.empty_state"
          className="fire-border bg-card rounded-lg p-6 text-center text-muted-foreground text-sm"
        >
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann, i) => (
            <div
              key={String(ann.id)}
              data-ocid={`admin.item.${i + 1}`}
              className="fire-border bg-card rounded-lg p-4 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-foreground text-sm">
                  {ann.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {ann.content}
                </p>
                <span className="text-xs text-muted-foreground/60 mt-1 block">
                  {new Date(
                    Number(ann.createdAt) / 1_000_000,
                  ).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Button
                data-ocid={`admin.delete_button.${i + 1}`}
                variant="ghost"
                size="sm"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(ann.id)}
                className="text-destructive hover:text-destructive/80 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function Admin() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments();
  const createMutation = useCreateTournament();
  const updateMutation = useUpdateTournament();
  const deleteMutation = useDeleteTournament();
  const leaderboardMutation = useUpsertLeaderboardEntry();
  const { uploadFile } = useStorageClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tournament | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tournament | null>(null);
  const [createForm, setCreateForm] = useState<TournamentForm>({
    ...emptyForm,
  });
  const [editForm, setEditForm] = useState<TournamentForm>({ ...emptyForm });
  const [uploading, setUploading] = useState(false);

  const [lbForm, setLbForm] = useState({
    tournamentId: "",
    rank: "",
    teamName: "",
    kills: "",
    points: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    let pdfKey = "";
    if (createForm.pdfFile) {
      setUploading(true);
      try {
        pdfKey = await uploadFile(createForm.pdfFile);
      } catch {
        // ignore upload error, proceed without pdf
      } finally {
        setUploading(false);
      }
    }
    await createMutation.mutateAsync({
      ...createForm,
      totalSlots: BigInt(Number.parseInt(createForm.totalSlots) || 32),
      pdfKey,
    });
    setCreateOpen(false);
    setCreateForm({ ...emptyForm });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    let pdfKey = editForm.pdfKey;
    if (editForm.pdfFile) {
      setUploading(true);
      try {
        pdfKey = await uploadFile(editForm.pdfFile);
      } catch {
        // ignore
      } finally {
        setUploading(false);
      }
    }
    await updateMutation.mutateAsync({
      id: editTarget.id,
      ...editForm,
      totalSlots: BigInt(Number.parseInt(editForm.totalSlots) || 32),
      pdfKey,
    });
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleLbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await leaderboardMutation.mutateAsync({
      tournamentId: BigInt(Number.parseInt(lbForm.tournamentId) || 0),
      rank: BigInt(Number.parseInt(lbForm.rank) || 1),
      teamName: lbForm.teamName,
      kills: BigInt(Number.parseInt(lbForm.kills) || 0),
      points: BigInt(Number.parseInt(lbForm.points) || 0),
    });
    setLbForm({
      tournamentId: "",
      rank: "",
      teamName: "",
      kills: "",
      points: "",
    });
  };

  if (adminLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Loader2 className="w-8 h-8 text-fire-orange animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.panel"
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-muted-foreground">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground/60 mt-2">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-fire-orange" />
            <div>
              <h1 className="font-heading text-4xl font-extrabold text-gradient-fire">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage tournaments and leaderboard
              </p>
            </div>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button
                data-ocid="admin.open_modal_button"
                className="bg-fire-orange hover:bg-fire-orange/90 text-background font-bold gap-2"
              >
                <Plus className="w-4 h-4" /> New Tournament
              </Button>
            </DialogTrigger>
            <DialogContent
              data-ocid="admin.dialog"
              className="bg-card border-border max-w-xl"
            >
              <DialogHeader>
                <DialogTitle className="font-heading text-foreground">
                  Create Tournament
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <TournamentFormFields
                  form={createForm}
                  setForm={setCreateForm}
                />
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="admin.cancel_button"
                    onClick={() => setCreateOpen(false)}
                    className="border-border text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    data-ocid="admin.submit_button"
                    disabled={createMutation.isPending || uploading}
                    className="bg-fire-orange hover:bg-fire-orange/90 text-background font-bold"
                  >
                    {createMutation.isPending || uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Tournaments Table */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">
          All Tournaments
        </h2>
        {tournamentsLoading ? (
          <div
            data-ocid="admin.loading_state"
            className="h-40 bg-card rounded-lg animate-pulse"
          />
        ) : !tournaments || tournaments.length === 0 ? (
          <div
            data-ocid="admin.empty_state"
            className="fire-border bg-card rounded-lg p-10 text-center text-muted-foreground"
          >
            No tournaments yet. Create one!
          </div>
        ) : (
          <div className="fire-border rounded-lg overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">
                    Format
                  </TableHead>
                  <TableHead className="text-muted-foreground">Fee</TableHead>
                  <TableHead className="text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground">Slots</TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((t, i) => (
                  <TableRow
                    key={String(t.id)}
                    data-ocid={`admin.row.${i + 1}`}
                    className="border-border hover:bg-muted/20"
                  >
                    <TableCell className="font-medium text-foreground">
                      {t.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {t.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.format}
                    </TableCell>
                    <TableCell>
                      <Badge className="text-xs bg-fire-yellow/10 border-fire-yellow/30 text-fire-yellow">
                        {t.entryFee || "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="text-xs">{t.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {String(t.filledSlots)}/{String(t.totalSlots)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <RegistrationsDialog tournament={t} />
                        <Button
                          data-ocid={`admin.edit_button.${i + 1}`}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setEditTarget(t);
                            setEditForm({
                              title: t.title,
                              date: t.date,
                              prizePool: t.prizePool,
                              totalSlots: String(t.totalSlots),
                              format: t.format,
                              rules: t.rules,
                              status: t.status,
                              entryFee: t.entryFee || "Free",
                              pdfFile: null,
                              pdfKey: t.pdfKey || "",
                            });
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          data-ocid={`admin.delete_button.${i + 1}`}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => setDeleteTarget(t)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* Announcements */}
      <AnnouncementsSection />

      {/* Leaderboard Entry */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">
          Add / Update Leaderboard Entry
        </h2>
        <div className="fire-border bg-card rounded-lg p-6">
          <form
            onSubmit={handleLbSubmit}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Tournament ID</Label>
              <Input
                data-ocid="admin.input"
                value={lbForm.tournamentId}
                onChange={(e) =>
                  setLbForm((f) => ({ ...f, tournamentId: e.target.value }))
                }
                placeholder="ID"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rank</Label>
              <Input
                data-ocid="admin.input"
                value={lbForm.rank}
                onChange={(e) =>
                  setLbForm((f) => ({ ...f, rank: e.target.value }))
                }
                placeholder="1"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Team Name</Label>
              <Input
                data-ocid="admin.input"
                value={lbForm.teamName}
                onChange={(e) =>
                  setLbForm((f) => ({ ...f, teamName: e.target.value }))
                }
                placeholder="Team name"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kills</Label>
              <Input
                data-ocid="admin.input"
                value={lbForm.kills}
                onChange={(e) =>
                  setLbForm((f) => ({ ...f, kills: e.target.value }))
                }
                placeholder="0"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Points</Label>
              <Input
                data-ocid="admin.input"
                value={lbForm.points}
                onChange={(e) =>
                  setLbForm((f) => ({ ...f, points: e.target.value }))
                }
                placeholder="0"
                className="bg-muted border-border"
              />
            </div>
            <div className="col-span-2 md:col-span-5">
              <Button
                type="submit"
                data-ocid="admin.submit_button"
                disabled={leaderboardMutation.isPending}
                className="w-full md:w-auto bg-fire-orange hover:bg-fire-orange/90 text-background font-bold"
              >
                {leaderboardMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Save Entry
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent
          data-ocid="admin.dialog"
          className="bg-card border-border max-w-xl"
        >
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">
              Edit Tournament
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <TournamentFormFields form={editForm} setForm={setEditForm} />
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.cancel_button"
                onClick={() => setEditTarget(null)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="admin.save_button"
                disabled={updateMutation.isPending || uploading}
                className="bg-fire-orange hover:bg-fire-orange/90 text-background font-bold"
              >
                {updateMutation.isPending || uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="admin.dialog"
          className="bg-card border-border"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-foreground">
              Delete Tournament?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete "{deleteTarget?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.cancel_button"
              className="border-border text-muted-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
