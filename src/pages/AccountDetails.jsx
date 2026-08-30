import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

function AccountDetails({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const currentUser =
      JSON.parse(localStorage.getItem("novaUser")) || {};

    const updatedUser = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    localStorage.setItem(
      "novaUser",
      JSON.stringify(updatedUser)
    );

    setSaved(true);
  }

  return (
    <main className="account-details-page">
      <div className="account-details-container">
        <Link
          to="/account"
          className="account-details-back"
        >
          <ArrowLeft size={17} />
          Back to Account
        </Link>

        <div className="account-details-header">
          <p>MY ACCOUNT</p>

          <h1>Account Details</h1>

          <span>
            Manage your personal information
          </span>
        </div>

        <section className="account-details-card">
          <div className="account-details-profile">
            <div className="account-details-avatar">
              <User size={28} />
            </div>

            <div>
              <h2>
                {formData.name || "NOVA Customer"}
              </h2>

              <p>
                {formData.email || "Customer account"}
              </p>
            </div>
          </div>

          <form
            className="account-details-form"
            onSubmit={handleSubmit}
          >
            <div className="account-details-field">
              <label htmlFor="account-name">
                Full Name
              </label>

              <div className="account-details-input">
                <User size={17} />

                <input
                  id="account-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="account-details-field">
              <label htmlFor="account-email">
                Email Address
              </label>

              <div className="account-details-input">
                <Mail size={17} />

                <input
                  id="account-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="account-details-field">
              <label htmlFor="account-phone">
                Phone Number
              </label>

              <div className="account-details-input">
                <Phone size={17} />

                <input
                  id="account-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {saved && (
              <div className="account-details-success">
                Account details saved successfully.
              </div>
            )}

            <button
              type="submit"
              className="account-details-save"
            >
              <Save size={17} />
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default AccountDetails;