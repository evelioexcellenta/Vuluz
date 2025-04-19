import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>();
  
  const password = watch('password', '');
  
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];
    
    return {
      strength,
      label: strengthLabels[strength],
      color: strengthColors[strength]
    };
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          icon={<User size={18} />}
          error={errors.firstName?.message}
          {...register('firstName', {
            required: 'First name is required',
          })}
        />
        
        <Input
          label="Last Name"
          icon={<User size={18} />}
          error={errors.lastName?.message}
          {...register('lastName', {
            required: 'Last name is required',
          })}
        />
      </div>
      
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
      
      <div>
        <Input
          label="Password"
          type="password"
          icon={<Lock size={18} />}
          showPasswordToggle
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            validate: (value) => 
              getPasswordStrength(value).strength >= 3 || 
              'Password must include uppercase, lowercase, number and special character',
          })}
        />
        
        {password && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Password strength:</span>
              <span className={`text-xs ${passwordStrength.strength >= 3 ? 'text-green-500' : 'text-red-500'}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${passwordStrength.color}`} 
                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <Input
        label="Confirm Password"
        type="password"
        icon={<Lock size={18} />}
        showPasswordToggle
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) => value === password || 'Passwords do not match',
        })}
      />
      
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
          Create Account
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;