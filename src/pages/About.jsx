import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useEffect } from "react";
import { Link } from "react-router-dom";
function About() {
  useEffect(() => {
  const seoTitle =
    "About VELNORA | Our Fashion Story";

  const seoDescription =
    "Learn about VELNORA, our mission and our approach to modern, comfortable and affordable fashion for everyday style.";

  const canonicalUrl =
    `${window.location.origin}/about`;

  const originalTitle =
    document.title;

  document.title = seoTitle;

  const descriptionTag =
    document.querySelector(
      'meta[name="description"]'
    );

  const originalDescription =
    descriptionTag?.getAttribute("content");

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
    canonicalTag?.getAttribute("href");

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
      const tag =
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
      }
    }
  );

  return () => {
    document.title = originalTitle;

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

    Object.entries(
      originalOgValues
    ).forEach(
      ([property, content]) => {
        const tag =
          document.querySelector(
            `meta[property="${property}"]`
          );

        if (tag && content) {
          tag.setAttribute(
            "content",
            content
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
          <p>ABOUT US</p>

          <h1>
            About VELNORA
          </h1>

          <span>
            Fashion made for confidence, comfort
            and everyday style.
          </span>
        </section>

        <section className="info-page-card">
          <h2>
            Our Story
          </h2>

          <p>
            VELNORA is a modern fashion store focused on
            providing stylish, comfortable and
            affordable clothing for everyday life.
          </p>

          <p>
            Our goal is to make online fashion shopping
            simple, reliable and enjoyable with a
            carefully selected collection of clothing
            and accessories.
          </p>
        </section>

        <section className="info-feature-grid">

          <div className="info-feature-card">
            <Sparkles size={24} />

            <h3>
              Modern Style
            </h3>

            <p>
              Trend-focused collections designed for
              modern everyday fashion.
            </p>
          </div>

          <div className="info-feature-card">
            <ShieldCheck size={24} />

            <h3>
              Quality Focus
            </h3>

            <p>
              Products selected with attention to
              quality, comfort and value.
            </p>
          </div>

          <div className="info-feature-card">
            <Truck size={24} />

            <h3>
              Reliable Shopping
            </h3>

            <p>
              A simple shopping experience with secure
              checkout and order tracking.
            </p>
          </div>

        </section>

        <section className="info-page-card">
          <h2>
            Our Mission
          </h2>

          <p>
            Our mission is to make quality fashion
            accessible while providing customers with
            a smooth, secure and dependable online
            shopping experience.
          </p>
        </section>

      </div>
    </main>
  );
}

export default About;