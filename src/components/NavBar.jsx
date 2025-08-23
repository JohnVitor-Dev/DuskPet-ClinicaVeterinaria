import { useNavigation } from "../hooks/useNavigation";
import {
    navPetsSVG,
    navConsultasSVG,
    navVeterinariosSVG,
    navLojaSVG
} from "./NavIcons";

export default function NavBar() {
    const { currentSite, handleNavigation } = useNavigation();

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <button className={currentSite === "pets" ? "active" : "inactive"} onClick={() => handleNavigation("pets")}>
                    {navPetsSVG}
                    <p className={currentSite === "pets" ? "nav-text" : "nav-text-inactive"}>Pets</p>
                </button>
                <button className={currentSite === "consultas" ? "active" : "inactive"} onClick={() => handleNavigation("consultas")}>
                    {navConsultasSVG}
                    <p className={currentSite === "consultas" ? "nav-text" : "nav-text-inactive"}>Consultas</p>
                </button>
                <button className={currentSite === "veterinarios" ? "active" : "inactive"} onClick={() => handleNavigation("veterinarios")}>
                    {navVeterinariosSVG}
                    <p className={currentSite === "veterinarios" ? "nav-text" : "nav-text-inactive"}>Veterinários</p>
                </button>
                <button className={currentSite === "loja" ? "active" : "inactive"} onClick={() => handleNavigation("loja")}>
                    {navLojaSVG}
                    <p className={currentSite === "loja" ? "nav-text" : "nav-text-inactive"}>Loja</p>
                </button>
            </ul>
        </nav>
    );
}
