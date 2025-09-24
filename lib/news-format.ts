export function formatNewsDate(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
