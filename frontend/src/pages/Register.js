// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const passwordRules = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'Uppercase letter', test: v => /[A-Z]/.test(v) },
  { label: 'Lowercase letter', test: v => /[a-z]/.test(v) },
  { label: 'Number', test: v => /\d/.test(v) },
];

export default function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [watchPassword, setWatchPassword] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await authRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      toast.success(`Welcome, ${user.firstName}! Application started.`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      const details = err.response?.data?.details;
      if (details?.length) {
        details.forEach(d => toast.error(d.message));
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-brand-600 to-brand-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xl mx-auto mb-6">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">Begin Your Journey</h2>
          <p className="text-brand-100 leading-relaxed max-w-xs">
            Join hundreds of Zimbabwean students studying in India with our scholarship support.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              'Free application process',
              'Dedicated personal advisor',
              'Up to 50% tuition discount',
              'Visa assistance included',
              '20+ partner universities',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-white">
                <CheckCircle className="w-4 h-4 text-brand-200 flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Start your free student application today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" className={`input-field pl-10 ${errors.firstName ? 'border-red-400' : ''}`}
                    placeholder="Takudzwa"
                    {...register('firstName', { required: 'Required', maxLength: { value: 50, message: 'Too long' } })} />
                </div>
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label">Last Name</label>
                <input type="text" className={`input-field ${errors.lastName ? 'border-red-400' : ''}`}
                  placeholder="Moyo"
                  {...register('lastName', { required: 'Required', maxLength: { value: 50, message: 'Too long' } })} />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" className="input-field pl-10"
                  placeholder="+263 77 123 4567"
                  {...register('phone')} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min 8 chars with A-Z, a-z, 0-9"
                  {...register('password', {
                    required: 'Password required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must include upper, lower, number' },
                    onChange: e => setWatchPassword(e.target.value),
                  })} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicators */}
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordRules.map(({ label, test }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-xs ${test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <CheckCircle className={`w-3 h-3 ${test(password) ? 'opacity-100' : 'opacity-30'}`} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 accent-brand-500"
                {...register('terms', { required: 'You must accept terms' })} />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the <Link to="/about" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</Link> and <Link to="/about" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-500 -mt-3">{errors.terms.message}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
