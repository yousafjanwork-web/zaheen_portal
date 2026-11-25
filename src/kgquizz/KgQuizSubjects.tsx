import { useNavigate } from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen';

export default function KgQuizSubjects() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FFFDF7] font-fun rounded-3xl p-4 sm:p-8">
      <HomeScreen
        embedded
        onSelectSubject={(s) => navigate(`/kg/quiz?subject=${s}`)}
        onLaunchActivity={() => {}}
        onViewStickers={() => {}}
        onOpenMediaStudio={() => {}}
        totalStars={0}
      />
    </div>
  );
}