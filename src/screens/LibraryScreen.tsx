import type { LearningRecord, Level, Material } from "../types";

const levelOptions: Level[] = ["中1", "中2", "中3", "入試"];
const levelGuide: Record<Level, string> = {
  中1: "英検5級レベル", 中2: "英検4級レベル", 中3: "英検3級レベル", 入試: "高校入試レベル",
};

type Props = {
  materials: Material[]; material: Material; selectedLevel: Level | null;
  selectedMaterialId: string; learningHistory: LearningRecord[];
  onChooseLevel: (level: Level) => void; onChooseMaterial: (id: string) => void; onStart: () => void;
};

export function LibraryScreen(props: Props) {
  const { materials, material, selectedLevel, selectedMaterialId, learningHistory } = props;
  const levelMaterials = selectedLevel ? materials.filter((item) => item.level === selectedLevel) : [];
  const completedMaterialIds = new Set(learningHistory.map((record) => record.materialId));
  const averageScore = learningHistory.length
    ? Math.round(learningHistory.reduce((sum, record) => sum + record.score, 0) / learningHistory.length) : 0;
  return (
    <main className="library-page">
      <header className="library-header">
        <div><p className="eyebrow">STRATEGIC READING</p><h1>長文読解 5STEP</h1><p>長文は、最初から全部読まない。5つの作戦で根拠を見つけよう。</p></div>
        <div className="strategy-card">長文は真面目に読むな。<strong>戦略で読め。</strong></div>
      </header>
      <section className="dashboard-grid">
        <div className="record-panel">
          <div className="section-heading"><div><span>LEARNING RECORD</span><h2>学習の記録</h2></div></div>
          <div className="record-summary">
            <div><strong>{learningHistory.length}</strong><span>学習回数</span></div>
            <div><strong>{completedMaterialIds.size}</strong><span>完了教材</span></div>
            <div><strong>{averageScore}<small>%</small></strong><span>平均スコア</span></div>
          </div>
          <div className="recent-records">
            {learningHistory.length === 0 && <p className="empty-record">まだ学習記録はありません。学年を選んで始めましょう。</p>}
            {learningHistory.slice(0, 3).map((record) => (
              <div key={`${record.materialId}-${record.completedAt}`}>
                <span>{record.level}</span><b>{record.title}</b><strong>{record.correct}/{record.total}（{record.score}%）</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="level-panel">
          <div className="section-heading"><div><span>SELECT LEVEL</span><h2>問題のレベルを選ぶ</h2></div></div>
          <p>現在の学年、または挑戦したいレベルを選択してください。</p>
          <div className="level-selector">
            {levelOptions.map((level) => (
              <button type="button" aria-pressed={selectedLevel === level} className={selectedLevel === level ? "selected" : ""} onClick={() => props.onChooseLevel(level)} key={level}>
                <b>{level}</b><span>{levelGuide[level]}</span><small>{materials.filter((item) => item.level === level).length}教材</small>
              </button>
            ))}
          </div>
        </div>
      </section>
      {selectedLevel ? (
        <section className="level-materials">
          <div className="materials-heading"><h2>{selectedLevel}の教材</h2><span>{levelGuide[selectedLevel]}・5つの中から選んでください</span></div>
          <div className="material-grid" aria-label={`${selectedLevel}の教材一覧`}>
            {levelMaterials.map((item, index) => {
              const latestRecord = learningHistory.find((record) => record.materialId === item.id);
              return (
                <button type="button" aria-pressed={item.id === selectedMaterialId} className={`material-card ${item.id === selectedMaterialId ? "selected" : ""}`} key={item.id} onClick={() => props.onChooseMaterial(item.id)}>
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="card-meta">{item.genre}</span><strong>{item.title}</strong>
                  <span className="card-count">{latestRecord ? `前回 ${latestRecord.score}%` : `実戦 ${item.step5.length}問`}</span>
                  {latestRecord && <i className="completed-mark">✓ 学習済み</i>}
                </button>
              );
            })}
          </div>
          <button className="primary large start-button" onClick={props.onStart}>「{material.title}」を始める</button>
        </section>
      ) : <div className="level-prompt">上のボタンから学年を選ぶと、教材が表示されます。</div>}
    </main>
  );
}
