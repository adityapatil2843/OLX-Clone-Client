/**
 * India States and Cities Location Metadata for Bazarr 360
 * Verified India-focused classified discovery.
 */

export interface StateInfo {
  name: string;
  code: string;
  popularCities: string[];
}

export const INDIAN_STATES: StateInfo[] = [
  {
    name: 'Maharashtra',
    code: 'MH',
    popularCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Kolhapur'],
  },
  {
    name: 'Delhi NCR',
    code: 'DL',
    popularCities: ['Delhi', 'New Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'],
  },
  {
    name: 'Karnataka',
    code: 'KA',
    popularCities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Davangere', 'Bellary'],
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    popularCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode'],
  },
  {
    name: 'Telangana',
    code: 'TS',
    popularCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Secunderabad'],
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    popularCities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Bareilly', 'Aligarh'],
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    popularCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'],
  },
  {
    name: 'West Bengal',
    code: 'WB',
    popularCities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur'],
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    popularCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
  },
  {
    name: 'Kerala',
    code: 'KL',
    popularCities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha'],
  },
  {
    name: 'Punjab',
    code: 'PB',
    popularCities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  },
  {
    name: 'Haryana',
    code: 'HR',
    popularCities: ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Rohtak', 'Hisar', 'Panchkula'],
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    popularCities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  },
  {
    name: 'Bihar',
    code: 'BR',
    popularCities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
  },
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    popularCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
  },
  {
    name: 'Odisha',
    code: 'OR',
    popularCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  },
  {
    name: 'Assam',
    code: 'AS',
    popularCities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    popularCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    popularCities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh'],
  },
  {
    name: 'Goa',
    code: 'GA',
    popularCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  },
];

export const POPULAR_CITIES = [
  'All India',
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Lucknow',
];

export function getCitiesForState(stateName: string): string[] {
  if (!stateName || stateName === 'All India') return [];
  const matched = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase() || s.code.toLowerCase() === stateName.toLowerCase()
  );
  return matched ? matched.popularCities : [];
}

export function searchCitiesAndStates(query: string): Array<{ name: string; type: 'city' | 'state'; stateName?: string }> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: Array<{ name: string; type: 'city' | 'state'; stateName?: string }> = [];

  // Match states
  INDIAN_STATES.forEach((st) => {
    if (st.name.toLowerCase().includes(clean)) {
      results.push({ name: st.name, type: 'state' });
    }
    st.popularCities.forEach((city) => {
      if (city.toLowerCase().includes(clean)) {
        results.push({ name: city, type: 'city', stateName: st.name });
      }
    });
  });

  return results.slice(0, 10);
}
