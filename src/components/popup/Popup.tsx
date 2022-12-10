import 'katex/dist/katex.min.css';
import { useState } from 'react';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import htmlToCanvas from 'html2canvas';
// @ts-ignore
import { BlockMath } from 'react-katex';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Storage } from '../../utils';
import './Popup.scss';

function Header() {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

  Storage.get<boolean>('darkMode').then(isDark => setDarkMode(isDark || false));
  
  function setDarkMode(isDark: boolean) {
    Storage.set('darkMode', isDark);
    setIsDark(isDark);
    document.body.classList.toggle('dark', isDark);
  }
  
  return (
    <div className="header">
      <img className="title" src={`/LaTeX_logo_${isDark ? 'dark' : 'light'}.svg`} alt="" />

      {
        isDark !== undefined &&
          <DarkModeSwitch 
            checked={isDark}
            onChange={setDarkMode}
          />
      }
    </div>
  )
}

function FormulaBox() {
  const DEFAULT_LATEX = 'e^{i\\pi}+1=0';
  const DEFAULT_TOOLTIP = 'Copy to clipboard';
  const [latex, setLatex] = useState<string | undefined>(undefined);
  const [tooltipContent, setTooltipContent] = useState(DEFAULT_TOOLTIP);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  Storage.get<string>('latex').then(latex => setLatex(latex || ''));

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
    } catch(err) {
      console.log(err);
      setTooltipContent('❌');
    } finally {
      setTimeout(() => {
        setTooltipContent(DEFAULT_TOOLTIP);
      }, 2000);
    }

    // TODO: Add Latex history
  }

  return (
    (
      latex !== undefined ?
        <div className="formula-box">
          <div
            className="formula"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseMove={({clientX, clientY}) => setTooltipPosition({ x: clientX, y: clientY })}
            onMouseLeave={() => setTooltipVisible(false)}
            onClick={copyFormula}
          >
            <BlockMath math={latex || DEFAULT_LATEX} />
            <div
              className="tooltip"
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
            className="textarea"
            value={latex}
            placeholder={DEFAULT_LATEX}
            onChange={({target: {value}}) => {
              Storage.set('latex', value.trimStart());
              setLatex(value.trimStart());
            }}
          />
          <a
            className="support-table"
            href="https://katex.org/docs/support_table.html"
            target="_blank"
            rel="noreferrer"
          ><FontAwesomeIcon icon={faLink} />지원되는 Tex 문법</a>
        </div>
      : <div>Loading...</div>
    )
  );
}

function Popup() {
  return (
    <div className="popup">
      <Header />

      <FormulaBox />
    </div>
  );
}

export default Popup;
