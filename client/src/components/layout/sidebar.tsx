import { Link, useLocation } from "wouter";
import { Home, Calendar } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Cronograma", href: "/schedule", icon: Calendar },
];

export default function Sidebar() {
  const [location] = useLocation();


  return (
    <div className="w-64 bg-card shadow-lg overflow-y-auto border-r border-border" data-testid="sidebar">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary mb-4" data-testid="sidebar-title">
          Menu Principal
        </h2>
        <nav className="space-y-2" data-testid="sidebar-navigation">
          {navigation.map((item) => {
            const isActive = location === item.href || 
                           (item.href === "/" && location === "/") ||
                           (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={`sidebar-item ${isActive ? 'active' : ''}`} data-testid={`nav-link-${item.name.toLowerCase()}`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
