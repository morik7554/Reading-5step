import { useMemo } from "react";

type Props = {
  question: string; choices: string[]; selected: string; disabled: boolean;
  onSelect: (choice: string) => void;
};

export function QuestionChoices({ question, choices, selected, disabled, onSelect }: Props) {
  const shuffledChoices = useMemo(() => {
    const next = [...choices];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
    }
    return next;
  }, [question, choices]);

  return (
    <fieldset className="choice-question" disabled={disabled}>
      <legend className="question-text">{question}</legend>
      <div className="choices">
        {shuffledChoices.map((item, index) => (
          <button
            type="button"
            className={selected === item ? "selected" : ""}
            aria-pressed={selected === item}
            onClick={() => onSelect(item)}
            key={item}
          >
            <i aria-hidden="true">{String.fromCharCode(65 + index)}</i><span>{item}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
