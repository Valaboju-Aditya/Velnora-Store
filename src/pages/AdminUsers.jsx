import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("novaToken");

        const response = await fetch(
          `${API_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        if (!ignore) {
          setUsers(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to fetch users:",
            error
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("novaToken");

      const response = await fetch(
       `${API_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user._id !== id
        )
      );

      alert("User deleted successfully");
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );

      alert("Failed to delete user");
    }
  };

  return (
    <div className="admin-users-page">

      <div className="admin-users-header">

        <div>
          <p>velnora ADMIN</p>

          <h1>Manage Users</h1>

          <span>
            View and manage registered customers
          </span>
        </div>

        <div className="admin-users-count">
          <strong>
            {users.length}
          </strong>

          <span>
            Total Users
          </span>
        </div>

      </div>

      <div className="admin-users-container">

        {loading ? (

          <div className="admin-users-message">
            Loading users...
          </div>

        ) : users.length === 0 ? (

          <div className="admin-users-message">
            No users registered yet.
          </div>

        ) : (

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>

                    <td>

                      <div className="admin-user-name">

                        <div className="admin-user-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {user.name}
                        </span>

                      </div>

                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>

                      <span
                        className={`admin-user-role ${
                          user.role === "admin"
                            ? "admin-role"
                            : "customer-role"
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>

                    <td>

                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}

                    </td>

                    <td>

                      <button
                        type="button"
                        className="admin-user-delete"
                        onClick={() =>
                          handleDelete(
                            user._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminUsers;