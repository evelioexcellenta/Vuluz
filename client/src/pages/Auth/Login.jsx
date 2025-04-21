import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Alert from '../../components/UI/Alert';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';
import { APP_CONFIG } from '../../constants/config';

const Login = () => {
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Form validation with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError('');
      const success = await login(data);
      
      if (success) {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };
  
  // Demo login credentials
  const demoLogin = async () => {
    try {
      setError('');
      const success = await login({
        email: 'demo@example.com',
        password: 'demo1234'
      });
      
      if (success) {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err.message || 'Demo login failed. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{APP_CONFIG.APP_NAME}</h1>
          <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to={ROUTES.REGISTER} className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <Card className="animate-fade-in">
          <Card.Body>
            {error && (
              <Alert
                type="error"
                title="Login Failed"
                message={error}
                onClose={() => setError('')}
                className="mb-4"
              />
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  validate: {
                    validEmail: (value) => isValidEmail(value) || 'Please enter a valid email'
                  }
                })}
                error={errors.email?.message}
                autoComplete="email"
                placeholder="your@email.com"
                required
              />
              
              <div>
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  error={errors.password?.message}
                  autoComplete="current-password"
                  required
                />
                <div className="text-right">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={demoLogin}
                  isLoading={isLoading}
                >
                  Demo Account
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;