import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

import { Link } from "react-router-dom";

function Contact() {
  return (
    <main className="info-page">
      <div className="info-page-container">

        <Link
          to="/"
          className="info-page-back"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <section className="info-page-header">
          <p>GET IN TOUCH</p>

          <h1>Contact Us</h1>

          <span>
            Have a question about your order,
            products or shopping experience?
            We’re here to help.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <Mail size={24} />

            <h3>Email Support</h3>

            <p>
              support@VELNORA.com
            </p>
          </div>

          <div className="info-feature-card">
            <Phone size={24} />

            <h3>Phone Support</h3>

            <p>
              Contact number coming soon.
            </p>
          </div>

          <div className="info-feature-card">
            <Clock size={24} />

            <h3>Support Hours</h3>

            <p>
              Monday to Saturday
              <br />
              9:00 AM – 6:00 PM
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>Customer Support</h2>

          <p>
            For questions related to orders,
            payments, shipping, returns or products,
            contact our customer support team.
          </p>

          <p>
            When contacting us about an order,
            please include your VELNORA order number
            so we can assist you faster.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Our Location</h2>

          <p>
            <MapPin
              size={17}
              style={{
                verticalAlign: "middle",
                marginRight: "6px",
              }}
            />

            VELNORA Online Fashion Store
          </p>

          <p>
            Business address will be updated here
            before the store goes live commercially.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Contact;