import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {
  // Old types
  type OldTournament = {
    id : Nat;
    title : Text;
    date : Text;
    prizePool : Text;
    totalSlots : Nat;
    filledSlots : Nat;
    format : Text;
    rules : Text;
    status : Text;
    createdAt : Int;
  };

  type OldActor = {
    tournaments : Map.Map<Nat, OldTournament>;
    nextTournamentId : Nat;
  };

  // New types
  type NewTournament = {
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

  type NewActor = {
    tournaments : Map.Map<Nat, NewTournament>;
    nextTournamentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newTournaments = old.tournaments.map<Nat, OldTournament, NewTournament>(
      func(_, oldTournament) {
        { oldTournament with entryFee = ""; pdfKey = "" };
      }
    );
    {
      old with
      tournaments = newTournaments;
    };
  };
};
