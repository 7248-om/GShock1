import React from 'react';

const GridMenu: React.FC = () => {
  const items = [
    {
      title: 'Coffee',
      img: 'https://product.onyxcontent.com/media/pages/ecom/home/b9918a89db-1754062425/bt_colombia_jairo_arcila_lychee_11-copy.webp',
      link: '#'
    },
    {
      title: 'Tea',
      img: 'https://product.onyxcontent.com/media/pages/ecom/home/075765f5cf-1754062600/bt_tealight_9-copy.webp',
      link: '#'
    },
    {
      title: 'Chocolate',
      img: 'https://product.onyxcontent.com/media/pages/ecom/home/191746d5a4-1754062326/chocolate.webp',
      link: '#'
    },
    {
      title: 'Merch',
      img: 'https://product.onyxcontent.com/media/pages/ecom/home/5a29735f4a-1754062202/new_mugs_june_2025_ee-143-copy.webp',
      link: '#'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full">
      {items.map((item, i) => (
        <a key={i} href={item.link} className="relative aspect-square group overflow-hidden border border-cream/10">
          <img 
            src={item.img} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center">
            <h3 className="text-white text-2xl font-bold font-oswald uppercase mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              {item.title}
            </h3>
            <span className="bg-cream text-onyx px-6 py-2 uppercase font-bold text-xs tracking-widest transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 hover:bg-gold hover:text-white">
              Shop
            </span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default GridMenu;