export type Suggestion = {
  id: string;
  label: string;
  icon: "doctor" | "calendar" | "star" | "treatment" | "consultation" | "services";
};

export const SUGGESTIONS: Suggestion[] = [
  { id: "1", label: "Which doctors work at this hospital?", icon: "doctor" },
  { id: "2", label: "What is my upcoming appointment status?", icon: "calendar" },
  { id: "3", label: "What are the reviews for this hospital?", icon: "star" },
  { id: "4", label: "What is the treatment for a fever?", icon: "treatment" },
  { id: "5", label: "When is the doctor available for consultation?", icon: "consultation" },
  { id: "6", label: "What services does this hospital provide?", icon: "services" },
];