import Sidebar from "./Sidebar.jsx";

const AdminLayout = ({ title, sub, actions, children }) => (
  <div className="admin-shell">
    <Sidebar />
    <div className="admin-main">
      <header className="admin-topbar">
        <div className="min-w-0">
          <div className="at-title">{title}</div>
          {sub ? <div className="at-sub">{sub}</div> : null}
        </div>
        {actions ? <div className="at-actions">{actions}</div> : null}
      </header>
      <div className="admin-content">{children}</div>
    </div>
  </div>
);

export default AdminLayout;
