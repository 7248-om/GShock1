import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
// import Ticker from '../components/Ticker';
import EmailPopup from '../components/EmailPopup';
import SplitSection from '../components/SplitSection';
import DoubleSplit from '../components/DoubleSplit';
// import Arches from '../components/Arches';
import GridMenu from '../components/GridMenu';
import SplitSection2 from '@/components/SplitSection2';
import Highlights from '@/components/Highlights';
import SuggestionSection from '@/components/SuggestionSection';

const Home: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <EmailPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      {/* <Ticker /> */}

      <Hero />

      <SplitSection
        alignment="left"
        mediaUrl="https://ik.imagekit.io/btpcp9tvm/GShock/rabuste-coffee-pic.jpeg"
        mediaType="image"
        title="Why Robusta?"
        text="Robusta coffee is bold, powerful, and often misunderstood. At Rabuste, we focus exclusively on premium Robusta beans to showcase their strength, rich body, and higher caffeine content — redefining what great coffee can be."
        ctaText="Learn About Robusta"
        ctaLink="/about"
      />

      <DoubleSplit 
        left={{
          mediaUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
          mediaType: "image",
          title: "Our Coffee, Curated",
          text: "Rabuste offers a limited, thoughtfully designed Robusta-only menu crafted for grab-and-go experiences without compromising quality.",
          link: "#"
        }}
        right={{
          mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
          mediaType: "image",
          title: "Grab-and-Go, Done Right",
          text: "Designed for modern lifestyles, our café delivers bold coffee quickly — without losing the warmth of a cozy, cultural space.",
          link: "#"
        }}
      />

      {/* <Accolades /> */}

      <SplitSection
        alignment="right"
        mediaUrl="https://ik.imagekit.io/btpcp9tvm/GShock/art-culture.png"
        mediaType="image"
        title="Coffee × Art × Culture"
        text="Rabuste blends coffee culture with fine art and creativity. Our café doubles as a micro art gallery, showcasing rotating works from emerging and local artists."
        ctaText="Explore the Art"
        ctaLink="/art"
        backgroundColor="bg-cream"
      />

      <DoubleSplit 
        left={{
          mediaUrl: "https://ik.imagekit.io/btpcp9tvm/GShock/workshop.png",
          mediaType: "image",
          title: "Workshops & Experiences",
          text: "From coffee brewing sessions to creative workshops, Rabuste hosts intimate, community-driven experiences that inspire learning and connection.",
          link: "/workshop"
        }}
        right={{
          mediaUrl: "https://ik.imagekit.io/btpcp9tvm/GShock/workshop-community.png",
          mediaType: "image",
          title: "Community at the Core",
          text: "Every Rabuste café is designed to feel local, welcoming, and human — a place where people come together over shared experiences.",
          link: "/workshop"
          
        }}
      />

      <SplitSection
        alignment="left"
        mediaUrl="https://ik.imagekit.io/btpcp9tvm/GShock/inside-cozy.png"
        mediaType="image"
        title="Designed for Experience"
        text="Our spaces are compact, cozy, and thoughtfully designed to balance efficiency with atmosphere — perfect for quick visits or lingering conversations."
        ctaText="Our Café Concept"
        ctaLink="/about"
        backgroundColor="bg-cream"
      />

      {/* <SplitSection
        alignment="left"
        mediaUrl="https://images.unsplash.com/photo-1507919985931-6d98f5b4a04c"
        mediaType="image"
        title="Robusta, Reimagined"
        text="Rabuste challenges traditional coffee norms by celebrating Robusta — highlighting its depth, complexity, and role in a modern coffee culture."
        ctaText="Discover the Difference"
        ctaLink="#"
        backgroundColor="bg-cream-dark"
      />

      <SplitSection
        alignment="right"
        mediaUrl="https://images.unsplash.com/photo-1510626176961-4b57d4fbad03"
        mediaType="image"
        title="Art & Artist Stories"
        text="Every artwork displayed at Rabuste has a story. We spotlight artists, their journeys, and the creative process behind each piece."
        ctaText="Meet the Artists"
        ctaLink="#"
        backgroundColor="bg-cream"
      /> */}

      <SplitSection
        alignment="right"
        mediaUrl="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9"
        mediaType="image"
        title="AI-Enhanced Café Experience"
        text="Rabuste explores how AI can enhance café experiences — from personalized coffee discovery to intelligent art and workshop recommendations."
        ctaText="See How AI Fits In"
        ctaLink="#"
        backgroundColor="bg-cream"
      />

      

      {/* <SplitSection
        alignment="right"
        mediaUrl="https://images.unsplash.com/photo-1514933651103-005eec06c04b"
        mediaType="image"
        title="Come Visit Rabuste"
        text="Our cafés are designed to feel bold yet cozy — a space where coffee, art, and culture intersect in everyday moments."
        ctaText="Find a Café"
        ctaLink="#"
        backgroundColor="bg-cream-dark"
      /> */}

      <SplitSection2
        alignment="center"
        mediaUrl="https://images.unsplash.com/photo-1521017432531-fbd92d768814"
        mediaType="image"
        title="Built for Growth"
        text="Rabuste is a compact, scalable café model designed for expansion. We’re opening franchise opportunities for partners who believe in bold coffee and meaningful experiences."
        ctaText="Explore Franchise Opportunities"
        ctaLink="/franchise"
        theme="dark"
      />
      <Highlights />
      <SuggestionSection />
      {/* <Arches /> */}
      {/* <SplitSection
        alignment="left"
        mediaUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
        mediaType="image"
        title="Beyond the Cup"
        text="Rabuste is more than coffee — it’s a lifestyle brand rooted in culture, creativity, and community."
        ctaText="Explore the Experience"
        ctaLink="#"
        theme="dark"
      /> */}
{/* 
      <div className="py-20 bg-cream">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-xl font-bold mb-8">FEATURED IN</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            <span>Design & Culture</span>
            <span>Independent Cafés</span>
            <span>Creative Spaces</span>
            <span>Local Brands</span>
          </div>
        </div>
      </div> */}

      {/* <DoubleSplit 
        left={{
          mediaUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
          mediaType: "image",
          title: "Stay Connected",
          text: "Be the first to hear about new brews, featured artists, workshops, and café launches.",
          link: "#"
        }}
        right={{
          mediaUrl: "https://images.unsplash.com/photo-1507919985931-6d98f5b4a04c",
          mediaType: "image",
          title: "Partner With Rabuste",
          text: "Interested in bringing the Rabuste experience to your city? Franchise opportunities are now open.",
          link: "#"
        }}
      /> */}

      <GridMenu />
    </>
  );
};

export default Home;
