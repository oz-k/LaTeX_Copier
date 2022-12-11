import htmlToCanvas from 'html2canvas';
import 'katex/dist/katex.min.css';
import { useState } from 'react';
// @ts-ignore
import { BlockMath } from 'react-katex';
import { IHistory } from '../../interfaces';
import './FormulaBox.scss';

interface FormulaBoxProps {
  latex: string;
  setLatex: (latex: string) => void;
  addHistory: (history: IHistory) => void;
}

function FormulaBox(props: FormulaBoxProps) {
  const EXAMPLE_LATEX = 'e^{i\\pi}+1=0';
  const DEFAULT_TOOLTIP = 'Copy to clipboard';
  const [tooltipContent, setTooltipContent] = useState(DEFAULT_TOOLTIP);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  async function copyFormula() {
    try {
      const canvas = await htmlToCanvas(document.querySelector('.katex')!, {
        // 해상도를 위해 추가
        scale: 3,
        // 다크모드 캡쳐를 위해 추가
        onclone: (_, elem) => {
          elem.style.color = '#000';
        }
      });
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) return resolve(blob);
          reject();
        });
      });
  
      await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);

      setTooltipContent('✅');
      props.addHistory({ latex: props.latex });
    } catch(err) {
      console.log(err);
      setTooltipContent('❌');
    } finally {
      setTimeout(() => {
        setTooltipContent(DEFAULT_TOOLTIP);
      }, 2000);
    }
  }

  return (
    (
      <div className="formula-box">
        <div
          className="formula-box__katex"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseMove={({clientX, clientY}) => setTooltipPosition({ x: clientX, y: clientY })}
          onMouseLeave={() => setTooltipVisible(false)}
          onClick={copyFormula}
        >
          <BlockMath math={props.latex || EXAMPLE_LATEX} />
          <div
            className="formula-box__katex--tooltip"
            style={{
              display: tooltipVisible ? 'inline-block' : 'none',
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
            }}
          >
            {tooltipContent}
          </div>
        </div>
        <textarea
          className="formula-box__input"
          value={props.latex}
          placeholder={EXAMPLE_LATEX}
          onChange={({target: {value}}) => props.setLatex(value)}
        />
      </div>
    )
  );
}

export default FormulaBox;