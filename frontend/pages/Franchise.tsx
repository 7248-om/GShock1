import React, { useState } from "react";
import axios from "axios";

const Franchise = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    investment: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_API_URL || "/api";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/franchises`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        budgetRange: formData.investment,
        message: formData.message,
      });

      setSubmitMessage({
        type: "success",
        text: "Your franchise application has been submitted successfully! We'll be in touch soon.",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        investment: "",
        message: "",
      });
    } catch (error: any) {
      setSubmitMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full px-6 md:px-12 py-36 bg-cream-dark/40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-32 items-start">

        {/* LEFT CONTENT */}
        <div className="relative flex flex-col justify-center pl-0 md:pl-8 animate-fade-up">

          {/* vertical accent */}
          <span className="absolute left-0 top-1 h-28 w-[2px] bg-coffee-primary/40 hidden md:block" />

          <p className="text-[11px] tracking-[0.45em] uppercase text-coffee-dark/60 mb-10">
            Franchise
          </p>

          <h1 className="text-4xl md:text-5xl font-light leading-[1.12] mb-4 text-coffee-dark font-['Playfair_Display']">
            Become a Part of <br />
            the Rabuste Story
          </h1>

          {/* animated underline */}
          <div className="h-[2px] bg-coffee-primary/50 mb-10 animate-underline-draw" />

          {/* description + points */}
          <div className="animate-fade-up-delayed">
            <p className="text-sm text-coffee-dark/70 max-w-md leading-relaxed mb-14">
              Rabuste cafés are cultural spaces — where bold Robusta,
              thoughtful design, and local art coexist. We partner with
              people who believe in slow, intentional growth.
            </p>

            <div className="space-y-4 text-sm text-coffee-dark/70 tracking-wide">
              <div>— Coffee-first, design-led brand</div>
              <div>— Art-forward, community-driven cafés</div>
              <div>— End-to-end operational & brand support</div>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div
          className="relative bg-cream p-12 md:p-16 border border-coffee-dark/10
                     shadow-[0_30px_80px_-40px_rgba(0,0,0,0.18)]
                     animate-fade-up-delayed"
        >
          <h2 className="text-[11px] tracking-[0.4em] uppercase mb-16 text-coffee-dark">
            Franchise Application
          </h2>

          {submitMessage && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                submitMessage.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <form className="space-y-12" onSubmit={handleSubmit}>

            <div className="group">
              <label className="block text-[10px] tracking-widest uppercase mb-3 text-coffee-dark/60">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-coffee-dark/25 py-2 text-sm
                           focus:outline-none focus:border-coffee-primary
                           transition-colors duration-300"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] tracking-widest uppercase mb-3 text-coffee-dark/60">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b border-coffee-dark/25 py-2 text-sm
                           focus:outline-none focus:border-coffee-primary
                           transition-colors duration-300"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] tracking-widest uppercase mb-3 text-coffee-dark/60">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-coffee-dark/25 py-2 text-sm
                           focus:outline-none focus:border-coffee-primary
                           transition-colors duration-300"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] tracking-widest uppercase mb-3 text-coffee-dark/60">
                Preferred City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-coffee-dark/25 py-2 text-sm
                           focus:outline-none focus:border-coffee-primary
                           transition-colors duration-300"
              />
            </div>

            {/* Investment */}
            <div className="group">
              <label className="block text-[10px] tracking-widest uppercase mb-3 text-coffee-dark/60">
                Investment Capacity
              </label>
              <select
                name="investment"
                value={formData.investment}
                onChange={handleChange}
                className="w-full bg-cream border-b border-coffee-dark/25 py-2 text-sm
                           focus:outline-none focus:border-coffee-primary
                           transition-colors duration-300"
              >
                <option value="">Select range</option>
                <option>₹20–30 Lakhs</option>
                <option>₹30–50 Lakhs</option>
                <option>₹50+ Lakhs</option>
              </select>
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-[10px] tracking-widest uppercase mb-3 text-coffee-dark/60">
                Why Rabuste?
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-coffee-dark/25 py-2 text-sm
                           focus:outline-none focus:border-coffee-primary
                           transition-colors duration-300 resize-none"
                placeholder="Tell us why you're interested in partnering with Rabuste..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-20 w-full py-4 border border-coffee-dark text-coffee-dark
                         uppercase tracking-[0.38em] text-[11px]
                         hover:bg-coffee-primary hover:text-white hover:border-coffee-primary
                         hover:-translate-y-[1px] active:translate-y-0
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default Franchise;

