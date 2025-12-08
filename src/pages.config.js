import Dashboard from './pages/Dashboard';
import ReportAd from './pages/ReportAd';
import HuntAlternatives from './pages/HuntAlternatives';
import Leaderboard from './pages/Leaderboard';
import MemeGenerator from './pages/MemeGenerator';
import DSAGuide from './pages/DSAGuide';
import AdminPanel from './pages/AdminPanel';
import MobilePreview from './pages/MobilePreview';
import IndiegogoPage from './pages/IndiegogoPage';
import ExtensionDemo from './pages/ExtensionDemo';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "ReportAd": ReportAd,
    "HuntAlternatives": HuntAlternatives,
    "Leaderboard": Leaderboard,
    "MemeGenerator": MemeGenerator,
    "DSAGuide": DSAGuide,
    "AdminPanel": AdminPanel,
    "MobilePreview": MobilePreview,
    "IndiegogoPage": IndiegogoPage,
    "ExtensionDemo": ExtensionDemo,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};