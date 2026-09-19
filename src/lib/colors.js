export const COLOR_MAP = {
  黄色: "#A08058",
  蓝色: "#3B82F6",
  橙色: "#F97316",
  绿色: "#22C55E",
  粉色: "#EC4899",
  白色: "#FFFFFF",
  灰色: "#9CA3AF",
  米色: "#E8D5B7",
  奶白色: "#FAF6F0",
  北欧粉: "#E8A0B4",
  北欧蓝: "#6F93C0",
  北欧绿: "#7FA98A",
  透明: "#D9EEF7",
  乳白: "#FFF8E8",
  透明白: "#F4F4F5",
  透明粉: "#F9A8D4",
  透明蓝: "#93C5FD",
  透明黑: "#3F3F46",
}

export function colorHex(name) {
  return COLOR_MAP[name] || "#D4D4D4"
}
