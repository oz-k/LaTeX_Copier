import { faLink, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.scss';

interface FooterProps {
  switchIsHistoriesVisible: () => void;
  isHistoriesVisible: boolean;
}

function Footer(props: FooterProps) {
  return (
    <div className="footer">
      <div
        className="footer__dropdown"
        onClick={props.switchIsHistoriesVisible}
      >
        <FontAwesomeIcon
          className="icon"
          icon={props.isHistoriesVisible ? faChevronDown : faChevronUp}
        />
        <span>History</span>
      </div>
      <a
        className="footer__support"
        href="https://katex.org/docs/support_table.html"
        target="_blank"
        rel="noreferrer"
      ><FontAwesomeIcon icon={faLink} />Supported TeX tables</a>
    </div>
  );
}

export default Footer;