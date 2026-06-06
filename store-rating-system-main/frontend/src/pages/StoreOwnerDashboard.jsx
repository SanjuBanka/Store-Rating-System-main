import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function StoreOwnerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    storeName: "",
    averageRating: 0,
    totalRatings: 0,
    ratings: [],
  });

  const fetchDashboard = async () => {
    try {
      const storeId =
        localStorage.getItem("storeId");

      const res = await API.get(
        `/stores/dashboard/${storeId}`
      );

      setDashboard(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="container-fluid p-4"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <div className="d-flex justify-content-between mb-4">
        <h2>Store Owner Dashboard</h2>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Store Info */}

      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5>Store Name</h5>

              <h4>
                {dashboard.storeName}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5>Average Rating</h5>

              <h2>
                {dashboard.averageRating || 0}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5>Total Ratings</h5>

              <h2>
                {dashboard.totalRatings}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Ratings Table */}

      <div className="card shadow-sm">

        <div className="card-header">
          <h4>Users Who Rated This Store</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>

              {dashboard.ratings.map(
                (item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td>
                      {item.User?.name}
                    </td>

                    <td>
                      {item.rating}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default StoreOwnerDashboard;