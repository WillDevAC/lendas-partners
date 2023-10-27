import React from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AuthPage from "../pages/Auth";
import HomePage from "../pages/Home";

import AffiliatesPendingPage from "../pages/AffiliatesPending";
import IndicatorsPage from "../pages/Indicators";

import NotFoundPage from "../pages/404";
import BlacklistPage from "../pages/BlackList";
import BotsPage from "../pages/Bot";

const RouterController: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/affiliates/pending" element={<AffiliatesPendingPage />} />
        <Route path="/affiliates/blacklist" element={<BlacklistPage  />} />
        <Route path="/affiliates/indicators" element={<IndicatorsPage />} />
        <Route path="/affiliates/bots/" element={<BotsPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterController;
