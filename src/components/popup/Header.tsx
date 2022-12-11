import { useState } from 'react';
import { Storage } from '../../utils';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import './Header.scss';

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
      <img className="header__title" src={`/LaTeX_logo_${isDark ? 'dark' : 'light'}.svg`} alt="" />

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

export default Header;