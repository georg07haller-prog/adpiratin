import Dashboard from './pages/Dashboard';
import ReportAd from './pages/ReportAd';
import HuntAlternatives from './pages/HuntAlternatives';
import Leaderboard from './pages/Leaderboard';
import MemeGenerator from './pages/MemeGenerator';
import DSAGuide from './pages/DSAGuide';
import AdminPanel from './pages/AdminPanel';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "ReportAd": ReportAd,
    "HuntAlternatives": HuntAlternatives,
    "Leaderboard": Leaderboard,
    "MemeGenerator": MemeGenerator,
    "DSAGuide": DSAGuide,
    "AdminPanel": AdminPanel,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};