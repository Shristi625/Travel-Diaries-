import React from 'react';
import './TravelTips.css';

const tipsData = [
  {
    id: 1,
    title: "Best Time to Visit",
    icon: "🌅",
    description: "Autumn (Sep-Nov) and Spring (Mar-May) offer the clearest skies and most pleasant weather for trekking and sightseeing.",
    color: "#fdf2f8", // Soft pink
    iconColor: "#ec4899"
  },
  {
    id: 2,
    title: "Packing Essentials",
    icon: "🎒",
    description: "Layered clothing is key. Don't forget a sturdy pair of hiking boots, a universal power adapter, and a good power bank.",
    color: "#eff6ff", // Soft blue
    iconColor: "#3b82f6"
  },
  {
    id: 3,
    title: "Cultural Etiquette",
    icon: "🙏",
    description: "Always remove your shoes before entering homes or temples. Use your right hand for giving and receiving, and greet with 'Namaste'.",
    color: "#fcf5ff", // Soft purple
    iconColor: "#a855f7"
  },
  {
    id: 4,
    title: "Money Tips",
    icon: "💵",
    description: "Cash is king outside major cities. Carry Nepalese Rupees (NPR) in smaller denominations for local vendors and tea houses.",
    color: "#f0fdf4", // Soft green
    iconColor: "#22c55e"
  },
  {
    id: 5,
    title: "Safety Tips",
    icon: "🛡️",
    description: "Keep hydrated, acclimatize properly to avoid altitude sickness, and always hire licensed guides for high-altitude treks.",
    color: "#fffbeb", // Soft amber
    iconColor: "#f59e0b"
  },
  {
    id: 6,
    title: "Transportation",
    icon: "🚌",
    description: "Tourist buses are great for intercity travel. For local trips within Kathmandu or Pokhara, use ride-sharing apps like Pathao.",
    color: "#f8fafc", // Soft slate
    iconColor: "#64748b"
  },
  {
    id: 7,
    title: "Health Advice",
    icon: "🏥",
    description: "Drink only bottled or purified water. Pack a basic first-aid kit with altitude sickness medication and regular prescriptions.",
    color: "#fef2f2", // Soft red
    iconColor: "#ef4444"
  }
];

const TravelTips = () => {
  return (
    <section className="travel-tips">
      <div className="container">
        <div className="section-head" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
          <span className="section-tag">Essential Guide</span>
          <h2 className="section-title">Travel Tips for Nepal</h2>
          <p className="section-subtitle">
            Everything you need to know before you embark on your Himalayan adventure.
          </p>
        </div>
        
        <div className="tips-grid">
          {tipsData.map((tip) => (
            <div 
              key={tip.id} 
              className="tip-card animate-fade-in-up"
              style={{ '--hover-color': tip.iconColor }}
            >
              <div 
                className="tip-icon-wrapper" 
                style={{ backgroundColor: tip.color, color: tip.iconColor }}
              >
                {tip.icon}
              </div>
              <h3 className="tip-title">{tip.title}</h3>
              <p className="tip-description">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelTips;
