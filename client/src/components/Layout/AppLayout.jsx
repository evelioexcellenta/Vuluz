import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { APP_CONFIG } from "../../constants/config";

const AppLayout = ({ children }) => {
  return (
    <>
      {" "}
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <main className="py-6 px-8 ml-20 mr-20">{children}</main>
        </div>
      </div>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
