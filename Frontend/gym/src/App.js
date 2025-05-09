import "./App.css";
import { ToastContainer } from "react-toastify";
import MenuBar from "./components/MenuBar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Activities from "./Pages/Activities";
import DashBoard from "./Pages/DashBoard";
import RequireAuth from "./context/RequireAuth";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <MenuBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route element={<RequireAuth />}>
          <Route path="/activities" element={<Activities />}></Route>
          <Route path="/dashboard" element={<DashBoard />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
