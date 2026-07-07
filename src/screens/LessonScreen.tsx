import type { RefObject } from "react";
import { QuestionChoices } from "../components/QuestionChoices";
import type { ChoiceStep, EvidenceQuestion, Material, ReadingQuestion } from "../types";

export const stepLabels = ["テーマ把握", "要旨把握", "流れを予測", "スキャニング", "実戦問題"];

type Props = {
  material: Material; step: number; subQuestion: number; choice: string; selectedScanningSentence: string;
  evidencePassed: boolean; passed: boolean; message: string; showTranslation: boolean;
  passageParagraphs: string[][]; passageRef: RefObject<HTMLDivElement | null>;
  passageCanScroll: boolean; passageAtBottom: boolean;
  currentChoiceStep?: ChoiceStep; currentEvidence?: EvidenceQuestion; currentReading?: ReadingQuestion;
  onLibrary: () => void; onChoice: (choice: string) => void; onSelectSentence: (sentence: string) => void;
  onClearSentence: () => void; onToggleTranslation: () => void; onSubmitChoice: () => void;
  onSubmitEvidence: () => void; onSubmitReading: () => void; onNext: () => void;
};

export function LessonScreen(props: Props) {
  const { material, step, subQuestion, choice, selectedScanningSentence, evidencePassed, passed, message,
    showTranslation, passageParagraphs, passageRef, passageCanScroll, passageAtBottom,
    currentChoiceStep, currentEvidence, currentReading } = props;
  const visibleProgressStep = step === 4 && evidencePassed ? 5 : step;
  return (
    <main className={`app-shell step-${step}`}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{message}</div>
      <header className="app-header">
        <button className="back-button" onClick={props.onLibrary}>← 教材一覧</button>
        <div className="lesson-heading"><span>{material.level} ・ {material.genre}</span><strong>{material.title}</strong></div>
        <div className="progress-steps" aria-label="学習の進み具合">
          {stepLabels.map((label, index) => {
            const number = index + 1;
            return <div aria-current={visibleProgressStep === number ? "step" : undefined} className={`${visibleProgressStep === number ? "active" : ""} ${visibleProgressStep > number ? "done" : ""}`} key={label}><i>{visibleProgressStep > number ? "✓" : number}</i><span>{label}</span></div>;
          })}
        </div>
      </header>
      <div className="split-layout">
        <section className="passage-panel" aria-label="英文本文と注釈">
          <div className="panel-title"><div><span>READING PASSAGE</span><h2>英文本文</h2></div>{step === 4 && <em>手掛かりがある一文をクリック</em>}</div>
          <div className="passage-scroll-area">
            <div ref={passageRef} className={`passage ${step === 4 ? "selectable" : ""}`} aria-label={step === 1 ? "STEP1では本文を読まず、下の注釈を確認します" : "英文本文"}>
              {passageParagraphs.map((sentences, paragraphIndex) => (
                <p className={step === 2 && (paragraphIndex === 0 || paragraphIndex === passageParagraphs.length - 1) ? "summary-highlight" : ""} key={`paragraph-${paragraphIndex}`}>
                  {sentences.map((sentence, sentenceIndex) => {
                    const selected = selectedScanningSentence === sentence;
                    return <button type="button" aria-pressed={selected} aria-label={step === 4 ? `文を選択: ${sentence}` : undefined}
                      className={selected ? `scanning-sentence-selected ${evidencePassed ? "scanning-sentence-locked" : ""}` : ""}
                      disabled={step !== 4 || evidencePassed || passed} onClick={() => props.onSelectSentence(sentence)}
                      key={`${paragraphIndex}-${sentenceIndex}`}>{sentence}</button>;
                  })}
                </p>
              ))}
            </div>
            {passageCanScroll && !passageAtBottom && <div className="passage-scroll-hint" aria-hidden="true"><span>下に続きがあります</span><b>↓</b></div>}
          </div>
          <div className="notes" aria-label="注釈"><b>注釈</b>{material.notes.map((note) => <span key={note.word}>{note.word}：{note.meaning}</span>)}</div>
        </section>
        <section className={`task-panel ${step === 4 && evidencePassed ? "practice-mode" : ""}`} aria-label="問題">
          <div className="task-content">
            <div className="step-kicker">{step === 4 && evidencePassed ? `PRACTICE ${subQuestion + 1} / ${material.step5.length}` : `STEP ${step} / 5`}</div>
            <h2>{step === 4 && evidencePassed ? "実戦問題" : stepLabels[step - 1]}</h2>
            {step === 1 && <div className="instruction">本文はまだ読まず、設問と左下の注釈からテーマを予想しよう。</div>}
            {step === 2 && <div className="instruction">左の本文でハイライトされた最初と最後の段落を読んで答えよう。</div>}
            {step === 3 && <div className="preview-box"><b>STEP5で出る設問</b>{material.step5.map((item, index) => <p key={item.question}>{index + 1}. {item.question}</p>)}</div>}
            {step <= 3 && currentChoiceStep && <QuestionChoices question={currentChoiceStep.question} choices={currentChoiceStep.choices} selected={choice} disabled={passed} onSelect={props.onChoice} />}
            {step === 4 && currentEvidence && !evidencePassed && <>
              <div className="question-number">スキャニング {subQuestion + 1} / {material.step4.length}</div>
              <h3 className="question-text">{currentEvidence.question}</h3>
              <div className="question-keywords"><span>質問文の注目語</span><div>{currentEvidence.questionKeywords.map((keyword) => <b key={keyword}>{keyword}</b>)}</div></div>
              <div className="selection-box"><span>選択中の文</span><p>{selectedScanningSentence || "左の本文から、キーワードや手掛かりがある一文を選ぼう"}</p>{selectedScanningSentence && <button className="text-button" onClick={props.onClearSentence}>選択をやり直す</button>}</div>
            </>}
            {step === 4 && currentEvidence && evidencePassed && currentReading && <>
              <div className="evidence-confirmed"><div><span>キーワードを見つけた文</span><p>{selectedScanningSentence}</p></div><button aria-expanded={showTranslation} onClick={props.onToggleTranslation}>{showTranslation ? "ヒントを閉じる" : "前後の文を確認"}</button></div>
              {showTranslation && <div className="translation-pop compact"><b>{currentEvidence.translationTarget}</b><span>{currentEvidence.translation}</span></div>}
              <QuestionChoices question={currentReading.question} choices={currentReading.choices} selected={choice} disabled={passed} onSelect={props.onChoice} />
            </>}
            {message && <div role={passed ? "status" : "alert"} className={`feedback ${passed ? "correct" : "retry"}`}>{message}</div>}
          </div>
          <div className="task-actions">
            {step <= 3 && <button className="primary" disabled={!choice || passed} onClick={props.onSubmitChoice}>{passed ? "次へ進みます…" : "答え合わせ"}</button>}
            {!passed && step === 4 && !evidencePassed && <button className="primary" disabled={!selectedScanningSentence} onClick={props.onSubmitEvidence}>この文を選ぶ</button>}
            {!passed && step === 4 && evidencePassed && <button className="primary" disabled={!choice} onClick={props.onSubmitReading}>実戦問題を答え合わせ</button>}
            {passed && step === 4 && <button className="primary" onClick={props.onNext}>{subQuestion === material.step4.length - 1 ? "結果を見る" : "次のスキャニングへ"} →</button>}
          </div>
        </section>
      </div>
    </main>
  );
}
