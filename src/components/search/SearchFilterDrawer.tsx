'use client';

import * as React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { INDIAN_STATES, getCitiesForState } from '@/features/location/indiaLocations';
import { BackendCategory, categoriesService } from '@/features/marketplace/categoriesService';

export interface FilterValues {
  category?: string;
  state?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}

export interface SearchFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
  categories?: BackendCategory[];
}

const SearchFilterDrawerContent: React.FC<Omit<SearchFilterDrawerProps, 'isOpen'>> = ({
  onClose,
  initialFilters,
  onApplyFilters,
  categories: propCategories,
}) => {
  const [category, setCategory] = React.useState(initialFilters.category || '');
  const [selectedState, setSelectedState] = React.useState(initialFilters.state || '');
  const [selectedCity, setSelectedCity] = React.useState(initialFilters.city || '');
  const [minPrice, setMinPrice] = React.useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = React.useState(initialFilters.maxPrice || '');
  const [sortBy, setSortBy] = React.useState<FilterValues['sortBy']>(initialFilters.sortBy || 'newest');
  const [internalCategories, setInternalCategories] = React.useState<BackendCategory[]>([]);

  React.useEffect(() => {
    if (!propCategories || propCategories.length === 0) {
      let isMounted = true;
      categoriesService
        .getCategories('tree')
        .then((cats) => {
          if (isMounted) setInternalCategories(cats || []);
        })
        .catch(() => {
          if (isMounted) setInternalCategories([]);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [propCategories]);

  const categories = propCategories && propCategories.length > 0 ? propCategories : internalCategories;

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const availableCities = selectedState ? getCitiesForState(selectedState) : [];

  const handleReset = () => {
    setCategory('');
    setSelectedState('');
    setSelectedCity('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters({
      category: category || undefined,
      state: selectedState || undefined,
      city: selectedCity || undefined,
      minPrice: minPrice.trim() || undefined,
      maxPrice: maxPrice.trim() || undefined,
      sortBy: sortBy || 'newest',
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container: Mobile Bottom Sheet / Desktop Centered Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter Listings"
        className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[88vh] md:max-h-[640px] overflow-hidden animate-slide-up"
      >
        {/* Mobile Drag Indicator */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Filters & Sorting
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-orange-600 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  !category
                    ? 'bg-orange-600 text-white border-transparent'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-500'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.slug)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      isSelected
                        ? 'bg-orange-600 text-white border-transparent'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location: State & City */}
          <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Location Filter
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">State</span>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('');
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:border-orange-500"
                >
                  <option value="">All States</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">City / District</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:border-orange-500 disabled:opacity-50"
                >
                  <option value="">{selectedState ? 'All Cities in State' : 'Select State First'}</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Min Price</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="₹ 0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">Max Price</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="₹ Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'newest', label: 'Newest First' },
                { id: 'price_asc', label: 'Price: Low' },
                { id: 'price_desc', label: 'Price: High' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id as FilterValues['sortBy'])}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-colors ${
                    sortBy === opt.id
                      ? 'bg-orange-600 text-white border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export const SearchFilterDrawer: React.FC<SearchFilterDrawerProps> = ({
  isOpen,
  ...rest
}) => {
  if (!isOpen) return null;
  return <SearchFilterDrawerContent {...rest} />;
};
