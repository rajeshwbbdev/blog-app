import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo_R.jpg";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../Context/userContext";

const Header = () => {
  const [isNavbarShowing, setIsNavbarShowing] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) setIsNavbarShowing(false);
    else setIsNavbarShowing(true);
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={Logo} alt="" />
        </Link>
        {currentUser?.id && isNavbarShowing && (
          <ul className="nav__menu">
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?.id && isNavbarShowing && (
          <ul className="nav__menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}
        <div
          className="nav__toggle_btn"
          onClick={() => setIsNavbarShowing(!isNavbarShowing)}
        >
          {isNavbarShowing ? <AiOutlineClose /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Header;
