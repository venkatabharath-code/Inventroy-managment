import './UserProfile.css';
const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="user-avatar">
        <span>SJ</span>
      </div>
      <div className="user-info">
        <h6 className="user-name">Sarah Johnson</h6>
        <span className="user-role">Inventory Manager</span>
      </div>
    </div>
  );
};
export default UserProfile;
