import { useEffect, useMemo, useRef, useState } from "react";
import rawMaterials from "./data/materials.json";
import { useLearningHistory } from "./hooks/useLearningHistory";
import { usePassageSpeech } from "./hooks/usePassageSpeech";
import { getHistoryScore } from "./services/scoring";
import { LessonScreen } from "./screens/LessonScreen";
import { LibraryScreen } from "./screens/LibraryScreen";
import { ResultScreen } from "./screens/ResultScreen";
import type { AttemptRecord, ChoiceStep, EvidenceQuestion, Level, Material, ReadingQuestion } from "./types";

const materials = rawMaterials as Material[];
const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[.,!?;:“”"'’()[\]]/g, "").replace(/\s+/g, " ").trim();
const splitIntoSentences = (paragraph: string) =>
  paragraph.match(/[^.!?]+[.!?]+[”"']?|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [paragraph];

function App() {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0].id);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const { learningHistory, addLearningRecord } = useLearningHistory();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [subQuestion, setSubQuestion] = useState(0);
  const [choice, setChoice] = useState("");
  const [selectedScanningSentence, setSelectedScanningSentence] = useState("");
  const [evidencePassed, setEvidencePassed] = useState(false);
  const [message, setMessage] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [passed, setPassed] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [records, setRecords] = useState<AttemptRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const [passageCanScroll, setPassageCanScroll] = useState(false);
  const [passageAtBottom, setPassageAtBottom] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);
  const successTimerRef = useRef<number | null>(null);

  const material = materials.find((item) => item.id === selectedMaterialId)!;
  const speech = usePassageSpeech(material.passage);
  const passageParagraphs = useMemo(() => material.passage.split("\n\n").map(splitIntoSentences), [material]);
  const currentChoiceStep = (step === 1 ? material.step1 : step === 2 ? material.step2 : material.step3) as ChoiceStep | undefined;
  const currentEvidence = material.step4[subQuestion] as EvidenceQuestion | undefined;
  const currentReading = material.step5[subQuestion] as ReadingQuestion | undefined;

  useEffect(() => {
    const element = passageRef.current;
    if (!element || !started || finished) return;
    const update = () => {
      setPassageCanScroll(element.scrollHeight > element.clientHeight + 4);
      setPassageAtBottom(element.scrollTop + element.clientHeight >= element.scrollHeight - 8);
    };
    element.scrollTop = 0;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [material.id, started, finished]);

  useEffect(() => () => {
    if (successTimerRef.current !== null) window.clearTimeout(successTimerRef.current);
  }, []);

  const resetQuestion = () => {
    setChoice(""); setSelectedScanningSentence(""); setEvidencePassed(false); setMessage("");
    setHintIndex(0); setPassed(false); setShowTranslation(false);
  };
  const resetLesson = (id = selectedMaterialId) => {
    if (successTimerRef.current !== null) window.clearTimeout(successTimerRef.current);
    speech.stop(); setSelectedMaterialId(id); setStarted(false); setStep(1); setSubQuestion(0);
    setRecords([]); setFinished(false); resetQuestion();
  };
  const startLesson = () => {
    speech.stop(); setStarted(true); setFinished(false); setStep(1); setSubQuestion(0); setRecords([]); resetQuestion();
  };
  const chooseLevel = (level: Level) => {
    setSelectedLevel(level);
    setSelectedMaterialId(materials.find((item) => item.level === level)!.id);
  };
  const recordAttempt = (record: AttemptRecord) => setRecords((previous) => [...previous, record]);
  const finishLesson = () => {
    const { correct, score } = getHistoryScore(material, records);
    addLearningRecord({ materialId: material.id, title: material.title, level: material.level, score, correct, total: material.step5.length, completedAt: new Date().toISOString() });
    setFinished(true);
  };

  const submitChoiceStep = () => {
    if (!choice || !currentChoiceStep || passed) return;
    const correct = choice === currentChoiceStep.answer;
    recordAttempt({ step, question: currentChoiceStep.question, selected: choice, answer: currentChoiceStep.answer, correct });
    if (!correct) {
      const hint = currentChoiceStep.hints[Math.min(hintIndex, currentChoiceStep.hints.length - 1)];
      setMessage(`もう一度考えよう。ヒント：${hint}`); setHintIndex((value) => value + 1); setChoice(""); return;
    }
    setPassed(true);
    setMessage("正解！ 次の作戦へ進みます。");
    successTimerRef.current = window.setTimeout(() => {
      setStep((current) => current + 1); setSubQuestion(0); resetQuestion();
      successTimerRef.current = null;
    }, 800);
  };
  const submitEvidence = () => {
    if (!selectedScanningSentence || !currentEvidence || passed) return;
    const selected = normalize(selectedScanningSentence);
    const correct = currentEvidence.answerPatterns.some((pattern) => selected.includes(normalize(pattern)));
    recordAttempt({ step: 4, question: currentEvidence.question, selected: selectedScanningSentence, answer: currentEvidence.answerPatterns[0], correct, evidence: currentEvidence.translationTarget });
    if (correct) { setEvidencePassed(true); setChoice(""); setHintIndex(0); setMessage("キーワードを発見！ 続けて問題に答えよう。"); return; }
    const hint = currentEvidence.hints[Math.min(hintIndex, currentEvidence.hints.length - 1)];
    setMessage(`選ぶ文を見直そう。ヒント：${hint}`); setHintIndex((value) => value + 1); setSelectedScanningSentence("");
  };
  const submitReading = () => {
    if (!choice || !currentReading || passed) return;
    const correct = choice === currentReading.answer;
    recordAttempt({ step: 5, question: currentReading.question, selected: choice, answer: currentReading.answer, correct, evidence: currentReading.evidence, explanation: currentReading.explanation });
    if (correct) { setPassed(true); setMessage("正解！見つけたキーワードを手掛かりに答えられました。"); return; }
    const hints = [
      "左側で線が引かれている文の前後を、もう一度読もう。",
      `質問文の「${currentEvidence?.questionKeywords.join(" / ") ?? ""}」と本文のキーワードをつなげよう。`,
      "キーワードのある文と、その前後の文を読んで選択肢を比べよう。",
    ];
    setMessage(`もう一度考えよう。ヒント：${hints[Math.min(hintIndex, hints.length - 1)]}`);
    setHintIndex((value) => value + 1); setChoice("");
  };
  const goNext = () => {
    if (subQuestion < material.step4.length - 1) { setSubQuestion((value) => value + 1); resetQuestion(); }
    else finishLesson();
  };

  if (!started) return <LibraryScreen materials={materials} material={material} selectedLevel={selectedLevel}
    selectedMaterialId={selectedMaterialId} learningHistory={learningHistory} onChooseLevel={chooseLevel}
    onChooseMaterial={setSelectedMaterialId} onStart={startLesson} />;
  if (finished) return <ResultScreen material={material} records={records} speech={speech}
    onLibrary={() => resetLesson()} onRetry={startLesson} />;
  return <LessonScreen material={material} step={step} subQuestion={subQuestion} choice={choice}
    selectedScanningSentence={selectedScanningSentence} evidencePassed={evidencePassed} passed={passed}
    message={message} showTranslation={showTranslation} passageParagraphs={passageParagraphs}
    passageRef={passageRef} passageCanScroll={passageCanScroll} passageAtBottom={passageAtBottom}
    currentChoiceStep={currentChoiceStep} currentEvidence={currentEvidence} currentReading={currentReading}
    onLibrary={() => resetLesson()} onChoice={setChoice}
    onSelectSentence={(sentence) => { if (step === 4 && !evidencePassed && !passed) { setSelectedScanningSentence(sentence); setMessage(""); setShowTranslation(false); } }}
    onClearSentence={() => setSelectedScanningSentence("")} onToggleTranslation={() => setShowTranslation((value) => !value)}
    onSubmitChoice={submitChoiceStep} onSubmitEvidence={submitEvidence} onSubmitReading={submitReading} onNext={goNext} />;
}

export default App;
