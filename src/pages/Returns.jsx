import {
  ArrowLeft,
  RotateCcw,
  BadgeCheck,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";

function Returns() {
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
          <p>RETURN INFORMATION</p>

          <h1>Returns & Refunds</h1>

          <span>
            Learn about NOVA's return eligibility,
            return process and refund handling.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <RotateCcw size={24} />

            <h3>Easy Returns</h3>

            <p>
              Eligible products can be returned
              within the applicable return window.
            </p>
          </div>

          <div className="info-feature-card">
            <BadgeCheck size={24} />

            <h3>Product Condition</h3>

            <p>
              Returned items should be unused,
              unwashed and in original condition.
            </p>
          </div>

          <div className="info-feature-card">
            <WalletCards size={24} />

            <h3>Refund Processing</h3>

            <p>
              Approved refunds are processed
              after the returned product is verified.
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>Return Eligibility</h2>

          <p>
            Products may be eligible for return
            if they are unused, unwashed,
            undamaged and returned with their
            original packaging and tags.
          </p>

          <p>
            Certain products may not be eligible
            for return due to hygiene, safety,
            promotional or other applicable
            restrictions.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Return Window</h2>

          <p>
            Eligible products should generally be
            returned within 7 days of delivery.
          </p>

          <p>
            The applicable return period may vary
            depending on the product or promotion.
          </p>
        </section>

        <section className="info-page-card">
          <h2>How to Request a Return</h2>

          <p>
            Contact NOVA customer support with your
            order number and details about the item
            you would like to return.
          </p>

          <p>
            Our support team will provide the
            available return instructions for
            eligible products.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Refunds</h2>

          <p>
            Once a returned product is received
            and approved after inspection, the
            refund process will begin.
          </p>

          <p>
            For prepaid orders, approved refunds
            will generally be returned to the
            original payment method.
          </p>

          <p>
            Refund processing time may vary
            depending on the bank or payment
            provider.
          </p>
        </section>

        <section className="info-page-card">
          <h2>Damaged or Incorrect Products</h2>

          <p>
            If you receive a damaged, defective
            or incorrect product, contact NOVA
            customer support as soon as possible
            with your order details.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Returns;