// import React, { useRef } from 'react';

// const Accolades: React.FC = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const awards = [
//     { year: '2025', title: '100 Best Coffee Shops', subtitle: '#1 Coffee Shop In North America' },
//     { year: '2025', title: '100 Best Coffee Shops', subtitle: '#2 Coffee Shop In The World' },
//     { year: '2025', title: 'US Brewer’s Cup', subtitle: '6th Place, Elika Liftee' },
//     { year: '2025', title: 'The Webby Awards', subtitle: 'Best Ecommerce Website' },
//     { year: '2024', title: 'US Barista Champ', subtitle: '2nd place, Morgan Eckroth' },
//     { year: '2023', title: 'US Barista Champ', subtitle: '4th place, Dakota Graff' },
//     { year: '2022', title: 'World Barista Champ', subtitle: '2nd place, Morgan Eckroth' },
//     { year: '2022', title: 'US Brewers Cup', subtitle: '1st place, Elika Liftee' },
//     { year: '2020', title: 'US Barista Champ', subtitle: '1st place, Andrea Allen' },
//     { year: '2019', title: 'Good Food Awards', subtitle: 'Winner' },
//     { year: '2018', title: 'US Roasters Champ', subtitle: '3rd place, Mark Michaelson' },
//     { year: '2017', title: 'US Roasters Champ', subtitle: '1st place, Mark Michaelson' },
//   ];

//   return (
//     <div className="bg-cream py-20 border-y border-onyx overflow-hidden">
//       <div className="container mx-auto px-4 mb-10 text-center">
//         <img 
//           src="//onyxcoffeelab.com/cdn/shop/t/31/assets/most-awarded.svg?v=108443281618992592451742949812" 
//           alt="The most awarded coffee roaster"
//           className="mx-auto w-64 md:w-96"
//         />
//       </div>
      
//       <div 
//         ref={scrollRef}
//         className="flex overflow-x-auto gap-8 px-8 pb-8 no-scrollbar snap-x snap-mandatory"
//       >
//         {awards.map((award, index) => (
//           <div 
//             key={index} 
//             className="flex-shrink-0 w-80 snap-center text-center p-6 border border-onyx/10 bg-white hover:shadow-lg transition-shadow duration-300"
//           >
//             <p className="text-gold font-bold text-lg mb-2">{award.year}</p>
//             <h3 className="text-xl font-bold font-oswald uppercase mb-2 text-onyx">{award.title}</h3>
//             <p className="text-onyx/70 text-sm">{award.subtitle}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Accolades;