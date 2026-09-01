import {
  useEffect,
  useState,
} from "react";

import {
  User,
  Mail,
  Phone,
  Save,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";
import { API_URL } from "../config";


function AccountDetails({
  user,
  onUserUpdate,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let ignore = false;

    async function loadAccount() {
      const token =
        localStorage.getItem(
          "novaToken"
        );

      if (!token) {
        if (!ignore) {
          setError(
            "Please login to view your account details."
          );

          setLoading(false);
        }

        return;
      }

      try {
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/user-data/account`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load account details"
          );
        }

        if (!ignore) {
          setFormData({
            name:
              data.name ||
              user?.name ||
              "",
            email:
              data.email ||
              user?.email ||
              "",
            phone:
              data.phone ||
              user?.phone ||
              "",
          });
        }
      } catch (requestError) {
        console.error(
          "Load account error:",
          requestError
        );

        if (!ignore) {
          setError(
            requestError.message ||
              "Failed to load account details"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      ignore = true;
    };
  }, [
    user?.name,
    user?.email,
    user?.phone,
  ]);


  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setSaved(false);
    setError("");
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem(
        "novaToken"
      );

    if (!token) {
      setError(
        "Please login again."
      );

      return;
    }

    try {
      setSaving(true);

      setSaved(false);

      setError("");

      const response =
        await fetch(
          `${API_URL}/api/user-data/account`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update account details"
        );
      }

      const currentUser =
        JSON.parse(
          localStorage.getItem(
            "novaUser"
          ) || "{}"
        );

      const updatedUser = {
        ...currentUser,

        _id:
          data._id ||
          currentUser._id,

        name:
          data.name || "",

        email:
          data.email || "",

        phone:
          data.phone || "",

        role:
          data.role ||
          currentUser.role,
      };


      setFormData({
        name:
          updatedUser.name,

        email:
          updatedUser.email,

        phone:
          updatedUser.phone,
      });


      localStorage.setItem(
        "novaUser",
        JSON.stringify(
          updatedUser
        )
      );


      if (onUserUpdate) {
        onUserUpdate(
          updatedUser
        );
      }


      setSaved(true);

    } catch (requestError) {
      console.error(
        "Update account error:",
        requestError
      );

      setError(
        requestError.message ||
          "Failed to update account details"
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <main className="account-details-page">

      <div className="account-details-container">

        <Link
          to="/account"
          className="account-details-back"
        >
          <ArrowLeft
            size={17}
          />

          Back to Account
        </Link>


        <div className="account-details-header">

          <p>
            MY ACCOUNT
          </p>

          <h1>
            Account Details
          </h1>

          <span>
            Manage your personal
            information
          </span>

        </div>


        <section className="account-details-card">

          <div className="account-details-profile">

            <div className="account-details-avatar">

              <User
                size={28}
              />

            </div>


            <div>

              <h2>
                {formData.name ||
                  "velnora Customer"}
              </h2>

              <p>
                {formData.email ||
                  "Customer account"}
              </p>

            </div>

          </div>


          {loading ? (

            <div className="account-details-success">
              Loading account details...
            </div>

          ) : (

            <form
              className="account-details-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="account-details-field">

                <label
                  htmlFor="account-name"
                >
                  Full Name
                </label>


                <div className="account-details-input">

                  <User
                    size={17}
                  />


                  <input
                    id="account-name"
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your name"
                    required
                  />

                </div>

              </div>


              <div className="account-details-field">

                <label
                  htmlFor="account-email"
                >
                  Email Address
                </label>


                <div className="account-details-input">

                  <Mail
                    size={17}
                  />


                  <input
                    id="account-email"
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>

              </div>


              <div className="account-details-field">

                <label
                  htmlFor="account-phone"
                >
                  Phone Number
                </label>


                <div className="account-details-input">

                  <Phone
                    size={17}
                  />


                  <input
                    id="account-phone"
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>


              {error && (
                <div className="account-details-success">
                  {error}
                </div>
              )}


              {saved && (
                <div className="account-details-success">
                  Account details saved successfully.
                </div>
              )}


              <button
                type="submit"
                className="account-details-save"
                disabled={
                  saving
                }
              >

                <Save
                  size={17}
                />


                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </form>

          )}

        </section>

      </div>

    </main>
  );
}

export default AccountDetails;
