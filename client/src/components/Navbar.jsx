import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          HireHub
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/jobs">
            Jobs
          </Link>

          {user ? (
            <>
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
              {user.role === "recruiter" ? (
                <Link className="nav-link" to="/recruiter-dashboard">
                  Recruiter
                </Link>
              ) : (
                <Link className="nav-link" to="/applications">
                  Applications
                </Link>
              )}
              <button
                className="btn btn-outline-light btn-sm ms-2"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>

              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;