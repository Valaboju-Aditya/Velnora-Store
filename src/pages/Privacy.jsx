import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Lock,
} from "lucide-react";

import { Link } from "react-router-dom";

function Privacy() {
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
          <p>YOUR PRIVACY</p>

          <h1>Privacy Policy</h1>

          <span>
            Learn how NOVA may collect, use and protect
            information when you use our store.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <Database size={24} />

            <h3>Information We Collect</h3>

            <p>
              We may collect account, order,
              shipping and payment-related information
              needed to provide our services.
            </p>
          </div>

          <div className="info-feature-card">
            <ShieldCheck size={24} />

            <h3>Responsible Use</h3>

            <p>
              Information is used for account management,
              orders, support and store operations.
            </p>
          </div>

          <div className="info-feature-card">
            <Lock size={24} />

            <h3>Security</h3>

            <p>
              We use reasonable measures to protect
              customer information and account access.
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>Information We May Collect</h2>

          <p>
            When you create an account, place an order
            or contact NOVA, we may collect information
            such as your name, email address, phone number,
            delivery address and order information.
          </p>

          <p>
            We may also collect information necessary
            for operating and improving the website.
          </p>
        </section>

        <section className="info-page-card">
          <h2>How We Use Information</h2>

          <p>
            Customer information may be used to process
            orders, manage accounts, provide customer
            support, communicate order updates and improve
            the shopping experience.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Payments</h2>

          <p>
            Online payments may be processed through
            third-party payment providers.
          </p>

          <p>
            NOVA should not directly store sensitive
            payment card information when payment details
            are handled by the payment provider.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Data Sharing</h2>

          <p>
            Information may be shared with service
            providers when necessary to process payments,
            deliver orders, operate the website or provide
            customer support.
          </p>

          <p>
            NOVA does not intend to sell customer personal
            information to unrelated third parties.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Data Security</h2>

          <p>
            We use reasonable technical and organizational
            measures to help protect customer information.
          </p>

          <p>
            However, no internet-based service can guarantee
            complete security.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Your Account</h2>

          <p>
            Customers are responsible for keeping their
            account credentials secure and should contact
            NOVA if they suspect unauthorized access.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Policy Updates</h2>

          <p>
            This Privacy Policy may be updated as NOVA's
            services, legal requirements or business
            practices change.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Privacy;