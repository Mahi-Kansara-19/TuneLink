import Navbar from "../components/Navbar";
import "../App.css";

function Subscription() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      color: "badge-accent",
      features: [
        "Create up to 3 projects",
        "Send collaboration requests",
        "Basic artist profile",
        "Access AI Match"
      ]
    },
    {
      name: "Pro Artist",
      price: "₹199 / month",
      color: "badge-primary",
      features: [
        "Unlimited projects",
        "Priority in artist directory",
        "Advanced AI Match",
        "View detailed lyric logs",
        "Verified badge"
      ]
    },
    {
      name: "Band Plan",
      price: "₹499 / month",
      color: "badge-secondary",
      features: [
        "Everything in Pro",
        "Up to 5 team members",
        "Private project rooms",
        "Shared workspace",
        "Early access features"
      ]
    }
  ];

  return (
    <div className="app">
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <Navbar />

      <main
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 20px"
        }}
      >
        <div className="glass-card" style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="badge badge-primary">TuneLink Premium</span>

          <h1 style={{ marginTop: "15px", fontSize: "2.5rem" }}>
            Subscription Plans
          </h1>

          <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
            Upgrade your music collaboration experience.
          </p>
        </div>

        <div className="grid-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              <span className={`badge ${plan.color}`}>
                {plan.name}
              </span>

              <h2>{plan.price}</h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ color: "var(--text-muted)" }}>
                    ✅ {feature}
                  </div>
                ))}
              </div>

              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "20px"
                }}
              >
                {plan.name === "Free" ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>

        <div
          className="glass-card"
          style={{
            marginTop: "40px",
            textAlign: "center"
          }}
        >
          <h3>Coming Soon 🚀</h3>

          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "12px",
              lineHeight: "1.7"
            }}
          >
            Razorpay integration, yearly plans, custom domains,
            exclusive artist badges and premium project rooms.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Subscription;