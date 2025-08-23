import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useNavigation() {
    const location = useLocation();
    const navigate = useNavigate();

    const getSiteFromPathname = (pathname) => {
        return pathname.replace("/", "") || "pets";
    };

    const initialSite = getSiteFromPathname(location.pathname);
    const [currentSite, setCurrentSite] = useState(initialSite);

    useEffect(() => {
        setCurrentSite(getSiteFromPathname(location.pathname));
    }, [location.pathname]);

    const handleNavigation = (site) => {
        if (site !== currentSite) {
            navigate(`/${site}`);
        }
    };

    return { currentSite, handleNavigation };
}