import {
  useEffect,
  useState,
} from "react";

import { API_URL } from "../config";

import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";


function Addresses() {

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const [
    formData,
    setFormData,
  ] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });


  /* =========================================================
     LOAD ADDRESSES FROM MONGODB
  ========================================================= */

  useEffect(() => {

    let ignore = false;


    async function loadAddresses() {

      const token =
        localStorage.getItem(
          "novaToken"
        );


      if (!token) {

        if (!ignore) {

          setError(
            "Please login to view your saved addresses."
          );

          setLoading(false);

        }

        return;

      }


      try {

        setError("");


        const response =
          await fetch(
            `${API_URL}/api/user-data/addresses`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response
            .json()
            .catch(() => []);


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load addresses"
          );

        }


        if (!ignore) {

          setAddresses(
            Array.isArray(data)
              ? data
              : []
          );

        }

      } catch (requestError) {

        console.error(
          "Load addresses error:",
          requestError
        );


        if (!ignore) {

          setError(
            requestError.message ||
            "Failed to load addresses"
          );

        }

      } finally {

        if (!ignore) {

          setLoading(false);

        }

      }

    }


    loadAddresses();


    return () => {

      ignore = true;

    };

  }, []);


  /* =========================================================
     INPUT CHANGE
  ========================================================= */

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

  }


  /* =========================================================
     RESET FORM
  ========================================================= */

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

    setError("");

  }


  /* =========================================================
     ADD / UPDATE ADDRESS
  ========================================================= */

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.addressLine.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {

      alert(
        "Please fill all address fields."
      );

      return;

    }


    const token =
      localStorage.getItem(
        "novaToken"
      );


    if (!token) {

      alert(
        "Please login again."
      );

      return;

    }


    try {

      setSaving(true);

      setError("");


      const url =
        editingId
          ? `${API_URL}/api/user-data/addresses/${editingId}`
          : `${API_URL}/api/user-data/addresses`;


      const response =
        await fetch(
          url,
          {
            method:
              editingId
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                formData
              ),
          }
        );


      const data =
        await response
          .json()
          .catch(() => []);


      if (!response.ok) {

        throw new Error(
          data.message ||
          (
            editingId
              ? "Failed to update address"
              : "Failed to save address"
          )
        );

      }


      setAddresses(
        Array.isArray(data)
          ? data
          : []
      );


      resetForm();

    } catch (requestError) {

      console.error(
        "Save address error:",
        requestError
      );


      setError(
        requestError.message ||
        "Failed to save address"
      );

    } finally {

      setSaving(false);

    }

  }


  /* =========================================================
     EDIT ADDRESS
  ========================================================= */

  function handleEdit(
    address
  ) {

    setEditingId(
      address._id
    );


    setFormData({
      fullName:
        address.fullName || "",

      phone:
        address.phone || "",

      addressLine:
        address.addressLine || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || "",
    });


    setShowForm(true);

    setError("");


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  /* =========================================================
     DELETE ADDRESS
  ========================================================= */

  async function handleDelete(
    addressId
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );


    if (!confirmed) {
      return;
    }


    const token =
      localStorage.getItem(
        "novaToken"
      );


    if (!token) {

      alert(
        "Please login again."
      );

      return;

    }


    try {

      setError("");


      const response =
        await fetch(
          `${API_URL}/api/user-data/addresses/${addressId}`,
          {
            method:
              "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response
          .json()
          .catch(() => []);


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete address"
        );

      }


      setAddresses(
        Array.isArray(data)
          ? data
          : []
      );


      if (
        editingId ===
        addressId
      ) {

        resetForm();

      }

    } catch (requestError) {

      console.error(
        "Delete address error:",
        requestError
      );


      setError(
        requestError.message ||
        "Failed to delete address"
      );

    }

  }


  /* =========================================================
     SET DEFAULT ADDRESS
  ========================================================= */

  async function makeDefault(
    addressId
  ) {

    const token =
      localStorage.getItem(
        "novaToken"
      );


    if (!token) {

      alert(
        "Please login again."
      );

      return;

    }


    try {

      setError("");


      const response =
        await fetch(
          `${API_URL}/api/user-data/addresses/${addressId}/default`,
          {
            method:
              "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response
          .json()
          .catch(() => []);


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to set default address"
        );

      }


      setAddresses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (requestError) {

      console.error(
        "Default address error:",
        requestError
      );


      setError(
        requestError.message ||
        "Failed to set default address"
      );

    }

  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <main className="addresses-page">

      <div className="addresses-container">


        {/* HEADER */}

        <div className="addresses-header">

          <div>

            <p>
              MY ACCOUNT
            </p>

            <h1>
              Saved Addresses
            </h1>

            <span>
              Manage your delivery addresses
            </span>

          </div>


          {!showForm && (
            <button
              type="button"
              className="address-add-button"
              onClick={() =>
                setShowForm(true)
              }
            >

              <Plus size={17} />

              Add Address

            </button>
          )}

        </div>


        {/* ERROR */}

        {error && (
          <div
            className="account-details-success"
            style={{
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading && (

          <div className="addresses-empty">

            <MapPin size={40} />

            <h2>
              Loading addresses...
            </h2>

            <p>
              Please wait while we load
              your saved addresses.
            </p>

          </div>

        )}


        {/* ADDRESS FORM */}

        {!loading && showForm && (

          <section className="address-form-card">

            <div className="address-form-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p>
                  Enter your delivery
                  information
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
              onSubmit={
                handleSubmit
              }
            >

              <div className="address-form-grid">


                {/* FULL NAME */}

                <div className="address-field">

                  <label
                    htmlFor="address-full-name"
                  >
                    Full Name
                  </label>

                  <input
                    id="address-full-name"
                    type="text"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="address-field">

                  <label
                    htmlFor="address-phone"
                  >
                    Phone Number
                  </label>

                  <input
                    id="address-phone"
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                    required
                  />

                </div>


                {/* ADDRESS */}

                <div className="address-field address-field-full">

                  <label
                    htmlFor="address-line"
                  >
                    Address
                  </label>

                  <textarea
                    id="address-line"
                    name="addressLine"
                    value={
                      formData.addressLine
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House number, street, area"
                    rows="3"
                    required
                  />

                </div>


                {/* CITY */}

                <div className="address-field">

                  <label
                    htmlFor="address-city"
                  >
                    City
                  </label>

                  <input
                    id="address-city"
                    type="text"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter city"
                    required
                  />

                </div>


                {/* STATE */}

                <div className="address-field">

                  <label
                    htmlFor="address-state"
                  >
                    State
                  </label>

                  <input
                    id="address-state"
                    type="text"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter state"
                    required
                  />

                </div>


                {/* PINCODE */}

                <div className="address-field">

                  <label
                    htmlFor="address-pincode"
                  >
                    Pincode
                  </label>

                  <input
                    id="address-pincode"
                    type="text"
                    name="pincode"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter pincode"
                    inputMode="numeric"
                    required
                  />

                </div>

              </div>


              <div className="address-form-actions">

                <button
                  type="submit"
                  className="address-save-button"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}

                </button>


                <button
                  type="button"
                  className="address-cancel-button"
                  onClick={resetForm}
                  disabled={saving}
                >

                  Cancel

                </button>

              </div>

            </form>

          </section>

        )}


        {/* EMPTY STATE */}

        {!loading &&
          addresses.length === 0 &&
          !showForm && (

            <div className="addresses-empty">

              <MapPin size={46} />

              <h2>
                No saved addresses
              </h2>

              <p>
                Add your delivery address
                to make checkout faster.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowForm(true)
                }
              >

                <Plus size={16} />

                Add Your First Address

              </button>

            </div>

          )}


        {/* ADDRESS CARDS */}

        {!loading &&
          addresses.length > 0 && (

            <div className="addresses-grid">

              {addresses.map(
                (address) => (

                  <article
                    className={`address-card ${
                      address.isDefault
                        ? "default"
                        : ""
                    }`}
                    key={
                      address._id
                    }
                  >

                    <div className="address-card-top">

                      <div className="address-icon">

                        <MapPin
                          size={19}
                        />

                      </div>


                      {address.isDefault && (

                        <span className="default-address-badge">

                          <CheckCircle2
                            size={13}
                          />

                          Default

                        </span>

                      )}

                    </div>


                    <div className="address-card-content">

                      <h3>
                        {address.fullName}
                      </h3>

                      <p>
                        {address.phone}
                      </p>

                      <p>
                        {address.addressLine}
                      </p>

                      <p>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>

                    </div>


                    <div className="address-card-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            address
                          )
                        }
                      >

                        <Pencil
                          size={14}
                        />

                        Edit

                      </button>


                      <button
                        type="button"
                        className="address-delete-button"
                        onClick={() =>
                          handleDelete(
                            address._id
                          )
                        }
                      >

                        <Trash2
                          size={14}
                        />

                        Delete

                      </button>

                    </div>


                    {!address.isDefault && (

                      <button
                        type="button"
                        className="make-default-button"
                        onClick={() =>
                          makeDefault(
                            address._id
                          )
                        }
                      >

                        Set as Default

                      </button>

                    )}

                  </article>

                )
              )}

            </div>

          )}

      </div>

    </main>

  );

}


export default Addresses;