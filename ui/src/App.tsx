import "./App.css";
import { LoginForm } from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RegisterForm } from "./components/RegisterForm";
import { Frontpage } from "./components/Frontpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
