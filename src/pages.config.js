import AdminPanel from './pages/AdminPanel';
import AnthemPublic from './pages/AnthemPublic';
import DSAGuide from './pages/DSAGuide';
import Dashboard from './pages/Dashboard';
import ExtensionDemo from './pages/ExtensionDemo';
import Home from './pages/Home';
import HuntAlternatives from './pages/HuntAlternatives';
import IndiegogoPage from './pages/IndiegogoPage';
import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import MemeGenerator from './pages/MemeGenerator';
import MobilePreview from './pages/MobilePreview';
import NovaLibertalia from './pages/NovaLibertalia';
import ReportAd from './pages/ReportAd';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminPanel": AdminPanel,
    "AnthemPublic": AnthemPublic,
    "DSAGuide": DSAGuide,
    "Dashboard": Dashboard,
    "ExtensionDemo": ExtensionDemo,
    "Home": Home,
    "HuntAlternatives": HuntAlternatives,
    "IndiegogoPage": IndiegogoPage,
    "Landing": Landing,
    "Leaderboard": Leaderboard,
    "MemeGenerator": MemeGenerator,
    "MobilePreview": MobilePreview,
    "NovaLibertalia": NovaLibertalia,
    "ReportAd": ReportAd,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};