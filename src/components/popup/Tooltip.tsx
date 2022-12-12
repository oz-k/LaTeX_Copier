import { useState } from 'react';
import './Tooltip.scss';

interface TooltipProps {
  target: HTMLElement;
  content: string;
  onClick?: () => void | Promise<void>;
}

function Tooltip(props: TooltipProps) {
  const [content, setContent] = useState(props.content);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  props.target.onmouseenter = () => {
    setIsVisible(true);
  }
  props.target.onmousemove = ({ clientX, clientY }) => {
    setPosition({ x: clientX, y: clientY });
  }
  props.target.onmouseleave = () => {
    setIsVisible(false);
  }
  props.target.onclick = async () => {
    if (props.onClick) {
      try {
        await props.onClick();
        setContent('✅');
      } catch (e) {
        setContent('❌');
      } finally {
        setTimeout(() => {
          setContent(props.content);
        }, 1000);
      }
    }
  }

  return (
    <div
      className="tooltip"
      style={{
        display: isVisible ? 'inline-block' : 'none',
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {content}
    </div>
  );
}

export default Tooltip;