import Layout from '@/layout/Layout';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import EMIDetails from './pages/EMIDetails';
import { OAuth } from './pages/OAuthRoute';
import AmortizationSchedule from './pages/AmortizationSchedule';
import NotFoundPage from './pages/NotFoundPage';

const HomeRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/callback" element={<OAuth />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/emi/:id" element={<EMIDetails />} />
                    <Route path="/emi/:id/amortization" element={<AmortizationSchedule />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default HomeRouter;
