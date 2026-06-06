import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function UserDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStore, setSelectedStore] =
    useState(null);

  const [rating, setRating] =
    useState(1);

  const fetchStores = async () => {
    try {
      const userId =
        localStorage.getItem("userId");

      const res = await API.get(
        `/stores/user/${userId}`
      );

      setStores(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleRateStore = (store) => {
    setSelectedStore(store);
  };

  const handleSubmitRating = async () => {
  try {
    const token =
      localStorage.getItem("token");

    if (selectedStore.ratingId) {

      await API.put(
        `/ratings/${selectedStore.ratingId}`,
        {
          rating,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Rating Updated Successfully");

    } else {

      await API.post(
        "/ratings",
        {
          StoreId: selectedStore.id,
          rating,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Rating Submitted Successfully");
    }

    setSelectedStore(null);
    fetchStores();

  } catch (error) {
    alert(
      error.response?.data?.message
    );
  }
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
        <h2>User Dashboard</h2>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Rating Form */}

      {selectedStore && (
        <div className="card shadow-sm mb-4 p-4">

          <h4>Rate Store</h4>

          <p>
            <strong>
              {selectedStore.storeName}
            </strong>
          </p>

          <select
            className="form-select mb-3"
            value={rating}
            onChange={(e) =>
              setRating(e.target.value)
            }
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <div>
            <button
              className="btn btn-success me-2"
              onClick={handleSubmitRating}
            >
              Submit Rating
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setSelectedStore(null)
              }
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* Stores List */}

      <div className="card shadow-sm">

        <div className="card-header">
          <h4>Stores List</h4>
        </div>

        <div className="card-body">

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search Store"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Store Name</th>
                <th>Overall Rating</th>
                <th>My Rating</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {stores
                .filter((store) =>
                  store.storeName
                    .toLowerCase()
                    .includes(
                      search.toLowerCase()
                    )
                )
                .map((store, index) => (
                  <tr key={index}>

                    <td>
                      {store.storeName}
                    </td>

                    <td>
                      {store.overallRating || 0}
                    </td>

                    <td>
                      {store.myRating ||
                        "Not Rated"}
                    </td>

                    <td>
                      <button
  className={
    store.myRating
      ? "btn btn-warning btn-sm"
      : "btn btn-primary btn-sm"
  }
  onClick={() => handleRateStore(store)}
>
  {store.myRating
    ? "Update Rating"
    : "Rate"}
</button>
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;