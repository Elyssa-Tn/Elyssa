import { Link } from "react-router-dom";
import "./Explore.css";

const Explore = () => {
  return (
    <div className="container">
      <h2 className="title">Explorer les données</h2>
      <p className="paragraph">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa in nobis
        fuga laboriosam, quam similique ex tempora blanditiis, iste quae fugit
        laborum temporibus sed culpa voluptas qui aspernatur natus animi?
      </p>
      <div className="image-container">
        <div className="image">
          <Link to="/explore/elections">
            <p className="text-overlay">Choisir les Elections</p>
            <img src="17-12-22.png" alt="Image 1" />
          </Link>
        </div>
        <div className="image">
          <Link to="/explore/geography">
            <p className="text-overlay">Choisir le Niveau Geographique</p>
            <img src="17-12-22.png" alt="Image 2" />
          </Link>
        </div>
        <div className="image">
          <Link to="/explore/themes">
            <p className="text-overlay">Explorer par themes</p>
            <img src="17-12-22.png" alt="Image 3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Explore;
