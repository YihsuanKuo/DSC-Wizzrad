import { z } from 'zod'

export const PositionEnum = z.enum([
    "guard",
    "forward",
    "center",
    "center-forward",
    "forward-center",
    "forward-guard",  // Fixed typo here
    "guard-forward",
  ], {
    invalid_type_error: "Invalid position value",
    required_error: "Position is required",
  });
  
  export type Position = z.infer<typeof PositionEnum>;
  
  // Optional: Case-insensitive validation with refinement
  export const PositionSchema = PositionEnum.or(z.string()).transform(val => {
    const normalized = val.toLowerCase().replace(/[\s_]/g, '-');
    return PositionEnum.parse(normalized);
  });
  

export const inputSchema = z.object({
    budget: z.number().min(10000).max(100000000000),
    height: z.number().min(0).max(100),
    age: z.number().min(18).max(80),
    position: PositionSchema
})