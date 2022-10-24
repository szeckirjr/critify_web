import { Album } from "./scraper";

export function getAverageScore(scores: number[]): number {
  const total = scores.reduce((acc, score) => acc + score, 0);
  return total / scores.length;
}

export function exportScoresFromAlbums(albums: Album[]): number[] {
  return albums.map((album) => album.score);
}
