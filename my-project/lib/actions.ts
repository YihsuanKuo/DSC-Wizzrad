"use server";
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import { inputSchema, Position } from './validation';
import path from 'path';
import { DataType } from './GlobalTypes';
import { parseServerActionResponse } from './utils';

type Player = {
  full_name: string;
  position: string;
  height: number;
  salary: number;
  average_points: number;
  average_assists: number;
  average_rebounds: number;
  average_steals: number;
  average_blocks: number;
  age: number;
};

export async function recommendPlayers(formData: DataType) {
  try {
    // 1. Parse and validate form input
    const input = await inputSchema.parseAsync(formData);

    // 2. Load and parse CSV data
    const mergedFilePath = path.join(process.cwd(), 'data', 'merged_player_data.csv');
    const csvData = await fs.readFile(mergedFilePath, 'utf-8');
    
    const players: Player[] = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (context.column === 'salary') {
          return parseCurrency(value);
        }
        if (context.column === 'height') {
          return parseFloat(value) || 0;
        }
        if (typeof context.column === 'string' && context.column.startsWith('average_')) {
          return parseFloat(value) || 0;
        }
        if (context.column === 'age') {
          return parseInt(value, 10) || 0;
        }
        return value;
      }
    });

    // 3. Filter players with enhanced validation
    const filtered = players.filter(player => {
      // Skip invalid entries
      if (!player.full_name || isNaN(player.salary)) return false;
      
      // Convert user height from inches to CSV's cm units (1 inch = 2.54 cm)
      const userHeightCm = input.height * 2.54;
      
      return (
        player.salary <= input.budget &&
        player.height >= userHeightCm &&
        player.age <= input.age &&
        matchPosition(player.position, input.position) &&
        player.average_points > 0 // Filter out non-scoring players
      );
    });

    // 4. Score and sort players with safety checks
    const scored = filtered
      .map(player => ({
        ...player,
        score: calculateScore(player)
      }))
      .sort((a, b) => b.score - a.score);

    // 5. Return top 5 with formatted salary
    return parseServerActionResponse({
      status: "SUCCESS",
      data: scored.slice(0, 5).map(player => ({
        ...player,
        salary: formatCurrency(player.salary)
      })),
    });
  } catch (error) {
    console.error("Error in recommendPlayers:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Enhanced helper functions
function parseCurrency(value: string): number {
  // Handle N/A, empty values, and trim whitespace
  const cleanValue = String(value).trim().replace(/\s+/g, '');
  if (cleanValue === 'N/A' || cleanValue === '') return Infinity;

  // Extract numeric value
  const numericString = cleanValue
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .replace(/[^0-9.]/g, '');

  return parseFloat(numericString) || Infinity;
}

function formatCurrency(amount: number): string {
  return amount === Infinity ? 'N/A' : 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
}

function matchPosition(playerPos: string, inputPos: Position): boolean {
  // Normalize position strings
  const normalizedInput = inputPos.toLowerCase().split("-");
  const positions = playerPos
    .toLowerCase()
    .replace(/[^a-z-]/g, '') // Remove special characters
    .split('-');

  // Check for partial matches (e.g., "forward-center" matches "forward")
  return positions.every(pos => normalizedInput.includes(pos));
}

function calculateScore(player: Player): number {
  // Weighted scoring with safe defaults
  return (
    (player.average_points || 0) * 0.5 +
    (player.average_rebounds || 0) * 0.25 +
    (player.average_assists || 0) * 0.15 +
    (player.average_steals || 0) * 0.05 +
    (player.average_blocks || 0) * 0.05
  );
};


export const fetchGameData = async () => {

    try {
        const mergedFilePath = path.join(
            process.cwd(),
            "data",
            "merged_player_data.csv"
          );
        const csvData = await fs.readFile(mergedFilePath, "utf-8");
    
        const record =  parse(csvData, {
            columns: true,
            skip_empty_lines: true,
        })
        return record;
    } catch (error) {
        console.error(error);
    }
    
}