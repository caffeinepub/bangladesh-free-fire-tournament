import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Announcement,
  LeaderboardEntry,
  Registration,
  Tournament,
  UserRole,
} from "../backend.d.ts";
import { useActor } from "./useActor";

export function useTournaments() {
  const { actor, isFetching } = useActor();
  return useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTournaments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTournament(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Tournament | null>({
    queryKey: ["tournament", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getTournament(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useRegistrations(tournamentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["registrations", tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || tournamentId === null) return [];
      return actor.getRegistrations(tournamentId);
    },
    enabled: !!actor && !isFetching && tournamentId !== null,
  });
}

export function useGlobalLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", "global"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGlobalLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeaderboard(tournamentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || tournamentId === null) return [];
      return actor.getLeaderboard(tournamentId);
    },
    enabled: !!actor && !isFetching && tournamentId !== null,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.getAnnouncements();
      return [...list].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAnnouncement(data.title, data.content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement created!");
    },
    onError: () => toast.error("Failed to create announcement"),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted.");
    },
    onError: () => toast.error("Failed to delete announcement"),
  });
}

export function useCreateTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      date: string;
      prizePool: string;
      totalSlots: bigint;
      format: string;
      rules: string;
      status: string;
      entryFee: string;
      pdfKey: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTournament(
        data.title,
        data.date,
        data.prizePool,
        data.totalSlots,
        data.format,
        data.rules,
        data.status,
        data.entryFee,
        data.pdfKey,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("Tournament created successfully!");
    },
    onError: () => toast.error("Failed to create tournament"),
  });
}

export function useUpdateTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      date: string;
      prizePool: string;
      totalSlots: bigint;
      format: string;
      rules: string;
      status: string;
      entryFee: string;
      pdfKey: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTournament(
        data.id,
        data.title,
        data.date,
        data.prizePool,
        data.totalSlots,
        data.format,
        data.rules,
        data.status,
        data.entryFee,
        data.pdfKey,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("Tournament updated!");
    },
    onError: () => toast.error("Failed to update tournament"),
  });
}

export function useDeleteTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTournament(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("Tournament deleted.");
    },
    onError: () => toast.error("Failed to delete tournament"),
  });
}

export function useRegisterForTournament() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      tournamentId: bigint;
      teamName: string;
      captainName: string;
      playerIds: string;
      contact: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerForTournament(
        data.tournamentId,
        data.teamName,
        data.captainName,
        data.playerIds,
        data.contact,
      );
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["tournaments"] });
        qc.invalidateQueries({ queryKey: ["registrations"] });
        toast.success("Registered successfully! 🎮");
      } else {
        toast.error(result.err);
      }
    },
    onError: () => toast.error("Registration failed"),
  });
}

export function useUpsertLeaderboardEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      tournamentId: bigint;
      rank: bigint;
      teamName: string;
      kills: bigint;
      points: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.upsertLeaderboardEntry(
        data.tournamentId,
        data.rank,
        data.teamName,
        data.kills,
        data.points,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
      toast.success("Leaderboard updated!");
    },
    onError: () => toast.error("Failed to update leaderboard"),
  });
}
