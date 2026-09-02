import { useEffect } from "react";

import {
  ArrowLeft,
  FileText,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

import { Link } from "react-router-dom";

function Terms() {
  useEffect(() => {
    const seoTitle =
      "Terms & Conditions | VELNORA";

    const seoDescription =
      "Read VELNORA's Terms & Conditions covering website use, customer accounts, products, pricing, orders, payments, shipping, returns and refunds.";

    const canonicalUrl =
      `${window.location.origin}/terms`;

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
            "data-velnora-terms-og",
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
              "data-velnora-terms-og"
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
            STORE TERMS
          </p>

          <h1>
            Terms & Conditions
          </h1>

          <span>
            These terms explain the conditions that
            apply when using the VELNORA website and
            placing orders through our store.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <FileText size={24} />

            <h3>
              Website Use
            </h3>

            <p>
              By using VELNORA, customers agree to
              follow the applicable store terms.
            </p>
          </div>

          <div className="info-feature-card">
            <ShoppingBag size={24} />

            <h3>
              Orders
            </h3>

            <p>
              Orders are subject to product
              availability and successful
              processing.
            </p>
          </div>

          <div className="info-feature-card">
            <CreditCard size={24} />

            <h3>
              Payments
            </h3>

            <p>
              Available payment methods are shown
              during checkout.
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>
            Use of the Website
          </h2>

          <p>
            Customers may use the VELNORA website
            for lawful personal shopping purposes.
          </p>

          <p>
            Misuse of the website, attempts to
            interfere with its operation or
            unauthorized access to accounts or
            systems are not permitted.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Accounts
          </h2>

          <p>
            Customers are responsible for providing
            accurate account information and keeping
            their login credentials secure.
          </p>

          <p>
            VELNORA may take reasonable action if
            fraudulent or unauthorized account
            activity is detected.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Products and Pricing
          </h2>

          <p>
            We aim to display product information,
            images, prices and availability as
            accurately as possible.
          </p>

          <p>
            Product appearance may vary slightly
            depending on display settings,
            photography and manufacturing
            variations.
          </p>

          <p>
            Prices and product availability may
            change without prior notice.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Orders
          </h2>

          <p>
            Placing an order does not guarantee
            acceptance until the order has been
            successfully processed.
          </p>

          <p>
            VELNORA may cancel or reject an order
            where necessary due to unavailable
            stock, incorrect information, payment
            issues or suspected fraudulent activity.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Payments
          </h2>

          <p>
            Customers must use a valid payment
            method where online payment is selected.
          </p>

          <p>
            Payment transactions may be handled
            through third-party payment service
            providers.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Shipping, Returns and Refunds
          </h2>

          <p>
            Shipping, return and refund conditions
            are explained separately in VELNORA's
            Shipping Policy and Returns & Refunds
            Policy.
          </p>
        </section>

        <section className="info-page-card">
          <h2>
            Changes to These Terms
          </h2>

          <p>
            VELNORA may update these Terms & Conditions
            as the store, services or applicable
            requirements change.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Terms;