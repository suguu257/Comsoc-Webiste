import "./Navbar.css";

const links = [
  "HOME",
  "ABOUT",
  "ACHIEVEMENTS",
  "TEAM",
  "GALLERY",
  "CONTACT"
];

export default function Navbar() {

  return (

    <header className="navbar">

      <div className="navbarLogo">

        IEEE COMSOC

      </div>

      <nav className="navbarLinks">

        {links.map((item, index) => (

          <a

            href="#"

            key={item}

            className={index === 0 ? "active" : ""}

          >

            {item}

          </a>

        ))}

      </nav>

      {/* Rocket eventually docks here */}

      <div className="rocketDock">

    <div id="rocketDockPoint"></div>

</div>

    </header>

  );

}