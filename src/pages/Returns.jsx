import { useEffect } from "react";

import {
  ArrowLeft,
  RotateCcw,
  BadgeCheck,
  WalletCards,
} from "lucide-react";

import { Link } from "react-router-dom";

function Returns() {
  useEffect(() => {
    const seoTitle =
      "Returns & Refunds Policy | VELNORA";

    const seoDescription =
      "Read VELNORA's returns and refunds policy, including return eligibility, the 7-day return window, refund processing and damaged product support.";

    const canonicalUrl =
      `${window.location.origin}/returns`;

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
      "og:description": seoDescription,
      "og:url": canonicalUrl,
      "og:type": "website",
    };

    const originalOgValues = {};

    Object.entries(ogTags).forEach(
      ([property, content]) => {
        let tag =
          document.querySelector(
            `meta[property="${property}"]`
          );

        if (tag) {
          originalOgValues[property] =
            tag.getAttribute("content");

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
            "data-velnora-returns-og",
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
              "data-velnora-returns-og"
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
            RETURN INFORMATION
          </p>

          <h1>
            Returns & Refunds
          </h1>

          <span>
            Learn about VELNORA's return eligibility,
            return process and refund handling.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <RotateCcw size={24} />

            <h3>
              Easy Returns
            </h3>

            <p>
              Eligible products can be returned
              within the applicable return window.
            </p>
          </div>

          <div className="info-feature-card">
            <BadgeCheck size={24} />

            <h3>
              Product Condition
            </h3>

            <p>
              Returned items should be unused,
              unwashed and in original condition.
            </p>
          </div>

          <div className="info-feature-card">
            <WalletCards size={24} />

            <h3>
              Refund Processing
            </h3>

            <p>
              Approved refunds are processed
              after the returned product is verified.
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>
            Return Eligibility
          </h2>

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
          <h2>
            Return Window
          </h2>

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
          <h2>
            How to Request a Return
          </h2>

          <p>
            Contact VELNORA customer support with your
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
          <h2>
            Refunds
          </h2>

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
          <h2>
            Damaged or Incorrect Products
          </h2>

          <p>
            If you receive a damaged, defective
            or incorrect product, contact VELNORA
            customer support as soon as possible
            with your order details.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Returns;