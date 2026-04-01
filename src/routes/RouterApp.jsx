import { Route, Routes } from "react-router-dom";
import Homepage from "../components/Homepage";

export default function Router() {
  return (
    <Routes>
      <Route path="Chess" element={<Homepage />} />
    </Routes>
  )
}
