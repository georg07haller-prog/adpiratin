/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
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
import Clans from './pages/Clans';
import WallOfShamePage from './pages/WallOfShamePage';
import YouTubeLive from './pages/YouTubeLive';
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
    "Clans": Clans,
    "WallOfShamePage": WallOfShamePage,
    "YouTubeLive": YouTubeLive,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};