import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { APP_CONFIG } from "../../constants/config";

const AppLayout = ({ children }) => {
  return (
    <>
      {" "}
      {/* <Navbar /> */}
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 pl-64">
          {" "}
          {/* Tambahkan pl-64 agar tidak ketimpa sidebar */}
          <main className="py-6 px-8">{children}</main>
        </div>
      </div>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
