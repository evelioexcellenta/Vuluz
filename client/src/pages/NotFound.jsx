import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { ROUTES } from '../constants/routes';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 text-primary-500">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <Link to={ROUTES.DASHBOARD}>
          <Button variant="primary" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;