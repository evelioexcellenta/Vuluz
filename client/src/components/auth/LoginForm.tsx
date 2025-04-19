import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data, rememberMe);
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message });
      } else {
        setError('root', { message: 'An unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        icon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />
      
      <Input
        label="Password"
        type="password"
        icon={<Lock size={18} />}
        showPasswordToggle
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <div className="text-sm">
          <Link to="#" className="font-medium text-primary-600 hover:text-primary-500">
            Forgot your password?
          </Link>
        </div>
      </div>
      
      {errors.root && (
        <div className="text-error-500 text-sm py-2 px-3 bg-red-50 rounded-md">
          {errors.root.message}
        </div>
      )}
      
      <div>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          fullWidth
          className="py-2.5"
        >
          Sign in
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Link to="/register" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;