export default function About() {
  return (
    <div className="card narrow wide">
      <h2 className="title">About StayNest</h2>
      <p>StayNest is a hotel listing and booking demo. Admins can add, edit and delete hotels, and guests can search, filter and book a stay.</p>
      <ul>
        <li>Frontend: React, Redux Toolkit, React Router</li>
        <li>Backend: Node.js, Express, PostgreSQL (native SQL)</li>
        <li>Images are stored locally in the backend <code>uploads</code> folder</li>
      </ul>
    </div>
  );
}
