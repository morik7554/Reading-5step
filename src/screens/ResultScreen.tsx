import { getResultSummary, skillLabels } from "../services/scoring";
import type { AttemptRecord, Material } from "../types";

type Props = {
  material: Material; records: AttemptRecord[];
  speech: {
    audioState: "stopped" | "playing" | "paused"; englishVoices: SpeechSynthesisVoice[];
    selectedVoiceURI: string; selectVoice: (uri: string) => void;
    play: () => void; pause: () => void; stop: () => void;
  };
  onLibrary: () => void; onRetry: () => void;
};

export function ResultScreen({ material, records, speech, onLibrary, onRetry }: Props) {
  const { correctFinal, practicalScore, skillScores, questionReviews } = getResultSummary(material, records);
  return (
    <main className="result-page">
      <header className="result-header">
        <div><p className="eyebrow">RESULT & REVIEW</p><h1>{material.title}</h1><p>{material.level} ・ {material.genre}</p></div>
        <div className="total-score"><span>実戦スコア</span><strong>{correctFinal}/{material.step5.length}</strong><b>{practicalScore}%</b></div>
      </header>
      <section className="score-panel"><h2>読解力スコア</h2><div className="skill-grid">
        {skillLabels.map((label, index) => <div className="skill-score" key={label}><div><span>{label}</span><b>{skillScores[index]}</b></div><div className="meter"><i style={{ width: `${skillScores[index]}%` }} /></div></div>)}
      </div></section>
      <section className="audio-review">
        <div className="audio-review-heading">
          <div><span>LISTENING REVIEW</span><h2>英文全文の音声</h2><p>英文を見ながら、発音と意味を確認しよう。</p></div>
          <div className="audio-tools">
            {speech.englishVoices.length > 0 && <label className="voice-selector"><span>英語音声</span>
              <select value={speech.selectedVoiceURI} onChange={(event) => speech.selectVoice(event.target.value)}>
                {speech.englishVoices.map((voice) => <option value={voice.voiceURI} key={voice.voiceURI}>{voice.name}（{voice.lang}）</option>)}
              </select>
            </label>}
            <div className="audio-controls">
              <button className="audio-play" onClick={speech.play}>{speech.audioState === "paused" ? "▶ 続きから再生" : speech.audioState === "playing" ? "● 再生中" : "▶ 全文を聞く"}</button>
              {speech.audioState === "playing" && <button onClick={speech.pause}>Ⅱ 一時停止</button>}
              {speech.audioState !== "stopped" && <button onClick={speech.stop}>■ 停止</button>}
            </div>
          </div>
        </div>
        <p className="audio-passage">{material.passage}</p>
      </section>
      <section className="review-grid">
        <article className="review-card"><h2>英文全文</h2><p className="review-passage">{material.passage}</p></article>
        <article className="review-card translation-card"><h2>日本語訳</h2><p>{material.translation}</p></article>
      </section>
      <section className="mistakes"><h2>問題の解答・解説</h2>
        {questionReviews.map((review) => <article className={review.wrongAnswers.length ? "review-wrong" : "review-correct"} key={review.question}>
          <span>問題 {review.number}　{review.wrongAnswers.length ? `${review.attemptCount}回目で正解` : "1回で正解"}</span>
          <h3>{review.question}</h3>
          {review.wrongAnswers.length > 0 && <p className="wrong"><b>間違えた答え：</b>{review.wrongAnswers.join(" ／ ")}</p>}
          <p><b>正解：</b>{review.answer}</p><p className="evidence-review"><b>根拠文：</b>{review.evidence}</p><p><b>解説：</b>{review.explanation}</p>
        </article>)}
      </section>
      <div className="result-actions"><button className="secondary" onClick={onLibrary}>教材一覧へ</button><button className="primary" onClick={onRetry}>もう一度挑戦</button></div>
    </main>
  );
}
