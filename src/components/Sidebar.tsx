import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, User, Users, Settings, LogOut, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem = ({ to, icon: Icon, label }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-nmca-blue/10 hover:text-nmca-blue",
            isActive
              ? "bg-nmca-blue/10 text-nmca-blue"
              : "text-muted-foreground"
          )
        }
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();
  
  const studentLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/courses", icon: BookOpen, label: "My Courses" },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  
  const staffLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/courses", icon: BookOpen, label: "My Courses" },
    { to: "/staff/students", icon: Users, label: "Students" },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  
  const adminLinks = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/courses", icon: BookOpen, label: "Courses" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/staff", icon: Users, label: "Staff" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];
  
  let links = studentLinks; // Default to student links
  
  if (user?.role === 'staff') {
    links = staffLinks;
  } else if (user?.role === 'admin') {
    links = adminLinks;
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {user?.role === 'admin' ? 'Admin Portal' : 'Learning Portal'}
          </h3>
          <nav className="space-y-1">
            <ul className="space-y-1">
              {links.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="mt-auto px-3 py-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
