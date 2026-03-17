import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Types
  public type Tournament = {
    id : Nat;
    title : Text;
    date : Text;
    prizePool : Text;
    totalSlots : Nat;
    filledSlots : Nat;
    format : Text;
    rules : Text;
    status : Text;
    entryFee : Text;
    pdfKey : Text;
    createdAt : Int;
  };

  type Registration = {
    id : Nat;
    tournamentId : Nat;
    teamName : Text;
    captainName : Text;
    playerIds : Text;
    contact : Text;
    registeredAt : Int;
  };

  public type LeaderboardEntry = {
    id : Nat;
    tournamentId : Nat;
    rank : Nat;
    teamName : Text;
    kills : Nat;
    points : Nat;
  };

  public type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
  };

  public type Result = {
    #ok : Text;
    #err : Text;
  };

  public type UserProfile = {
    name : Text;
    teamName : Text;
    contact : Text;
  };

  module Tournament {
    public func compareByDate(a : Tournament, b : Tournament) : Order.Order {
      switch (Nat.compare(a.id, b.id)) {
        case (#equal) { Text.compare(a.date, b.date) };
        case (order) { order };
      };
    };
  };

  module LeaderboardEntry {
    public func compareByRank(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      Nat.compare(a.rank, b.rank);
    };

    public func compareByPoints(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      switch (Nat.compare(b.points, a.points)) {
        case (#equal) { Nat.compare(b.kills, a.kills) };
        case (order) { order };
      };
    };
  };

  // Incremental IDs
  var nextTournamentId = 1;
  var nextRegistrationId = 1;
  var nextLeaderboardEntryId = 1;
  var nextAnnouncementId = 1;

  // Persistent Storage
  let tournaments = Map.empty<Nat, Tournament>();
  let registrations = Map.empty<Nat, Registration>();
  let leaderboardEntries = Map.empty<Nat, LeaderboardEntry>();
  let announcements = Map.empty<Nat, Announcement>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization System
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Tournament Management Functions
  public shared ({ caller }) func createTournament(
    title : Text,
    date : Text,
    prizePool : Text,
    totalSlots : Nat,
    format : Text,
    rules : Text,
    status : Text,
    entryFee : Text,
    pdfKey : Text,
  ) : async Tournament {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextTournamentId;
    nextTournamentId += 1;

    let tournament : Tournament = {
      id;
      title;
      date;
      prizePool;
      totalSlots;
      filledSlots = 0;
      format;
      rules;
      status;
      entryFee;
      pdfKey;
      createdAt = Time.now();
    };

    tournaments.add(id, tournament);
    tournament;
  };

  public shared ({ caller }) func updateTournament(
    id : Nat,
    title : Text,
    date : Text,
    prizePool : Text,
    totalSlots : Nat,
    format : Text,
    rules : Text,
    status : Text,
    entryFee : Text,
    pdfKey : Text,
  ) : async Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (tournaments.get(id)) {
      case (null) { #err("Tournament not found") };
      case (?existingTournament) {
        let updatedTournament : Tournament = {
          existingTournament with
          title;
          date;
          prizePool;
          totalSlots;
          format;
          rules;
          status;
          entryFee;
          pdfKey;
        };
        tournaments.add(id, updatedTournament);
        #ok("Tournament updated successfully");
      };
    };
  };

  public shared ({ caller }) func deleteTournament(id : Nat) : async Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not tournaments.containsKey(id)) {
      return #err("Tournament not found");
    };

    tournaments.remove(id);
    #ok("Tournament deleted successfully");
  };

  public query func getTournaments() : async [Tournament] {
    tournaments.values().toArray().sort(Tournament.compareByDate);
  };

  public query func getTournament(id : Nat) : async ?Tournament {
    tournaments.get(id);
  };

  // Registration Functions
  public shared ({ caller }) func registerForTournament(tournamentId : Nat, teamName : Text, captainName : Text, playerIds : Text, contact : Text) : async Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register for tournaments");
    };

    switch (tournaments.get(tournamentId)) {
      case (null) { return #err("Tournament not found") };
      case (?tournament) {
        if (tournament.filledSlots >= tournament.totalSlots) {
          return #err("No available slots for this tournament");
        };

        let registration : Registration = {
          id = nextRegistrationId;
          tournamentId;
          teamName;
          captainName;
          playerIds;
          contact;
          registeredAt = Time.now();
        };
        nextRegistrationId += 1;

        registrations.add(registration.id, registration);

        let updatedTournament : Tournament = {
          tournament with
          filledSlots = tournament.filledSlots + 1;
        };
        tournaments.add(tournamentId, updatedTournament);

        #ok("Successfully registered for tournament");
      };
    };
  };

  public shared ({ caller }) func getRegistrations(tournamentId : Nat) : async [Registration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    registrations.values().toArray().filter(
      func(reg) { reg.tournamentId == tournamentId }
    );
  };

  // Leaderboard Functions
  public shared ({ caller }) func upsertLeaderboardEntry(tournamentId : Nat, rank : Nat, teamName : Text, kills : Nat, points : Nat) : async Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let entryId = nextLeaderboardEntryId;
    nextLeaderboardEntryId += 1;

    let entry : LeaderboardEntry = {
      id = entryId;
      tournamentId;
      rank;
      teamName;
      kills;
      points;
    };

    leaderboardEntries.add(entryId, entry);
    #ok("Leaderboard entry added/updated");
  };

  public query func getLeaderboard(tournamentId : Nat) : async [LeaderboardEntry] {
    leaderboardEntries.values().toArray().filter(
      func(entry) { entry.tournamentId == tournamentId }
    ).sort(LeaderboardEntry.compareByRank);
  };

  public query func getGlobalLeaderboard() : async [LeaderboardEntry] {
    leaderboardEntries.values().toArray().sort(LeaderboardEntry.compareByPoints);
  };

  // Announcement Functions
  public shared ({ caller }) func createAnnouncement(title : Text, content : Text) : async Announcement {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextAnnouncementId;
    nextAnnouncementId += 1;

    let announcement : Announcement = {
      id;
      title;
      content;
      createdAt = Time.now();
    };

    announcements.add(id, announcement);
    announcement;
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not announcements.containsKey(id)) {
      return #err("Announcement not found");
    };

    announcements.remove(id);
    #ok("Announcement deleted successfully");
  };

  public query func getAnnouncements() : async [Announcement] {
    let list = List.fromIter<Announcement>(announcements.values());
    let array = list.toArray();

    // Convert to [Int] using Nat.toInt
    let intArray = array.map(
      func(a) {
        a.createdAt;
      }
    );

    let sortedIndices = Nat.range(0, intArray.size()).toArray();

    let compareByDescendingTime = func(i : Nat, j : Nat) : Order.Order {
      Int.compare(intArray[j], intArray[i]);
    };

    let sorted = sortedIndices.sort(
      compareByDescendingTime
    );

    sorted.map(func(i) { array[i] });
  };
};
