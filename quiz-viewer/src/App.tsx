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
        <Route path="/" element={<Navigate to="/honeymoon-match" replace />} />
        <Route path="/:quizSlug" element={<QuizViewer />} />
        <Route path="/:quizSlug/results" element={<QuizResults />} />
        <Route path="*" element={<Navigate to="/honeymoon-match" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
