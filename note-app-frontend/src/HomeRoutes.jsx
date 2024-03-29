import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewNote from "./components/ViewNote";
import NoContent from "./Nocontent";

export default function HomeRoutes() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ViewNote />} />
                    <Route path="/home" element={<ViewNote />} />
                    <Route path="*" element={<NoContent />} />
                </Routes>

                
            </BrowserRouter>
        </>

        

    );

}
