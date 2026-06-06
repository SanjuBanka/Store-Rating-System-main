import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [userRoleFilter, setUserRoleFilter] =
  useState("");

const [userSortBy, setUserSortBy] =
  useState("");

const [storeSortBy, setStoreSortBy] =
  useState("");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] =
  useState(null);

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] =
  useState(null);

  const [searchName, setSearchName] = useState("");
  const [searchStore, setSearchStore] = useState("");

  const [searchEmail, setSearchEmail] = useState("");
const [searchAddress, setSearchAddress] = useState("");

const [searchStoreEmail, setSearchStoreEmail] =
  useState("");

const [searchStoreAddress, setSearchStoreAddress] =
  useState("");



  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  // ======================
  // DASHBOARD STATS
  // ======================

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ======================
  // USERS
  // ======================

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
  `/admin/users?name=${searchName}&email=${searchEmail}&address=${searchAddress}&role=${userRoleFilter}&sort=${userSortBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDetails = async (id) => {
  try {
    const token =
      localStorage.getItem("token");

    const res = await API.get(
      `/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedUser(res.data);

  } catch (error) {
    console.log(error);
  }
};

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post("/admin/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User Created Successfully");

      setShowUserForm(false);

      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });

      fetchUsers();
      fetchDashboardStats();

    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ======================
  // STORES
  // ======================

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
  `/admin/stores?name=${searchStore}&email=${searchStoreEmail}&address=${searchStoreAddress}&sort=${storeSortBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStores(res.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStoreDetails = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get(
      `/stores/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSelectedStore(res.data);

  } catch (error) {
    console.log(error);
  }
};

  const handleAddStore = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post("/admin/stores", newStore, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Store Created Successfully");

      setShowStoreForm(false);

      setNewStore({
        name: "",
        email: "",
        address: "",
      });

      fetchStores();
      fetchDashboardStats();

    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ======================
  // LOAD DATA
  // ======================

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchStores();
  }, []);

  // ======================
  // LOGOUT
  // ======================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
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
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Stats */}

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5>Total Stores</h5>
              <h2>{stats.totalStores}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5>Total Ratings</h5>
              <h2>{stats.totalRatings}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}

      <div className="mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setShowUserForm(true)}
        >
          Add User
        </button>

        <button
          className="btn btn-success"
          onClick={() => setShowStoreForm(true)}
        >
          Add Store
        </button>
      </div>

      {/* Add User Form */}

      {showUserForm && (
        <div className="card p-4 mb-4 shadow">
          <h4>Add User</h4>

          <input
            className="form-control mb-2"
            placeholder="Name"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                name: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Email"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                password: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Address"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                address: e.target.value,
              })
            }
          />

          <select
            className="form-select mb-3"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value,
              })
            }
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STORE_OWNER">
              STORE_OWNER
            </option>
          </select>

          <div>
            <button
              className="btn btn-success me-2"
              onClick={handleAddUser}
            >
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setShowUserForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Store Form */}

      {showStoreForm && (
        <div className="card p-4 mb-4 shadow">
          <h4>Add Store</h4>

          <input
            className="form-control mb-2"
            placeholder="Store Name"
            onChange={(e) =>
              setNewStore({
                ...newStore,
                name: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Store Email"
            onChange={(e) =>
              setNewStore({
                ...newStore,
                email: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-3"
            placeholder="Address"
            onChange={(e) =>
              setNewStore({
                ...newStore,
                address: e.target.value,
              })
            }
          />

          <div>
            <button
              className="btn btn-success me-2"
              onClick={handleAddStore}
            >
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setShowStoreForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users List */}

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5>Users List</h5>
        </div>

        <div className="card-body">

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search User By Name"

            value={searchName}
            onChange={(e) =>
              setSearchName(e.target.value)
            }
          />

          <input
  type="text"
  className="form-control mb-3"
  placeholder="Search User By Email"
  value={searchEmail}
  onChange={(e) =>
    setSearchEmail(e.target.value)
  }
/>

<input
  type="text"
  className="form-control mb-3"
  placeholder="Search User By Address"
  value={searchAddress}
  onChange={(e) =>
    setSearchAddress(e.target.value)
  }
/>

<select
  className="form-select mb-3"
  value={userRoleFilter}
  onChange={(e) =>
    setUserRoleFilter(e.target.value)
  }
>
  <option value="">All Roles</option>
  <option value="USER">USER</option>
  <option value="ADMIN">ADMIN</option>
  <option value="STORE_OWNER">
    STORE_OWNER
  </option>
</select>

<select
  className="form-select mb-3"
  value={userSortBy}
  onChange={(e) =>
    setUserSortBy(e.target.value)
  }
>
  <option value="">
    Sort Users
  </option>

  <option value="name">
    Name
  </option>

  <option value="email">
    Email
  </option>
</select>

          <button
            className="btn btn-primary mb-3"
            onClick={fetchUsers}
          >
            Search User
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Action</th>

              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>

<td>
  <button
    className="btn btn-info btn-sm"
    onClick={() =>
      fetchUserDetails(user.id)
    }
  >
    View
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      {selectedUser && (

  <div className="card shadow-sm mb-4">

    <div className="card-header">
      <h5>User Details</h5>
    </div>

    <div className="card-body">

      <p>
        <strong>ID:</strong>
        {" "}
        {selectedUser.id}
      </p>

      <p>
        <strong>Name:</strong>
        {" "}
        {selectedUser.name}
      </p>

      <p>
        <strong>Email:</strong>
        {" "}
        {selectedUser.email}
      </p>

      <p>
        <strong>Address:</strong>
        {" "}
        {selectedUser.address}
      </p>

      <p>
        <strong>Role:</strong>
        {" "}
        {selectedUser.role}
      </p>

      {selectedUser.store && (

        <div className="alert alert-info">

          <h6>Store Owner Info</h6>

          <p>
            Store Name:
            {" "}
            {selectedUser.store.name}
          </p>

          <p>
            Average Rating:
            {" "}
            {selectedUser.store.averageRating}
          </p>

        </div>

      )}

    </div>

  </div>

)}

      {/* Stores List */}

      <div className="card shadow-sm">
        <div className="card-header">
          <h5>Stores List</h5>
        </div>

        <div className="card-body">

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search Store By Name"
            value={searchStore}
            onChange={(e) =>
              setSearchStore(e.target.value)
            }
          />

          <input
  type="text"
  className="form-control mb-3"
  placeholder="Search Store By Email"
  value={searchStoreEmail}
  onChange={(e) =>
    setSearchStoreEmail(
      e.target.value
    )
  }
/>

<input
  type="text"
  className="form-control mb-3"
  placeholder="Search Store By Address"
  value={searchStoreAddress}
  onChange={(e) =>
    setSearchStoreAddress(
      e.target.value
    )
  }
/>

<select
  className="form-select mb-3"
  value={storeSortBy}
  onChange={(e) =>
    setStoreSortBy(e.target.value)
  }
>
  <option value="">
    Sort Stores
  </option>

  <option value="name">
    Name
  </option>

  <option value="email">
    Email
  </option>
</select>

          <button
            className="btn btn-success mb-3"
            onClick={fetchStores}
          >
            Search Store
          </button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Average Rating</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.id}</td>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{store.averageRating || 0}</td>

<td>
  <button
    className="btn btn-info btn-sm"
    onClick={() =>
      fetchStoreDetails(store.id)
    }
  >
    View
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

    {selectedStore && (

  <div className="card shadow-sm mt-4">

    <div className="card-header">
      <h5>Store Details</h5>
    </div>

    <div className="card-body">

      <p>
        <strong>ID:</strong>
        {" "}
        {selectedStore.id}
      </p>

      <p>
        <strong>Name:</strong>
        {" "}
        {selectedStore.name}
      </p>

      <p>
        <strong>Email:</strong>
        {" "}
        {selectedStore.email}
      </p>

      <p>
        <strong>Address:</strong>
        {" "}
        {selectedStore.address}
      </p>

      <p>
        <strong>Average Rating:</strong>
        {" "}
        {selectedStore.averageRating}
      </p>

    </div>

  </div>

)}

    </div>
  );
}

export default AdminDashboard;