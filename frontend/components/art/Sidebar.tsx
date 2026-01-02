import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  totalResults: number;
  selectedMediums: string[];
  onMediumToggle: (medium: string) => void;
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  totalResults,
  selectedMediums,
  onMediumToggle,
  selectedStatuses,
  onStatusToggle,
}) => {
  if (!isOpen) return null;

  const mediums = [
    'Oil on Canvas',
    'Bronze & Stone',
    'Digital Painting',
    'Acrylic on Wood',
    'Photography',
    'Charcoal on Paper',
    'Resin Sculpture',
    'Mixed Media',
  ];

  const statuses = ['Available', 'Sold Out', 'Limited Edition'];

  return (
    <aside className="w-64 flex-shrink-0 pr-12 hidden lg:block sticky top-12 h-fit bg-cream">
      <div className="flex justify-between items-baseline mb-10">
        <h2 className="text-3xl font-serif font-black text-[#3E2723]">Filters</h2>
        <span className="text-[11px] font-bold text-[#3E2723]/60">
          {totalResults} Results
        </span>
      </div>

      <div className="space-y-10">
        <div>
          <div className="flex justify-between items-center border-b border-[#3E2723]/20 pb-3 mb-6">
            <h3 className="text-[13px] font-bold uppercase text-[#3E2723]">Medium</h3>
            <span className="text-lg font-light text-[#3E2723]">−</span>
          </div>

          <ul className="space-y-4">
            {mediums.map((item) => (
              <li
                key={item}
                className="flex items-center group cursor-pointer"
                onClick={() => onMediumToggle(item)}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center border transition-all ${
                    selectedMediums.includes(item)
                      ? 'bg-[#3E2723] border-[#3E2723]'
                      : 'bg-cream border-[#3E2723]/40'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-transform ${
                      selectedMediums.includes(item)
                        ? 'scale-100 bg-cream'
                        : 'scale-0'
                    }`}
                  />
                </div>

                <span
                  className={`text-[13px] font-medium transition-colors ${
                    selectedMediums.includes(item)
                      ? 'text-[#3E2723]'
                      : 'text-[#3E2723]/60'
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex justify-between items-center border-b border-[#3E2723]/20 pb-3 mb-6">
            <h3 className="text-[13px] font-bold uppercase text-[#3E2723]">
              Availability
            </h3>
            <span className="text-lg font-light text-[#3E2723]">−</span>
          </div>

          <ul className="space-y-4">
            {statuses.map((item) => (
              <li
                key={item}
                className="flex items-center group cursor-pointer"
                onClick={() => onStatusToggle(item)}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center border transition-all ${
                    selectedStatuses.includes(item)
                      ? 'bg-[#3E2723] border-[#3E2723]'
                      : 'bg-cream border-[#3E2723]/40'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-transform ${
                      selectedStatuses.includes(item)
                        ? 'scale-100 bg-cream'
                        : 'scale-0'
                    }`}
                  />
                </div>

                <span
                  className={`text-[13px] font-medium transition-colors ${
                    selectedStatuses.includes(item)
                      ? 'text-[#3E2723]'
                      : 'text-[#3E2723]/60'
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
