import { Outlet, useLocation } from "react-router";
// import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

const App = () => {
  const location = useLocation();

  // defining routes where navbar should be hidden
  const hideNavbarRoutes = ["/dashboard", "/history"];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {showNavbar && (
        <div className="sticky top-0 left-0 z-50">
          <Navbar />
        </div>
      )}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {/* <div>
        <Footer />
      </div> */}
    </div>
  );
};

export default App;
