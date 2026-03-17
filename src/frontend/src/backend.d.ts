import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    id: bigint;
    teamName: string;
    rank: bigint;
    tournamentId: bigint;
    kills: bigint;
    points: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface Registration {
    id: bigint;
    playerIds: string;
    teamName: string;
    contact: string;
    captainName: string;
    registeredAt: bigint;
    tournamentId: bigint;
}
export interface Tournament {
    id: bigint;
    status: string;
    title: string;
    date: string;
    createdAt: bigint;
    totalSlots: bigint;
    pdfKey: string;
    entryFee: string;
    filledSlots: bigint;
    rules: string;
    prizePool: string;
    format: string;
}
export interface Announcement {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
}
export interface UserProfile {
    teamName: string;
    contact: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(title: string, content: string): Promise<Announcement>;
    createTournament(title: string, date: string, prizePool: string, totalSlots: bigint, format: string, rules: string, status: string, entryFee: string, pdfKey: string): Promise<Tournament>;
    deleteAnnouncement(id: bigint): Promise<Result>;
    deleteTournament(id: bigint): Promise<Result>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGlobalLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getLeaderboard(tournamentId: bigint): Promise<Array<LeaderboardEntry>>;
    getRegistrations(tournamentId: bigint): Promise<Array<Registration>>;
    getTournament(id: bigint): Promise<Tournament | null>;
    getTournaments(): Promise<Array<Tournament>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerForTournament(tournamentId: bigint, teamName: string, captainName: string, playerIds: string, contact: string): Promise<Result>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTournament(id: bigint, title: string, date: string, prizePool: string, totalSlots: bigint, format: string, rules: string, status: string, entryFee: string, pdfKey: string): Promise<Result>;
    upsertLeaderboardEntry(tournamentId: bigint, rank: bigint, teamName: string, kills: bigint, points: bigint): Promise<Result>;
}
