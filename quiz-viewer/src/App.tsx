import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QuizViewer } from "./components/QuizViewer";
import { QuizResults } from "./components/QuizResults";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizViewer />} />
        <Route path="/results" element={<QuizResults />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
