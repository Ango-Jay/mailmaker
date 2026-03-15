export const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent";
export const LABEL_CLASS =
  "text-[10px] font-bold text-text-light/40 uppercase";

export function parseValueWithUnit(
  val: string
): { num: number; unit: string } {
  const match = String(val ?? "")
    .trim()
    .match(/^(-?\d*(?:\.\d+)?)(px|%|em|rem)?$/i);
  if (!match) return { num: 0, unit: "px" };
  return {
    num: parseFloat(match[1]) || 0,
    unit: (match[2] || "px").toLowerCase(),
  };
}
