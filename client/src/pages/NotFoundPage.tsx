import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button
              variant="primary"
              size="lg"
              icon={<HomeIcon size={20} />}
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;