import htmlToCanvas from 'html2canvas';
import 'katex/dist/katex.min.css';
import { useRef } from 'react';
// @ts-ignore
import { BlockMath } from 'react-katex';
import { IHistory } from '../../interfaces';
import './FormulaBox.scss';
import Tooltip from './Tooltip';

interface FormulaBoxProps {
  latex: string;
  setLatex: (latex: string) => void;
  addHistory: (history: IHistory) => void;
}

function FormulaBox(props: FormulaBoxProps) {
  const EXAMPLE_LATEX = 'e^{i\\pi}+1=0';
  const tooltipTargetRef = useRef<HTMLElement>(null);

  async function copyFormula() {
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

    props.addHistory({ latex: props.latex });
  }

  return (
    (
      <div className="formula-box">
        <div className="formula-box__katex">
          <span ref={tooltipTargetRef}>
            <BlockMath math={props.latex || EXAMPLE_LATEX} />
          </span>
          {
            tooltipTargetRef.current && (
              <Tooltip
                content="Copy to clipboard"
                target={tooltipTargetRef.current}
                onClick={copyFormula}
              />
            )
          }
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