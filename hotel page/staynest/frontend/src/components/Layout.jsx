import { NavLink, Outlet, Link } from 'react-router-dom';

const links = [
  ['/', '🏠', 'Hotels', true],
  ['/my-bookings', '📅', 'Bookings'],
  ['/add-hotel', '➕', 'Add Hotel'],
  ['/profile', '👤', 'Profile'],
  ['/about', 'ℹ️', 'About'],
];

export default function Layout() {
  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="logo">🏨</span>
          <div>
            <h1>Stay<span>Nest</span></h1>
            <small>Find. Stay. Relax.</small>
          </div>
        </Link>
        <div className="user"><span className="avatar">N</span>Naveen</div>
      </header>
      <div className="body">
        <nav className="side">
          {links.map(([to, icon, label, end]) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => 'nav' + (isActive ? ' active' : '')}>
              <span>{icon}</span>{label}
            </NavLink>
          ))}
          <div className="side-foot"><b>StayNest</b><small>Find. Stay. Relax.</small></div>
        </nav>
        <main className="main"><Outlet /></main>
      </div>
    </div>
  );
}
