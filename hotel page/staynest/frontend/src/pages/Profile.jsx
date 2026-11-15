import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const nav = useNavigate();
  const rows = [
    ['Full Name', 'Naveen B'],
    ['Email Address', 'admin@staynest.com'],
    ['Phone Number', 'Not added'],
    ['Account Type', 'Hotel Administrator'],
    ['Member Since', 'November 2026'],
  ];
  return (
    <div>
      <div className="banner"><h2>My Profile</h2><p>Manage your account information</p></div>
      <div className="profile">
        <div className="card center">
          <div className="avatar big-avatar">N</div>
          <h3>Naveen B</h3>
          <p className="muted">Hotel Administrator</p>
          <span className="badge confirmed">Administrator</span>
        </div>
        <div className="card">
          <h3>Personal Information</h3>
          {rows.map(([k, v]) => <div className="line" key={k}><span className="muted">{k}</span><b>{v}</b></div>)}
          <button className="btn accent mt" onClick={() => nav('/my-bookings')}>View My Bookings</button>
        </div>
      </div>
    </div>
  );
}
