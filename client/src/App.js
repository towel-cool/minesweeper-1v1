import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homepage';
import GameSettingsPage from './pages/gamesettingspage';
import GamePage from './pages/gamepage';
import JoinGamePage from './pages/joingamepage';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="gamesettings" element={<GameSettingsPage />} />
      <Route path="game" element={<GamePage />} />
      <Route path="game/:roomCode" element={<GamePage />} />
      <Route path="joingame" element={<JoinGamePage />} />
    </Routes>
    </>
  );
}

export default App;
