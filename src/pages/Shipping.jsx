import { useEffect } from "react";

import {
  ArrowLeft,
  Truck,
  PackageCheck,
  Clock,
} from "lucide-react";

import { Link } from "react-router-dom";

function Shipping() {
  useEffect(() => {
    const seoTitle =
      "Shipping Policy | VELNORA";

    const seoDescription =
      "Read VELNORA's shipping policy, including order processing, delivery estimates, shipping addresses, tracking and shipping charges.";

    const canonicalUrl =
      `${window.location.origin}/shipping`;

    const originalTitle =
      document.title;

    document.title = seoTitle;

    const descriptionTag =
      document.querySelector(
        'meta[name="description"]'
      );

    const originalDescription =
      descriptionTag?.getAttribute(
        "content"
      );

    if (descriptionTag) {
      descriptionTag.setAttribute(
        "content",
        seoDescription
      );
    }

    const canonicalTag =
      document.querySelector(
        'link[rel="canonical"]'
      );

    const originalCanonical =
      canonicalTag?.getAttribute(
        "href"
      );

    if (canonicalTag) {
      canonicalTag.setAttribute(
        "href",
        canonicalUrl
      );
    }

    const ogTags = {
      "og:title": seoTitle,
      "og:description":
        seoDescription,
      "og:url": canonicalUrl,
      "og:type": "website",
    };

    const originalOgValues = {};

    Object.entries(
      ogTags
    ).forEach(
      ([property, content]) => {
        let tag =
          document.querySelector(
            `meta[property="${property}"]`
          );

        if (tag) {
          originalOgValues[
            property
          ] =
            tag.getAttribute(
              "content"
            );

          tag.setAttribute(
            "content",
            content
          );
        } else {
          tag =
            document.createElement(
              "meta"
            );

          tag.setAttribute(
            "property",
            property
          );

          tag.setAttribute(
            "content",
            content
          );

          tag.setAttribute(
            "data-velnora-shipping-og",
            "true"
          );

          document.head.appendChild(
            tag
          );
        }
      }
    );

    return () => {
      document.title =
        originalTitle;

      if (
        descriptionTag &&
        originalDescription
      ) {
        descriptionTag.setAttribute(
          "content",
          originalDescription
        );
      }

      if (
        canonicalTag &&
        originalCanonical
      ) {
        canonicalTag.setAttribute(
          "href",
          originalCanonical
        );
      }

      Object.keys(
        ogTags
      ).forEach(
        (property) => {
          const tag =
            document.querySelector(
              `meta[property="${property}"]`
            );

          if (!tag) {
            return;
          }

          if (
            tag.getAttribute(
              "data-velnora-shipping-og"
            ) === "true"
          ) {
            tag.remove();
          } else if (
            originalOgValues[
              property
            ]
          ) {
            tag.setAttribute(
              "content",
              originalOgValues[
                property
              ]
            );
          }
        }
      );
    };
  }, []);

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
          <p>
            DELIVERY INFORMATION
          </p>

          <h1>
            Shipping Policy
          </h1>

          <span>
            Learn how VELNORA processes,
            ships and delivers your orders.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <Clock size={24} />

            <h3>
              Processing Time
            </h3>

            <p>
              Orders are generally processed
              within 1–2 business days.
            </p>
          </div>

          <div className="info-feature-card">
            <Truck size={24} />

            <h3>
              Delivery Time
            </h3>

            <p>
              Standard delivery usually takes
              3–7 business days after dispatch.
            </p>
          </div>

          <div className="info-feature-card">
            <PackageCheck size={24} />

            <h3>
              Order Tracking
            </h3>

            <p>
              You can view your latest order
              status from the My Orders section.
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>
            Order Processing
          </h2>

          <p>
            Once an order is placed successfully,
            VELNORA will begin processing it for
            shipment.
          </p>

          <p>
            Processing times may be longer during
            public holidays, sales, high-demand
            periods or unexpected operational
            delays.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Delivery Estimates
          </h2>

          <p>
            Delivery times depend on the customer's
            location and the availability of courier
            services in that area.
          </p>

          <p>
            Estimated delivery dates are not
            guaranteed and may change due to courier
            delays, weather conditions or other
            circumstances outside our control.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Shipping Address
          </h2>

          <p>
            Customers are responsible for providing
            a complete and accurate delivery address
            while placing an order.
          </p>

          <p>
            VELNORA may not be able to change the
            delivery address once an order has been
            dispatched.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Shipping Charges
          </h2>

          <p>
            Orders below ₹999 have a ₹99 shipping
            charge. Orders of ₹999 or more qualify
            for free standard shipping.
          </p>

          <p>
            Any applicable shipping charge will be
            displayed during checkout before the
            order is confirmed.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Shipping;