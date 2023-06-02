import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Elyssa
          </Link>
        </li>

        <li className="nav-item dropdown">
          <Link to="/about" className="nav-link">
            Le Projet
          </Link>

          <div className="dropdown-content">
            <Link to="/about/project" className="nav-link">
              Presentation du Projet
            </Link>
            <Link to="/about/teams" className="nav-link">
              Equipes
            </Link>
            <Link to="/about/research" className="nav-link">
              Recherches Électorales
            </Link>
            <Link to="/about/publications" className="nav-link">
              Publications
            </Link>
          </div>
        </li>

        <li className="nav-item">
          <Link to="/guide" className="nav-link">
            Prise en Main
          </Link>
        </li>

        <li className="nav-item dropdown">
          <Link to="/explore" className="nav-link">
            Explorer les Données
          </Link>

          <div className="dropdown-content">
            <Link to="/explore/elections" className="nav-link">
              Par Élection
            </Link>
            <Link to="/explore/geography" className="nav-link">
              Par Niveau geographique
            </Link>
            <Link to="/explore/themes" className="nav-link">
              Par Themes
            </Link>
          </div>
        </li>

        <li className="nav-item">
          <Link to="/maps" className="nav-link">
            Cartes et Graphiques
          </Link>

          <div className="dropdown-content">
            <Link to="/maps/thematic" className="nav-link">
              Cartographie Thematique
            </Link>
            <Link to="/explore/socionomic" className="nav-link">
              Cartographie Socio-Électorale
            </Link>
          </div>
        </li>

        <li className="nav-item">
          <Link to="/legal" className="nav-link">
            Mentions Légales
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Connexion
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
