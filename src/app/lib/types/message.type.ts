import { Creator } from "@/app/lib/types/creator.enum";

export interface Message {
  id: string;
  role: Creator;
  content: string;
  owner: string;
  requiresDrawing?: boolean;
}
