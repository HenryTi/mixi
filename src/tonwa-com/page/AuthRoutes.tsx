import { Route, Routes } from "react-router-dom";

export function AuthRoutes() {
    return <Routes>
        <Route path="/login" element={<Login />} />
    </Routes>;
}


function Login() {
    return <div>login</div>;
}