
export interface IMatch {
    id: number;
    time: Date;
    score: string | null;
    winner_id: string | null;
    youtube_link: string | null;
    tournament: ITournament;
    player1: IPlayer;
    player2: IPlayer;
    player3: IPlayer | null;
    player4: IPlayer | null;
}

export interface ITournament {
    id: number;
    name: string;
    tournament_type: number;
    tournament_level: number | null;
}

export interface IPlayer {
    id: number;
    first_name: string;
    last_name: string;
}

export interface PlayerInfo {
    player: IPlayer | null;
    isDoubles: boolean;
    winner: string | null;
}

export type TypeGroupedMatches =  { 
    [key: number]: IMatch[] 
}