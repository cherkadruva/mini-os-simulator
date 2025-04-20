
import { useEffect } from 'react';
import MiniOS from '../components/MiniOS';

const Index = () => {
  // Set up document title
  useEffect(() => {
    document.title = 'MiniOS - Interactive OS Simulator';
  }, []);

  return (
    <div className="h-screen">
      <MiniOS />
    </div>
  );
};

export default Index;
