import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY_USERS = 'mira_users';
const STORAGE_KEY_CURRENT = 'mira_current_user';

// Pre-seeded demo account so testing is immediate
const SEED_USERS = [
  {
    id: 'usr_demo_sophia',
    email: 'sophia@example.com',
    password: 'password123',
    firstName: 'Sophia',
    lastName: 'Laurent',
    phone: '+1 (555) 382-9102',
    address: {
      street: '142 Mercer Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10012',
      country: 'United States'
    },
    registeredAt: '2026-09-15T10:00:00.000Z'
  }
];

export function AuthProvider({ children }) {
  // All registered users
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  // Current logged-in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users:', e);
    }
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT);
      }
      window.dispatchEvent(new Event('mira_auth_updated'));
    } catch (e) {
      console.warn('Failed to save current user:', e);
    }
  }, [currentUser]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY_CURRENT) {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEY_USERS && e.newValue) {
        try {
          setUsers(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  /**
   * Register a new user with full delivery address
   */
  const register = useCallback((data) => {
    const {
      email,
      password,
      firstName,
      lastName,
      phone = '',
      street,
      apartment = '',
      city,
      state = '',
      postalCode,
      country = 'United States'
    } = data;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      password: password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      address: {
        street: street.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim()
      },
      registeredAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return newUser;
  }, [users]);

  /**
   * Login user by email & password
   */
  const login = useCallback((email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);

    if (!found) {
      throw new Error('Invalid email or password. Please try again or use demo account.');
    }

    setCurrentUser(found);
    return found;
  }, [users]);

  /**
   * Fast Demo Login as Sophia
   */
  const loginDemo = useCallback(() => {
    const demoUser = users.find(u => u.email === 'sophia@example.com') || SEED_USERS[0];
    setCurrentUser(demoUser);
    return demoUser;
  }, [users]);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  /**
   * Update saved address for current user
   */
  const updateAddress = useCallback((updatedAddressData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      phone: updatedAddressData.phone !== undefined ? updatedAddressData.phone : currentUser.phone,
      address: {
        ...currentUser.address,
        street: updatedAddressData.street ?? currentUser.address.street,
        apartment: updatedAddressData.apartment ?? currentUser.address.apartment,
        city: updatedAddressData.city ?? currentUser.address.city,
        state: updatedAddressData.state ?? currentUser.address.state,
        postalCode: updatedAddressData.postalCode ?? currentUser.address.postalCode,
        country: updatedAddressData.country ?? currentUser.address.country
      }
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    return updatedUser;
  }, [currentUser]);

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    register,
    login,
    loginDemo,
    logout,
    updateAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
