import React, { useState } from 'react';
import { X, User, Store, ShieldCheck, Lock, Mail, Key, Phone, Building, Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { api } from '../services/api';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeRole, setActiveRole] = useState('BUYER'); // 'BUYER' | 'SELLER' | 'ADMIN'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    gst: '',
    pan: '',
    city: 'Mumbai',
    commissionRate: 10
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (authMode === 'login') {
        const res = await api.login({
          email: formData.email,
          password: formData.password,
          role: activeRole
        });

        if (res.success) {
          onAuthSuccess(res.data);
          onClose();
        } else {
          setErrorMessage(res.message || 'Login failed. Please check credentials.');
        }
      } else {
        // Sign Up
        const res = await api.signup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: activeRole,
          businessName: formData.businessName,
          gst: formData.gst,
          pan: formData.pan,
          city: formData.city,
          commissionRate: formData.commissionRate
        });

        if (res.success) {
          onAuthSuccess(res.data);
          onClose();
        } else {
          setErrorMessage(res.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role) => {
    let demoUser = {
      id: role === 'ADMIN' ? 'admin-1' : role === 'SELLER' ? 'seller-1' : 'buyer-1',
      name: role === 'ADMIN' ? 'Ratnaya Super Admin' : role === 'SELLER' ? 'Heritage Gold Kolkata' : 'Priya Malhotra',
      email: role === 'ADMIN' ? 'admin@ratnaya.com' : role === 'SELLER' ? 'heritage@ratnaya.com' : 'priya.m@gmail.com',
      role,
      commissionRate: role === 'SELLER' ? 10 : 0
    };
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-md max-w-md w-full border border-gold/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-charcoal transition-colors border-none bg-transparent cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <Logo size="small" />
          <h2 className="font-heading text-xl sm:text-2xl mt-3 text-charcoal">
            {authMode === 'login' ? 'Welcome Back to Ratnaya' : 'Join the Ratnaya Circle'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access certified luxury jewellery, track orders, or manage merchant listings
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-[#FAF6F0] p-1.5 rounded-sm mb-6 border border-gray-200">
          {[
            { id: 'BUYER', label: 'Patron', icon: <User size={14} /> },
            { id: 'SELLER', label: 'Seller', icon: <Store size={14} /> },
            { id: 'ADMIN', label: 'Admin', icon: <ShieldCheck size={14} /> }
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`py-2 px-2 text-xs font-semibold rounded-sm flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer ${
                activeRole === role.id
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-gray-600 hover:text-charcoal bg-transparent'
              }`}
            >
              {role.icon} {role.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-sm mb-4 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          {authMode === 'signup' && (
            <div>
              <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Malhotra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
          )}

          {activeRole === 'SELLER' && authMode === 'signup' && (
            <div>
              <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Jewellery Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Kundan Jewellers"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-semibold text-gray-500 mb-1 block">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-gold py-3 text-xs font-semibold mt-2">
            {isLoading ? 'PROCESSING...' : authMode === 'login' ? `SIGN IN AS ${activeRole}` : `CREATE ${activeRole} ACCOUNT`}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <span className="text-[0.7rem] uppercase tracking-wider text-gray-400 block mb-2">
            Quick One-Click Demo Access
          </span>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleQuickDemoLogin('BUYER')}
              className="text-xs bg-[#FAF6F0] hover:bg-gold hover:text-white px-3 py-1.5 rounded-sm border border-gold/30 transition-colors"
            >
              Demo Buyer
            </button>
            <button
              onClick={() => handleQuickDemoLogin('SELLER')}
              className="text-xs bg-[#FAF6F0] hover:bg-gold hover:text-white px-3 py-1.5 rounded-sm border border-gold/30 transition-colors"
            >
              Demo Seller
            </button>
            <button
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="text-xs bg-[#FAF6F0] hover:bg-gold hover:text-white px-3 py-1.5 rounded-sm border border-gold/30 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-xs text-gold-dark hover:underline bg-transparent border-none cursor-pointer"
          >
            {authMode === 'login' ? "Don't have an account? Register here" : "Already registered? Sign In here"}
          </button>
        </div>
      </div>
    </div>
  );
}
