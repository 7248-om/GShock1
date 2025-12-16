import React from 'react';

const Arches: React.FC = () => {
  const arches = [
    {
      country: 'El Salvador',
      video: 'https://product.onyxcontent.com/media/pages/ecom/home/224fcadae6-1749498876/new.mp4',
      desc: 'El Salvador offers some of the best offerings for us to enjoy. Known for care and craftsmanship.'
    },
    {
      country: 'Ethiopia',
      video: 'https://product.onyxcontent.com/media/pages/ecom/home/2b25639bfc-1763744466/ethiopia-2.mp4',
      desc: 'As the home of coffee itself, Ethiopia hosts a wide variety of talented producers.'
    },
    {
      country: 'Colombia',
      video: 'https://product.onyxcontent.com/media/pages/ecom/home/cb45055b2c-1763745691/colombia-10.mp4',
      desc: 'Known for innovation and resilience, Colombia\'s coffee history dates back to the early 19th century.'
    }
  ];

  return (
    <section className="bg-onyx py-24 text-cream">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-6">Winter Offerings</h2>
        <p className="max-w-xl mx-auto opacity-80 mb-8">
          See our latest offerings from around the world, brought straight to you. Keep up to date with new coffee launches by signing up for our weekly release newsletter.
        </p>
        <a href="#" className="inline-block border-2 border-cream px-8 py-2 uppercase font-bold hover:bg-cream hover:text-onyx transition-colors">
          Learn More
        </a>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 px-4 max-w-7xl mx-auto">
        {arches.map((item, i) => (
          <a key={i} href="#" className="group relative w-full md:w-1/3 aspect-[3/4] overflow-hidden rounded-t-[10rem]">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            >
              <source src={item.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-8 text-center">
              <h3 className="text-3xl font-oswald uppercase mb-2">{item.country}</h3>
              <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                {item.desc}
              </p>
              <span className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">View Coffees →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Arches;