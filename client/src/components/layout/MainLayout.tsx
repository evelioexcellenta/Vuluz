import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ArrowUpRightIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon,
  WalletIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const routes = [
    { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <CreditCardIcon size={20} /> },
    { path: '/transfer', label: 'Transfer', icon: <ArrowUpRightIcon size={20} /> },
    { path: '/top-up', label: 'Top Up', icon: <WalletIcon size={20} /> },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="flex items-center text-primary-600 font-bold text-xl"
            >
              <WalletIcon className="h-6 w-6 mr-2" />
              <span>PayWave</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <div className="text-gray-700">
                <span className="font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </div>
            )}
            <button 
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOutIcon size={18} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
          
          <button 
            className="block md:hidden"
            onClick={toggleMobileMenu}
          >
            <MenuIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </nav>
      
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="fixed right-0 top-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="font-bold text-lg">Menu</div>
              <button onClick={closeMobileMenu}>
                <XIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            <div className="py-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`
                    flex items-center px-4 py-3
                    ${isActive(route.path) 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                  onClick={closeMobileMenu}
                >
                  {route.icon}
                  <span className="ml-3">{route.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                {currentUser && (
                  <div className="px-4 py-2 text-gray-700">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                  </div>
                )}
                <button 
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="flex items-center px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-50"
                >
                  <LogOutIcon size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main layout with sidebar and content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`
                    flex items-center px-3 py-2.5 rounded-md
                    ${isActive(route.path) 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {route.icon}
                  <span className="ml-3">{route.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;