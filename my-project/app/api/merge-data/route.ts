import {NextResponse} from 'next/server';
import path from 'path';
import fs from "fs/promises";
import Papa from 'papaparse'; 
import { PlayerSalaryType, PlayerDataType } from "@/lib/GlobalTypes";
//import { parseServerActionResponse } from '@/lib/utils';

export async function GET() {
    try {
        console.log("Fetching data...");    
        const statsFilePath = path.join(process.cwd(), 'public', 'playerdata.csv');
        const salaryFilePath = path.join(process.cwd(), 'public', 'nbaplayersalary.csv');
        const mergedFilePath = path.join(process.cwd(), 'public', 'merged_player_data.csv');

        console.log("Stats file path:", statsFilePath);
        console.log("Salary file path:", salaryFilePath);

        const statsFileContent = await fs.readFile(statsFilePath, 'utf-8');
        const salaryFileContent = await fs.readFile(salaryFilePath, 'utf-8');
        console.log("Stats file content:", statsFileContent);

        const statsData = Papa.parse(statsFileContent, {header: true}).data as PlayerDataType[];
        const salaryData = Papa.parse(salaryFileContent, {header: true}).data as PlayerSalaryType[];
     
        console.log("Stats data:", statsData);

        const salaryMap: { [key: string]: string } = {};
        salaryData.forEach((player: PlayerSalaryType) => {
            if (player.salary2025Second && player.salary2025Second.trim() != "$0") {
                salaryMap[player.player_name] = player.salary2025Second;
            } else if (player.salary2025 && player.salary2025.trim() != "$0") {
                salaryMap[player.player_name] = player.salary2025;
            } else if (player.salary2024 && player.salary2024.trim() != "$0") {
                salaryMap[player.player_name] = player.salary2024;
            } else if (player.salary2023 && player.salary2023.trim() != "$0") {
                salaryMap[player.player_name] = player.salary2023;
            }
            else {
                salaryMap[player.player_name] = "N/A";
            }
          
        })
        console.log("Salary map:", salaryMap);

        const mergedData = statsData.map((player: any) => {
            return {
                ...player,
                salary: salaryMap[player.full_name] || "N/A",
            }
        })
        console.log("Merged Data:", mergedData);

        const csvContent = Papa.unparse(mergedData);
    
        // Write the CSV to a new file
        await fs.writeFile(mergedFilePath, csvContent, 'utf-8');
        console.log(`Merged CSV file created at: ${mergedFilePath}`);
    
        return NextResponse.json({
            status: "SUCCESS",
            data: mergedData,
            csvPath: '/merged_player_data.csv' // Path relative to public directory
        });

    } catch (error) {
        console.error("Error reading files:", error);
        return NextResponse.json({
            status: "ERROR",
            error: "Failed to fetch data",
        })
    }
}