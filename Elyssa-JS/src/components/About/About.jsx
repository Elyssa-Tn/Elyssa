import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <>
      <h2>Le Projet Elyssa</h2>
      <div className="container-a">
        <div className="container-b">
          <h3>Presentation du Projet</h3>
          <br />
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt
            qui, omnis est eligendi necessitatibus illo pariatur facilis eos
            quibusdam doloribus maiores deserunt, ratione ea architecto. Vel
            amet magni expedita assumenda?
          </p>
        </div>
        <div className="container-c">
          <div className="container-q">
            <Link to="/about/project">
              <p className="text-overlay">Presentation du Projet</p>
              <img src="17-12-22.png" alt="Picture 1" />
            </Link>
          </div>
          <div className="container-q">
            <Link to="/about/teams">
              <p className="text-overlay">Equipes</p>
              <img src="17-12-22.png" alt="Picture 2" />
            </Link>
          </div>
          <div className="container-q">
            <Link to="/about/research">
              <p className="text-overlay">Recherches Électorales</p>
              <img src="17-12-22.png" alt="Picture 3" />
            </Link>
          </div>
          <div className="container-q">
            <Link to="/about/publications">
              <p className="text-overlay">Publications</p>
              <img src="17-12-22.png" alt="Picture 4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
