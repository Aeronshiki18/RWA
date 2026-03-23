export const statusColor = (s: string) => {
  if (s === "Listed") return { bg: "#dcfce7", color: "#166534" };
  if (s === "In Transit") return { bg: "#fef9c3", color: "#854d0e" };
  if (s === "Delivered") return { bg: "#dbeafe", color: "#1e40af" };
  if (s === "Sold") return { bg: "#f3e8ff", color: "#7e22ce" };
  return { bg: "#f3f4f6", color: "#374151" };
};

export const gradeColor = (g: string) => {
  if (g === "A+" || g === "A") return "#16a34a";
  if (g === "B+") return "#d97706";
  return "#6b7280";
};
