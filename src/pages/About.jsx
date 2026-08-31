import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

function About() {
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
            About NOVA
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
            NOVA is a modern fashion store focused on
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