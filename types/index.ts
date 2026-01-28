export interface Character {
  id: number;
  name: string;
  anime: string;
  type: string;
  desc: string;
  image: string;
  rank?: number | null; // 1, 2, 3, or undefined/null
  objectPosition?: string; // e.g. "50% 50%"
}
