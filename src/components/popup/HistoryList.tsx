import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'katex/dist/katex.min.css';
import { IHistory } from '../../interfaces';
import './HistoryList.scss';
// @ts-ignore
import { BlockMath } from 'react-katex';
import { useState } from 'react';

interface HistoryProps {
  history: IHistory;
  removeHistory: () => void;
  setLatex: () => void;
}

function History(props: HistoryProps) {
  const DEFAULT_TOOLTIP = 'Apply';
  const [tooltipContent, setTooltipContent] = useState(DEFAULT_TOOLTIP);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  function applyLatex() {
    props.setLatex();
    setTooltipContent('✅');
    setTimeout(() => {
      setTooltipContent(DEFAULT_TOOLTIP);
    }, 1000);
  }

  return (
    <div className="history__list--item history">
      <div
        className="history__katex"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseMove={({clientX, clientY}) => setTooltipPosition({ x: clientX, y: clientY })}
        onMouseLeave={() => setTooltipVisible(false)}
        onClick={applyLatex}
      >
        <BlockMath math={props.history.latex} />
        <div
            className="history__katex--tooltip"
            style={{
              display: tooltipVisible ? 'inline-block' : 'none',
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
            }}
          >
            {tooltipContent}
          </div>
      </div>
      <FontAwesomeIcon
        className="history__delete"
        icon={faXmark}
        onClick={props.removeHistory}
      />
    </div>
  );
}

interface HistoryListProps {
  histories: IHistory[];
  removeHistory: (index: number) => void;
  setLatex: (latex: string) => void;
}

function HistoryList(props: HistoryListProps) {
  return (
    <div className="history__list">
      {
        props.histories.map((history, index) => (
          <History
            history={history}
            removeHistory={() => props.removeHistory(index)}
            setLatex={() => props.setLatex(history.latex)}
            key={index}
          />
        ))
      }
    </div>
  );
}

export default HistoryList;