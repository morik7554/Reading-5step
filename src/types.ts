export type Level = "中1" | "中2" | "中3" | "入試";
export type ChoiceStep = { question: string; choices: string[]; answer: string; hints: string[] };
export type EvidenceQuestion = {
  question: string; questionKeywords: string[]; answerPatterns: string[]; hints: string[];
  translationTarget: string; translation: string;
};
export type ReadingQuestion = {
  type?: "choice" | "written"; question: string; choices: string[]; answer: string;
  evidence: string; explanation: string;
};
export type Material = {
  id: string; level: Level; title: string; genre: string; passage: string; translation: string;
  notes: { word: string; meaning: string }[]; step1: ChoiceStep; step2: ChoiceStep;
  step3: ChoiceStep; step4: EvidenceQuestion[]; step5: ReadingQuestion[];
};
export type AttemptRecord = {
  step: number; question: string; selected: string; answer: string; correct: boolean;
  evidence?: string; explanation?: string;
};
export type LearningRecord = {
  materialId: string; title: string; level: Level; score: number;
  correct: number; total: number; completedAt: string;
};
