'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Search, Check, Navigation, RotateCcw } from 'lucide-react';
import { INDIAN_STATES, POPULAR_CITIES, getCitiesForState, searchCitiesAndStates } from '@/features/location/indiaLocations';

export interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity?: string;
  selectedState?: string;
  onSelectLocation: (location: { city?: string; state?: string }) => void;
}

const LocationSelectorModalContent: React.FC<Omit<LocationSelectorModalProps, 'isOpen'>> = ({
  onClose,
  selectedCity = 'All India',
  selectedState = '',
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeState, setActiveState] = React.useState(selectedState || '');
  const [gpsLoading, setGpsLoading] = React.useState(false);
  const [gpsError, setGpsError] = React.useState<string | null>(null);

  // Lock body scroll while modal is open
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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

  const handleSelectAllIndia = () => {
    onSelectLocation({ city: undefined, state: undefined });
    onClose();
  };

  const handleSelectCity = (city: string, stateName?: string) => {
    if (city === 'All India') {
      handleSelectAllIndia();
      return;
    }
    onSelectLocation({ city, state: stateName || activeState || undefined });
    onClose();
  };

  const handleSelectState = (stateName: string) => {
    setActiveState(stateName);
  };

  // Explicit user-initiated GPS location detection (consent safe)
  const handleDetectLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setGpsLoading(false);
        setGpsError('Location detected! Please select your closest city from the list below.');
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please choose your city manually.');
        } else {
          setGpsError('Could not determine current location. Please choose manually.');
        }
      },
      { timeout: 8000 }
    );
  };

  const searchResults = searchQuery.trim() ? searchCitiesAndStates(searchQuery) : [];
  const stateCities = activeState ? getCitiesForState(activeState) : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
        className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh] md:max-h-[600px] overflow-hidden animate-slide-up"
      >
        {/* Mobile Drag Indicator */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <h2 id="location-modal-title" className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Select Location
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {(selectedCity !== 'All India' || selectedState) && (
              <button
                type="button"
                onClick={handleSelectAllIndia}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 px-2.5 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to All India</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close location selector"
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, district, or state..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* User Consent GPS Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline disabled:opacity-50"
            >
              <Navigation className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>{gpsLoading ? 'Detecting location...' : 'Use current location (GPS)'}</span>
            </button>
            <span className="text-[10px] text-zinc-400">Consent required</span>
          </div>
          {gpsError && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">{gpsError}</p>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {/* Active Search Results */}
          {searchQuery.trim() ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block px-1">
                Matching Results
              </span>
              {searchResults.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">
                  No cities found matching &quot;{searchQuery}&quot;.
                </p>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    onClick={() => {
                      if (item.type === 'city') {
                        handleSelectCity(item.name, item.stateName);
                      } else {
                        handleSelectState(item.name);
                        setSearchQuery('');
                      }
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</span>
                      {item.stateName && (
                        <span className="text-zinc-400 text-[11px]">in {item.stateName}</span>
                      )}
                      {item.type === 'state' && (
                        <span className="text-[10px] bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold px-1.5 py-0.5 rounded-md">
                          State
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Popular Cities Horizontal Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block px-1">
                  Popular Metro Cities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.map((city) => {
                    const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-orange-600 text-white border-transparent shadow-xs'
                            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{city}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* State Accordion / Drilldown */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    All Indian States
                  </span>
                  {activeState && (
                    <button
                      type="button"
                      onClick={() => setActiveState('')}
                      className="text-[11px] font-semibold text-orange-600 hover:underline"
                    >
                      Show All States
                    </button>
                  )}
                </div>

                {activeState ? (
                  <div className="space-y-2 bg-orange-50/50 dark:bg-orange-950/20 p-3 rounded-2xl border border-orange-100 dark:border-orange-900/40">
                    <div className="flex items-center justify-between pb-1 border-b border-orange-200/60 dark:border-orange-900/40">
                      <span className="text-xs font-black text-orange-900 dark:text-orange-200">
                        Cities in {activeState}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectLocation({ state: activeState, city: undefined });
                          onClose();
                        }}
                        className="text-[11px] font-bold text-orange-600 hover:underline"
                      >
                        Select Entire State →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {stateCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleSelectCity(city, activeState)}
                          className={`p-2 rounded-xl text-left text-xs font-semibold hover:bg-orange-100/60 dark:hover:bg-orange-900/40 transition-colors flex items-center justify-between ${
                            selectedCity.toLowerCase() === city.toLowerCase()
                              ? 'text-orange-700 dark:text-orange-300 font-bold'
                              : 'text-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          <span className="truncate">{city}</span>
                          {selectedCity.toLowerCase() === city.toLowerCase() && (
                            <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {INDIAN_STATES.map((state) => (
                      <button
                        key={state.code}
                        type="button"
                        onClick={() => handleSelectState(state.name)}
                        className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-200 text-left transition-colors group"
                      >
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 block truncate">
                          {state.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 block truncate">
                          {state.popularCities.slice(0, 2).join(', ')}...
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = (props) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!props.isOpen || !mounted) return null;

  return createPortal(
    <LocationSelectorModalContent {...props} />,
    document.body
  );
};
