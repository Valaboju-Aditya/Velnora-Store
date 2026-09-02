import { useEffect } from "react";

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

import { Link } from "react-router-dom";

function Contact() {
  useEffect(() => {
    const seoTitle =
      "Contact VELNORA | Customer Support";

    const seoDescription =
      "Contact VELNORA customer support for help with orders, payments, shipping, returns, products and your online shopping experience.";

    const canonicalUrl =
      `${window.location.origin}/contact`;

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
            "data-velnora-contact-og",
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
              "data-velnora-contact-og"
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
          <p>GET IN TOUCH</p>

          <h1>
            Contact Us
          </h1>

          <span>
            Have a question about your order,
            products or shopping experience?
            We’re here to help.
          </span>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <Mail size={24} />

            <h3>
              Email Support
            </h3>

            <p>
              support@VELNORA.com
            </p>
          </div>

          <div className="info-feature-card">
            <Phone size={24} />

            <h3>
              Phone Support
            </h3>

            <p>
              Contact number coming soon.
            </p>
          </div>

          <div className="info-feature-card">
            <Clock size={24} />

            <h3>
              Support Hours
            </h3>

            <p>
              Monday to Saturday
              <br />
              9:00 AM – 6:00 PM
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>
            Customer Support
          </h2>

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
          <h2>
            Our Location
          </h2>

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