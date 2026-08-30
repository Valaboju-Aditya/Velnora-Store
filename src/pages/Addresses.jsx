import {  useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";

function Addresses() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [addresses, setAddresses] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("novaAddresses")
    ) || [];
  } catch {
    return [];
  }
});
  function saveAddresses(updatedAddresses) {
    setAddresses(updatedAddresses);

    localStorage.setItem(
      "novaAddresses",
      JSON.stringify(updatedAddresses)
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    });

    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.addressLine.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      alert("Please fill all address fields.");
      return;
    }

    if (editingId) {
      const updatedAddresses = addresses.map((address) =>
        address.id === editingId
          ? {
              ...address,
              ...formData,
            }
          : address
      );

      saveAddresses(updatedAddresses);
      resetForm();
      return;
    }

    const newAddress = {
      id: Date.now(),
      ...formData,
      isDefault: addresses.length === 0,
    };

    saveAddresses([...addresses, newAddress]);
    resetForm();
  }

  function handleEdit(address) {
    setEditingId(address.id);

    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id) {
    const addressToDelete = addresses.find(
      (address) => address.id === id
    );

    let updatedAddresses = addresses.filter(
      (address) => address.id !== id
    );

    if (
      addressToDelete?.isDefault &&
      updatedAddresses.length > 0
    ) {
      updatedAddresses = updatedAddresses.map(
        (address, index) => ({
          ...address,
          isDefault: index === 0,
        })
      );
    }

    saveAddresses(updatedAddresses);
  }

  function makeDefault(id) {
    const updatedAddresses = addresses.map(
      (address) => ({
        ...address,
        isDefault: address.id === id,
      })
    );

    saveAddresses(updatedAddresses);
  }

  return (
    <main className="addresses-page">
      <div className="addresses-container">
        <div className="addresses-header">
          <div>
            <p>MY ACCOUNT</p>
            <h1>Saved Addresses</h1>
            <span>
              Manage your delivery addresses
            </span>
          </div>

          {!showForm && (
            <button
              type="button"
              className="address-add-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} />
              Add Address
            </button>
          )}
        </div>

        {showForm && (
          <section className="address-form-card">
            <div className="address-form-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p>
                  Enter your delivery information
                </p>
              </div>

              <button
                type="button"
                className="address-close-button"
                onClick={resetForm}
                aria-label="Close address form"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="address-form"
              onSubmit={handleSubmit}
            >
              <div className="address-form-grid">
                <div className="address-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="address-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="address-field address-field-full">
                  <label>Address</label>

                  <textarea
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    rows="3"
                  />
                </div>

                <div className="address-field">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>

                <div className="address-field">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>

                <div className="address-field">
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <div className="address-form-actions">
                <button
                  type="submit"
                  className="address-save-button"
                >
                  {editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>

                <button
                  type="button"
                  className="address-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="addresses-empty">
            <MapPin size={46} />

            <h2>No saved addresses</h2>

            <p>
              Add your delivery address to make
              checkout faster.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((address) => (
              <article
                className={`address-card ${
                  address.isDefault
                    ? "default"
                    : ""
                }`}
                key={address.id}
              >
                <div className="address-card-top">
                  <div className="address-icon">
                    <MapPin size={19} />
                  </div>

                  {address.isDefault && (
                    <span className="default-address-badge">
                      <CheckCircle2 size={13} />
                      Default
                    </span>
                  )}
                </div>

                <div className="address-card-content">
                  <h3>{address.fullName}</h3>

                  <p>{address.phone}</p>

                  <p>
                    {address.addressLine}
                  </p>

                  <p>
                    {address.city}, {address.state}{" "}
                    - {address.pincode}
                  </p>
                </div>

                <div className="address-card-actions">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(address)
                    }
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="address-delete-button"
                    onClick={() =>
                      handleDelete(address.id)
                    }
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                {!address.isDefault && (
                  <button
                    type="button"
                    className="make-default-button"
                    onClick={() =>
                      makeDefault(address.id)
                    }
                  >
                    Set as Default
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Addresses;