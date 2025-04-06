
export type ActionState = {
    status: "INITIAL" | "PENDING" | "SUCCESS" | "ERROR";
    error: string;
  }


  export type PlayerSalaryType = {
    player_id: number;
    player_name: string;
    salary2023: string; // or number, if you clean the currency formatting
    salary2024: string;
    salary2025: string;
    salary2025Second: string;
  };

  export type PlayerDataType = {
    full_name: string;
    team: string;
    position: string;
    height: number;
    weight: number;
    age: number;
    region: string;
    average_points: number;
    average_assists: number;
    average_rebounds: number;
    average_steals: number;
    average_blocks: number;
    awards: string; // This could be optional if some players have no awards
  };
  export type DataType = {
    budget: number,
    height: number,
    age: number,
    position: string,
}

export type ResultType = {
  // If the empty key ("") represents an id, you might rename it to id.
  // Otherwise, you can omit it.
  id?: string;
  age: number;
  average_assists: number;
  average_blocks: number;
  average_points: number;
  average_rebounds: number;
  average_steals: number;
  awards: string;
  full_name: string;
  height: number;
  position: string; // Alternatively, you could restrict this to a union of valid positions.
  region: string;
  salary: string; // Keeping it as a string since it includes a "$" and commas.
  score: number;
  team: string;
  weight: string; // The sample shows weight as "210" (a string), so we keep it as string.
};

  export type Position =
  | "Center"
  | "Forward"
  | "Guard"
  | "Center-Forward"
  | "Forward-Center"
  | "Forward-Guard"
  | "Guard-Forward";

