function Dashboard() {
  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>

      {user && (
        <>
          <h4>Welcome, {user.name}</h4>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </>
      )}
    </div>
  );
}

export default Dashboard;