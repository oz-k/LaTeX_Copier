import { useState } from 'react';
import { IHistory } from '../../interfaces';
import { HistoryStorage, LatexStorage, Storage } from '../../utils';
import Footer from './Footer';
import FormulaBox from './FormulaBox';
import Header from './Header';
import HistoryList from './HistoryList';
import './Popup.scss';

function Popup() {
  const [latex, setLatexState] = useState<string | undefined>(undefined);
  const [histories, setHistories] = useState<IHistory[]>([]);
  const [isHistoriesVisible, setIsHistoriesVisible] = useState(true);

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

  async function switchIsHistoriesVisible() {
    setIsHistoriesVisible(!isHistoriesVisible);
    await Storage.set('isHistoriesVisible', !isHistoriesVisible);
  }

  LatexStorage.get().then(latex => setLatexState(latex));
  HistoryStorage.getAll().then(histories => setHistories(histories));
  Storage.get<boolean>('isHistoriesVisible').then(isHistoriesVisible => setIsHistoriesVisible(isHistoriesVisible ?? false));

  // TODO: Modularize tooltip

  return (
    <div className="popup">
      <div className="popup__main">
        <Header />
        <div className="group">
          {
            latex !== undefined
              ? <FormulaBox
                latex={latex}
                setLatex={setLatex}
                addHistory={addHistory}
              />
              : null
          }
          <Footer
            switchIsHistoriesVisible={switchIsHistoriesVisible}
            isHistoriesVisible={isHistoriesVisible}
          />
        </div>
      </div>
      {
        histories.length && isHistoriesVisible
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
