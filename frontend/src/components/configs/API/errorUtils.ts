export const extractErrorMsg = (error: any, fallback = "Something went wrong"): string => {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((e: any) => e.msg).join(", ");
  if (typeof detail === "string") return detail;
  return error?.response?.data?.msg || fallback;
};
