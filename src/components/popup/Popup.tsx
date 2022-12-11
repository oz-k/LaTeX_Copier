import { useState } from 'react';
import { IHistory } from '../../interfaces';
import { HistoryStorage, LatexStorage } from '../../utils';
import FormulaBox from './FormulaBox';
import Header from './Header';
import HistoryList from './HistoryList';
import './Popup.scss';

function Popup() {
  const [latex, setLatexState] = useState<string | undefined>(undefined);
  const [histories, setHistories] = useState<IHistory[]>([]);

  async function setLatex(latex: string) {
    const trimedLatex = latex.trimStart();

    setLatexState(trimedLatex);
    await LatexStorage.set(trimedLatex);
  }

  async function addHistory(history: IHistory) {
    setHistories(histories => [history, ...histories]);

    await HistoryStorage.add(history);
  }

  async function removeHistory(index: number) {
    setHistories(histories => histories.filter((_, i) => i !== index));

    await HistoryStorage.remove(index);
  }

  LatexStorage.get().then(latex => setLatexState(latex));
  HistoryStorage.getAll().then(histories => setHistories(histories));

  // TODO: Modularize tooltip
  // TODO: Add footer with dropdown history list

  return (
    <div className="popup">
      <div className="popup__main">
        <Header />
        {
          latex !== undefined
            ? <FormulaBox
              latex={latex}
              setLatex={setLatex}
              addHistory={addHistory}
            />
            : null
        }
      </div>

      {
        histories.length
          ? <HistoryList
            histories={histories}
            removeHistory={removeHistory}
            setLatex={setLatex}
          />
          : null
      }
    </div>
  );
}

export default Popup;
