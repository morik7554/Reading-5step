import type { AttemptRecord, Material } from "../types";

export const skillLabels = ["テーマ把握", "要旨把握", "予測力", "スキャニング", "問題解決力"];

export function getResultSummary(material: Material, records: AttemptRecord[]) {
  const firstSuccess = [1, 2, 3, 4].map((targetStep) => {
    const attempts = records.filter((record) => record.step === targetStep);
    return attempts[0]?.correct ? 100 : attempts.some((record) => record.correct) ? 70 : 0;
  });
  const finalRecords = records.filter((record) => record.step === 5);
  const correctFinal = finalRecords.filter((record) => record.correct).length;
  const practicalScore = Math.round((correctFinal / material.step5.length) * 100);
  const questionReviews = material.step5.map((question, index) => {
    const attempts = finalRecords.filter((record) => record.question === question.question);
    return {
      ...question,
      number: index + 1,
      wrongAnswers: attempts.filter((record) => !record.correct).map((record) => record.selected),
      attemptCount: attempts.length,
    };
  });
  return { correctFinal, practicalScore, skillScores: [...firstSuccess, practicalScore], questionReviews };
}

export function getHistoryScore(material: Material, records: AttemptRecord[]) {
  const finalRecords = records.filter((record) => record.step === 5);
  const correct = finalRecords.filter((record) => record.correct).length;
  return { correct, score: Math.round((correct / material.step5.length) * 100) };
}
