import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './kg.css';
import './kg-curriculum.css';
import './kg-api.css';
import { KgProvider, useKg } from './context/KgContext';
import { stopVoice } from './audio/voice';
import { TeacherProvider } from './teacher/TeacherContext';
import { TeacherDock } from './components/TeacherDock';
import { VoiceDialog } from './components/VoiceDialog';
import { KgQuizSubjects } from '../../kgquizz';

export function KgLayout() {
  return (
    <KgProvider>
      <TeacherProvider>
        <Shell />
      </TeacherProvider>
    </KgProvider>
  );
}

function Shell() {
  const { voiceChosen } = useKg();
  const { pathname } = useLocation();
  const showDock = !pathname.endsWith('/today');
  const isHome = pathname.replace(/\/+$/, '') === '/kg';
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      window.setTimeout(() => {
        if (!alive.current) stopVoice();
      }, 0);
    };
  }, []);

  return (
    <div className="zkg">
      <div className="zkg-shell" style={showDock ? undefined : { gridTemplateColumns: 'minmax(0, 1fr)' }}>
        {showDock && <TeacherDock />}
        <div className="zkg-content">
          <Outlet />
        </div>
      </div>
      {isHome && (
        <section className="mx-auto w-full px-4 sm:px-8 pb-12" style={{ maxWidth: 1400 }}>
          <KgQuizSubjects />
        </section>
      )}
      {!voiceChosen && <VoiceDialog />}
    </div>
  );
}