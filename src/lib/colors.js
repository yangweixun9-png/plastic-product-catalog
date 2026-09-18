export const COLOR_MAP = {
  黄色: "#FFC928",
  蓝色: "#3B82F6",
  橙色: "#F97316",
  绿色: "#22C55E",
  粉色: "#EC4899",
  白色: "#FFFFFF",
  灰色: "#9CA3AF",
  米色: "#E8D5B7",
  透明白: "#F4F4F5",
  透明粉: "#F9A8D4",
  透明蓝: "#93C5FD",
  透明黑: "#3F3F46",
}

export const FILTER_COLORS = [
  "白色",
  "灰色",
  "黄色",
  "蓝色",
  "绿色",
  "橙色",
  "粉色",
  "米色",
  "透明白",
  "透明粉",
  "透明蓝",
  "透明黑",
]

export function colorHex(name) {
  return COLOR_MAP[name] || "#D4D4D4"
}
