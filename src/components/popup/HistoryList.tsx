import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'katex/dist/katex.min.css';
import { IHistory } from '../../interfaces';
import './HistoryList.scss';
import { useRef } from 'react';
// @ts-ignore
import { BlockMath } from 'react-katex';
import Tooltip from './Tooltip';

interface HistoryProps {
  history: IHistory;
  removeHistory: () => void;
  setLatex: () => void;
}

function History(props: HistoryProps) {
  const tooltipTargetRef = useRef<HTMLElement>(null);

  return (
    <div className="history__list--item history">
      <div className="history__katex">
        <span ref={tooltipTargetRef}>
          <BlockMath math={props.history.latex} />
        </span>
        {
          tooltipTargetRef.current && (
            <Tooltip
              content='Apply'
              target={tooltipTargetRef.current}
              onClick={props.setLatex}
            />
          )
        }
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