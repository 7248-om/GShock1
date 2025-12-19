import React, { useState } from "react";

// ---------------------
// Workshop Type
// ---------------------
type WorkshopType = {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  price: number; // 0 = free
};

// ---------------------
// Workshop Data (20 workshops)
// ---------------------
const workshops: WorkshopType[] = [
  { id: 1, title: "Latte Art Basics", description: "Learn milk frothing & latte art.", date: "2025-12-21", time: "16:00 – 18:00", price: 799 },
  { id: 2, title: "Espresso Masterclass", description: "Espresso extraction techniques.", date: "2025-12-23", time: "17:00 – 19:00", price: 999 },
  { id: 3, title: "Pour-Over Techniques", description: "Master pour-over brewing.", date: "2025-12-26", time: "15:00 – 17:00", price: 899 },
  { id: 4, title: "Cold Brew Workshop", description: "Make delicious cold brew.", date: "2025-12-28", time: "14:00 – 16:00", price: 0 },
  { id: 5, title: "Coffee Tasting", description: "Taste and differentiate coffee beans.", date: "2026-01-02", time: "17:00 – 19:00", price: 499 },
  { id: 6, title: "Home Brewing Tips", description: "Brew coffee at home like a pro.", date: "2026-01-05", time: "16:00 – 18:00", price: 0 },
  { id: 7, title: "French Press Secrets", description: "Perfect French press coffee.", date: "2026-01-08", time: "15:00 – 17:00", price: 699 },
  { id: 8, title: "Cupping Session", description: "Learn professional coffee cupping.", date: "2026-01-10", time: "16:00 – 18:00", price: 0 },
  { id: 9, title: "Latte Art Advanced", description: "Advanced latte art techniques.", date: "2026-01-12", time: "17:00 – 19:00", price: 1099 },
  { id: 10, title: "Aeropress Techniques", description: "Master Aeropress brewing.", date: "2026-01-15", time: "14:00 – 16:00", price: 599 },
  { id: 11, title: "Coffee & Dessert Pairing", description: "Pair coffee with desserts.", date: "2026-01-18", time: "15:00 – 17:00", price: 0 },
  { id: 12, title: "Advanced Espresso", description: "Professional espresso skills.", date: "2026-01-21", time: "16:00 – 18:00", price: 1299 },
  { id: 13, title: "Brewing Science", description: "Learn coffee chemistry & extraction.", date: "2026-01-25", time: "17:00 – 19:00", price: 0 },
  { id: 14, title: "Coffee Latte Workshop", description: "Classic latte brewing.", date: "2026-01-28", time: "15:00 – 17:00", price: 799 },
  { id: 15, title: "Coffee Art for Kids", description: "Fun coffee-inspired art for kids.", date: "2026-02-01", time: "14:00 – 15:30", price: 0 },
  { id: 16, title: "Coffee Roasting 101", description: "Basics of roasting coffee beans.", date: "2026-02-05", time: "16:00 – 18:00", price: 899 },
  { id: 17, title: "Barista Skills", description: "Become a pro barista.", date: "2026-02-10", time: "17:00 – 19:00", price: 1199 },
  { id: 18, title: "Coffee & Chocolate Pairing", description: "Pair coffee with chocolates.", date: "2026-02-14", time: "15:00 – 17:00", price: 0 },
  { id: 19, title: "Iced Coffee Creations", description: "Make creative iced coffee drinks.", date: "2026-02-20", time: "14:00 – 16:00", price: 599 },
  { id: 20, title: "Coffee History & Culture", description: "Learn coffee origins & culture.", date: "2026-02-28", time: "16:00 – 18:00", price: 0 },
];

// ---------------------
// FAQs
// ---------------------
const faqs = [
  {
    question: "Are workshops free or paid?",
    answer: "Both options are possible. Some workshops may be free, others may be paid events.",
  },
  {
    question: "Do frequent customers get priority access?",
    answer: "Yes, this can be implemented as an optional feature: Priority access for frequent customers, notifications for upcoming workshops, and optional customer tiers based on order history.",
  },
];

// ---------------------
// Component
// ---------------------
const Workshop: React.FC = () => {
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");
  const [upcomingDays, setUpcomingDays] = useState<number | "all">("all");

  // Filter workshops
  const filteredWorkshops = workshops.filter((w) => {
    const today = new Date();
    const workshopDate = new Date(w.date);

    // Filter by type
    if (filterType === "free" && w.price !== 0) return false;
    if (filterType === "paid" && w.price === 0) return false;

    // Filter by upcoming X days
    if (upcomingDays !== "all") {
      const diffDays = (workshopDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 0 || diffDays > upcomingDays) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section 1: Intro */}
      <section className="text-center py-16 px-4 bg-yellow-50">
        <h1 className="text-5xl font-bold mb-4">Robusta Coffee Workshops</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Join our interactive coffee workshops to learn from expert baristas. Whether free or paid, every workshop is a chance to explore coffee culture and brewing techniques.
        </p>
      </section>

      {/* Section 2: Images */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Workshop Highlights</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <img
  key={i}
  src={`/images/Robusta${i + 1}.jpg`}
  alt={`Workshop ${i + 1}`}
  className="w-full h-64 object-cover rounded-xl shadow-lg"
/>
          ))}
        </div>
      </section>

      {/* Section 3: Filters */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-8">Upcoming Workshops</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
          <div>
            <label className="mr-2 font-medium">Type:</label>
            <select
              className="border rounded px-2 py-1"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "free" | "paid")}
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="mr-2 font-medium">Upcoming:</label>
            <select
              className="border rounded px-2 py-1"
              value={upcomingDays}
              onChange={(e) => setUpcomingDays(e.target.value === "all" ? "all" : parseInt(e.target.value))}
            >
              <option value="all">All</option>
              <option value="7">Next 7 days</option>
              <option value="14">Next 14 days</option>
              <option value="30">Next 30 days</option>
            </select>
          </div>
        </div>

        {/* Section 3: Workshops */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((w) => (
              <div
                key={w.id}
                className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">{w.title}</h3>
                  <p className="text-gray-700 mb-2">{w.description}</p>
                  <p className="text-gray-500 text-sm"><strong>Date:</strong> {w.date}</p>
                  <p className="text-gray-500 text-sm"><strong>Time:</strong> {w.time}</p>
                  <p className={`mt-2 font-medium ${w.price === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {w.price === 0 ? "Free" : `₹${w.price}`}
                  </p>
                </div>
                <button className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 transition">
                  Book Workshop
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No workshops found.</p>
          )}
        </div>
      </section>

      {/* Section 4: FAQs */}
      <section className="py-16 px-4 bg-yellow-50">
        <h2 className="text-3xl font-semibold text-center mb-8">FAQs</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Workshop;
