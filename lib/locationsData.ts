export interface LocationItem {
  id: string
  name: string
  city: string
  type: 'CITY' | 'AREA' | 'SOCIETY'
  displayName: string
  searchKeywords?: string[]
}

export const PAKISTAN_LOCATIONS: LocationItem[] = [
  // ==================== CITIES ====================
  { id: 'city-lahore', name: 'Lahore', city: 'Lahore', type: 'CITY', displayName: 'Lahore (City)' },
  { id: 'city-islamabad', name: 'Islamabad', city: 'Islamabad', type: 'CITY', displayName: 'Islamabad (Capital City)' },
  { id: 'city-rawalpindi', name: 'Rawalpindi', city: 'Rawalpindi', type: 'CITY', displayName: 'Rawalpindi (City)' },
  { id: 'city-karachi', name: 'Karachi', city: 'Karachi', type: 'CITY', displayName: 'Karachi (Metropolis)' },
  { id: 'city-faisalabad', name: 'Faisalabad', city: 'Faisalabad', type: 'CITY', displayName: 'Faisalabad (City)' },
  { id: 'city-multan', name: 'Multan', city: 'Multan', type: 'CITY', displayName: 'Multan (City)' },
  { id: 'city-peshawar', name: 'Peshawar', city: 'Peshawar', type: 'CITY', displayName: 'Peshawar (City)' },
  { id: 'city-quetta', name: 'Quetta', city: 'Quetta', type: 'CITY', displayName: 'Quetta (City)' },
  { id: 'city-[#sahiwal]', name: 'Sahiwal', city: 'Sahiwal', type: 'CITY', displayName: 'Sahiwal (City)' },
  { id: 'city-gujranwala', name: 'Gujranwala', city: 'Gujranwala', type: 'CITY', displayName: 'Gujranwala (City)' },
  { id: 'city-sialkot', name: 'Sialkot', city: 'Sialkot', type: 'CITY', displayName: 'Sialkot (City)' },
  { id: 'city-hyderabad', name: 'Hyderabad', city: 'Hyderabad', type: 'CITY', displayName: 'Hyderabad (City)' },
  { id: 'city-abbottabad', name: 'Abbottabad', city: 'Abbottabad', type: 'CITY', displayName: 'Abbottabad (City)' },
  { id: 'city-bahawalpur', name: 'Bahawalpur', city: 'Bahawalpur', type: 'CITY', displayName: 'Bahawalpur (City)' },
  { id: 'city-sargodha', name: 'Sargodha', city: 'Sargodha', type: 'CITY', displayName: 'Sargodha (City)' },
  { id: 'city-sukkur', name: 'Sukkur', city: 'Sukkur', type: 'CITY', displayName: 'Sukkur (City)' },
  { id: 'city-larkana', name: 'Larkana', city: 'Larkana', type: 'CITY', displayName: 'Larkana (City)' },
  { id: 'city-sheikhupura', name: 'Sheikhupura', city: 'Sheikhupura', type: 'CITY', displayName: 'Sheikhupura (City)' },
  { id: 'city-rahim-yar-khan', name: 'Rahim Yar Khan', city: 'Rahim Yar Khan', type: 'CITY', displayName: 'Rahim Yar Khan (City)' },
  { id: 'city-jhelum', name: 'Jhelum', city: 'Jhelum', type: 'CITY', displayName: 'Jhelum (City)' },
  { id: 'city-gujrat', name: 'Gujrat', city: 'Gujrat', type: 'CITY', displayName: 'Gujrat (City)' },
  { id: 'city-okara', name: 'Okara', city: 'Okara', type: 'CITY', displayName: 'Okara (City)' },
  { id: 'city-kasur', name: 'Kasur', city: 'Kasur', type: 'CITY', displayName: 'Kasur (City)' },
  { id: 'city-dg-khan', name: 'Dera Ghazi Khan', city: 'Dera Ghazi Khan', type: 'CITY', displayName: 'Dera Ghazi Khan (City)' },
  { id: 'city-mardan', name: 'Mardan', city: 'Mardan', type: 'CITY', displayName: 'Mardan (City)' },
  { id: 'city-mingora', name: 'Mingora (Swat)', city: 'Mingora', type: 'CITY', displayName: 'Mingora / Swat (City)' },
  { id: 'city-mirpur', name: 'Mirpur (AJK)', city: 'Mirpur', type: 'CITY', displayName: 'Mirpur AJK (City)' },
  { id: 'city-muzaffarabad', name: 'Muzaffarabad', city: 'Muzaffarabad', type: 'CITY', displayName: 'Muzaffarabad AJK (City)' },
  { id: 'city-gilgit', name: 'Gilgit', city: 'Gilgit', type: 'CITY', displayName: 'Gilgit (City)' },
  { id: 'city-skardu', name: 'Skardu', city: 'Skardu', type: 'CITY', displayName: 'Skardu (City)' },
  { id: 'city-gwadar', name: 'Gwadar', city: 'Gwadar', type: 'CITY', displayName: 'Gwadar (Port City)' },
  { id: 'city-wah-cantt', name: 'Wah Cantt', city: 'Wah Cantt', type: 'CITY', displayName: 'Wah Cantt (City)' },
  { id: 'city-murree', name: 'Murree', city: 'Murree', type: 'CITY', displayName: 'Murree (Hill Station)' },
  { id: 'city-chiniot', name: 'Chiniot', city: 'Chiniot', type: 'CITY', displayName: 'Chiniot (City)' },

  // ==================== LAHORE SOCIETIES & AREAS ====================
  { id: 'lahore-dha', name: 'DHA Lahore', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Lahore (Society, Lahore)' },
  { id: 'lahore-dha-ph1', name: 'DHA Phase 1', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 1 (Society, Lahore)' },
  { id: 'lahore-dha-ph2', name: 'DHA Phase 2', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 2 (Society, Lahore)' },
  { id: 'lahore-dha-ph3', name: 'DHA Phase 3', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 3 (Society, Lahore)' },
  { id: 'lahore-dha-ph4', name: 'DHA Phase 4', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 4 (Society, Lahore)' },
  { id: 'lahore-dha-ph5', name: 'DHA Phase 5', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 5 (Society, Lahore)' },
  { id: 'lahore-dha-ph6', name: 'DHA Phase 6', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 6 (Society, Lahore)' },
  { id: 'lahore-dha-ph7', name: 'DHA Phase 7', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 7 (Society, Lahore)' },
  { id: 'lahore-dha-ph8', name: 'DHA Phase 8', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 8 (Society, Lahore)' },
  { id: 'lahore-dha-ph9', name: 'DHA Phase 9 Town / Prism', city: 'Lahore', type: 'SOCIETY', displayName: 'DHA Phase 9 (Society, Lahore)' },
  { id: 'lahore-bahria', name: 'Bahria Town Lahore', city: 'Lahore', type: 'SOCIETY', displayName: 'Bahria Town Lahore (Society, Lahore)' },
  { id: 'lahore-johar', name: 'Johar Town', city: 'Lahore', type: 'AREA', displayName: 'Johar Town (Area, Lahore)' },
  { id: 'lahore-gulberg', name: 'Gulberg', city: 'Lahore', type: 'AREA', displayName: 'Gulberg (Area, Lahore)' },
  { id: 'lahore-gulberg-3', name: 'Gulberg III', city: 'Lahore', type: 'AREA', displayName: 'Gulberg III (Area, Lahore)' },
  { id: 'lahore-model-town', name: 'Model Town', city: 'Lahore', type: 'AREA', displayName: 'Model Town (Area, Lahore)' },
  { id: 'lahore-cantt', name: 'Lahore Cantt', city: 'Lahore', type: 'AREA', displayName: 'Lahore Cantt (Area, Lahore)' },
  { id: 'lahore-askari', name: 'Askari Lahore', city: 'Lahore', type: 'SOCIETY', displayName: 'Askari Housing (Society, Lahore)' },
  { id: 'lahore-askari-10', name: 'Askari 10', city: 'Lahore', type: 'SOCIETY', displayName: 'Askari 10 (Society, Lahore)' },
  { id: 'lahore-askari-11', name: 'Askari 11', city: 'Lahore', type: 'SOCIETY', displayName: 'Askari 11 (Society, Lahore)' },
  { id: 'lahore-garden-town', name: 'Garden Town', city: 'Lahore', type: 'AREA', displayName: 'Garden Town (Area, Lahore)' },
  { id: 'lahore-wapda-town', name: 'Wapda Town', city: 'Lahore', type: 'SOCIETY', displayName: 'Wapda Town (Society, Lahore)' },
  { id: 'lahore-faisal-town', name: 'Faisal Town', city: 'Lahore', type: 'AREA', displayName: 'Faisal Town (Area, Lahore)' },
  { id: 'lahore-iqbal-town', name: 'Allama Iqbal Town', city: 'Lahore', type: 'AREA', displayName: 'Allama Iqbal Town (Area, Lahore)' },
  { id: 'lahore-lake-city', name: 'Lake City', city: 'Lahore', type: 'SOCIETY', displayName: 'Lake City (Society, Lahore)' },
  { id: 'lahore-paragon', name: 'Paragon City', city: 'Lahore', type: 'SOCIETY', displayName: 'Paragon City (Society, Lahore)' },
  { id: 'lahore-valencia', name: 'Valencia Town', city: 'Lahore', type: 'SOCIETY', displayName: 'Valencia Town (Society, Lahore)' },
  { id: 'lahore-state-life', name: 'State Life Society', city: 'Lahore', type: 'SOCIETY', displayName: 'State Life Society (Society, Lahore)' },
  { id: 'lahore-park-view', name: 'Park View City Lahore', city: 'Lahore', type: 'SOCIETY', displayName: 'Park View City (Society, Lahore)' },
  { id: 'lahore-cavalry', name: 'Cavalry Ground', city: 'Lahore', type: 'AREA', displayName: 'Cavalry Ground (Area, Lahore)' },
  { id: 'lahore-shadman', name: 'Shadman', city: 'Lahore', type: 'AREA', displayName: 'Shadman (Area, Lahore)' },
  { id: 'lahore-sabzazar', name: 'Sabzazar', city: 'Lahore', type: 'AREA', displayName: 'Sabzazar (Area, Lahore)' },
  { id: 'lahore-samanabad', name: 'Samanabad', city: 'Lahore', type: 'AREA', displayName: 'Samanabad (Area, Lahore)' },
  { id: 'lahore-township', name: 'Township', city: 'Lahore', type: 'AREA', displayName: 'Township (Area, Lahore)' },

  // ==================== ISLAMABAD SOCIETIES & AREAS ====================
  { id: 'isb-dha', name: 'DHA Islamabad', city: 'Islamabad', type: 'SOCIETY', displayName: 'DHA Islamabad (Society, Islamabad)' },
  { id: 'isb-dha-ph1', name: 'DHA Phase 1 Islamabad', city: 'Islamabad', type: 'SOCIETY', displayName: 'DHA Phase 1 (Society, Islamabad)' },
  { id: 'isb-dha-ph2', name: 'DHA Phase 2 Islamabad', city: 'Islamabad', type: 'SOCIETY', displayName: 'DHA Phase 2 (Society, Islamabad)' },
  { id: 'isb-bahria', name: 'Bahria Town Islamabad', city: 'Islamabad', type: 'SOCIETY', displayName: 'Bahria Town (Society, Islamabad)' },
  { id: 'isb-f6', name: 'Sector F-6', city: 'Islamabad', type: 'AREA', displayName: 'Sector F-6 (Area, Islamabad)' },
  { id: 'isb-f7', name: 'Sector F-7', city: 'Islamabad', type: 'AREA', displayName: 'Sector F-7 (Area, Islamabad)' },
  { id: 'isb-f8', name: 'Sector F-8', city: 'Islamabad', type: 'AREA', displayName: 'Sector F-8 (Area, Islamabad)' },
  { id: 'isb-f10', name: 'Sector F-10', city: 'Islamabad', type: 'AREA', displayName: 'Sector F-10 (Area, Islamabad)' },
  { id: 'isb-f11', name: 'Sector F-11', city: 'Islamabad', type: 'AREA', displayName: 'Sector F-11 (Area, Islamabad)' },
  { id: 'isb-g6', name: 'Sector G-6', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-6 (Area, Islamabad)' },
  { id: 'isb-g8', name: 'Sector G-8', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-8 (Area, Islamabad)' },
  { id: 'isb-g9', name: 'Sector G-9', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-9 (Area, Islamabad)' },
  { id: 'isb-g10', name: 'Sector G-10', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-10 (Area, Islamabad)' },
  { id: 'isb-g11', name: 'Sector G-11', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-11 (Area, Islamabad)' },
  { id: 'isb-g13', name: 'Sector G-13', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-13 (Area, Islamabad)' },
  { id: 'isb-g15', name: 'Sector G-15', city: 'Islamabad', type: 'AREA', displayName: 'Sector G-15 (Area, Islamabad)' },
  { id: 'isb-e7', name: 'Sector E-7', city: 'Islamabad', type: 'AREA', displayName: 'Sector E-7 (Area, Islamabad)' },
  { id: 'isb-e11', name: 'Sector E-11', city: 'Islamabad', type: 'AREA', displayName: 'Sector E-11 (Area, Islamabad)' },
  { id: 'isb-i8', name: 'Sector I-8', city: 'Islamabad', type: 'AREA', displayName: 'Sector I-8 (Area, Islamabad)' },
  { id: 'isb-i9', name: 'Sector I-9', city: 'Islamabad', type: 'AREA', displayName: 'Sector I-9 (Area, Islamabad)' },
  { id: 'isb-i10', name: 'Sector I-10', city: 'Islamabad', type: 'AREA', displayName: 'Sector I-10 (Area, Islamabad)' },
  { id: 'isb-d12', name: 'Sector D-12', city: 'Islamabad', type: 'AREA', displayName: 'Sector D-12 (Area, Islamabad)' },
  { id: 'isb-b17', name: 'B-17 Multi Gardens', city: 'Islamabad', type: 'SOCIETY', displayName: 'B-17 Multi Gardens (Society, Islamabad)' },
  { id: 'isb-gulberg-greens', name: 'Gulberg Greens', city: 'Islamabad', type: 'SOCIETY', displayName: 'Gulberg Greens (Society, Islamabad)' },
  { id: 'isb-park-enclave', name: 'Park Enclave', city: 'Islamabad', type: 'SOCIETY', displayName: 'Park Enclave (Society, Islamabad)' },
  { id: 'isb-naval-anchorage', name: 'Naval Anchorage', city: 'Islamabad', type: 'SOCIETY', displayName: 'Naval Anchorage (Society, Islamabad)' },
  { id: 'isb-pwd', name: 'PWD Housing Society', city: 'Islamabad', type: 'SOCIETY', displayName: 'PWD Society (Society, Islamabad)' },
  { id: 'isb-zaraj', name: 'Zaraj Housing Society', city: 'Islamabad', type: 'SOCIETY', displayName: 'Zaraj Housing Society (Society, Islamabad)' },
  { id: 'isb-bani-gala', name: 'Bani Gala', city: 'Islamabad', type: 'AREA', displayName: 'Bani Gala (Area, Islamabad)' },

  // ==================== RAWALPINDI SOCIETIES & AREAS ====================
  { id: 'rwp-bahria', name: 'Bahria Town Rawalpindi', city: 'Rawalpindi', type: 'SOCIETY', displayName: 'Bahria Town (Society, Rawalpindi)' },
  { id: 'rwp-bahria-ph1-6', name: 'Bahria Town Phases 1-6', city: 'Rawalpindi', type: 'SOCIETY', displayName: 'Bahria Phases 1-6 (Society, Rawalpindi)' },
  { id: 'rwp-bahria-ph7-8', name: 'Bahria Town Phase 7 & 8', city: 'Rawalpindi', type: 'SOCIETY', displayName: 'Bahria Phase 7 & 8 (Society, Rawalpindi)' },
  { id: 'rwp-dha', name: 'DHA Rawalpindi', city: 'Rawalpindi', type: 'SOCIETY', displayName: 'DHA Rawalpindi (Society, Rawalpindi)' },
  { id: 'rwp-saddar', name: 'Saddar Rawalpindi', city: 'Rawalpindi', type: 'AREA', displayName: 'Saddar (Area, Rawalpindi)' },
  { id: 'rwp-chaklala', name: 'Chaklala Scheme', city: 'Rawalpindi', type: 'AREA', displayName: 'Chaklala Scheme (Area, Rawalpindi)' },
  { id: 'rwp-westridge', name: 'Westridge', city: 'Rawalpindi', type: 'AREA', displayName: 'Westridge (Area, Rawalpindi)' },
  { id: 'rwp-adyala', name: 'Adyala Road', city: 'Rawalpindi', type: 'AREA', displayName: 'Adyala Road (Area, Rawalpindi)' },
  { id: 'rwp-satellite', name: 'Satellite Town', city: 'Rawalpindi', type: 'AREA', displayName: 'Satellite Town (Area, Rawalpindi)' },
  { id: 'rwp-gulraiz', name: 'Gulraiz Housing Scheme', city: 'Rawalpindi', type: 'SOCIETY', displayName: 'Gulraiz Scheme (Society, Rawalpindi)' },
  { id: 'rwp-peshawar-rd', name: 'Peshawar Road', city: 'Rawalpindi', type: 'AREA', displayName: 'Peshawar Road (Area, Rawalpindi)' },
  { id: 'rwp-commercial-mkt', name: 'Commercial Market', city: 'Rawalpindi', type: 'AREA', displayName: 'Commercial Market (Area, Rawalpindi)' },
  { id: 'rwp-cantt', name: 'Rawalpindi Cantt', city: 'Rawalpindi', type: 'AREA', displayName: 'Rawalpindi Cantt (Area, Rawalpindi)' },

  // ==================== KARACHI SOCIETIES & AREAS ====================
  { id: 'khi-dha', name: 'DHA Karachi', city: 'Karachi', type: 'SOCIETY', displayName: 'DHA Karachi (Society, Karachi)' },
  { id: 'khi-dha-ph8', name: 'DHA Phase 8 Karachi', city: 'Karachi', type: 'SOCIETY', displayName: 'DHA Phase 8 (Society, Karachi)' },
  { id: 'khi-clifton', name: 'Clifton', city: 'Karachi', type: 'AREA', displayName: 'Clifton (Area, Karachi)' },
  { id: 'khi-pechs', name: 'PECHS', city: 'Karachi', type: 'AREA', displayName: 'PECHS (Area, Karachi)' },
  { id: 'khi-gulshan', name: 'Gulshan-e-Iqbal', city: 'Karachi', type: 'AREA', displayName: 'Gulshan-e-Iqbal (Area, Karachi)' },
  { id: 'khi-johar', name: 'Gulistan-e-Johar', city: 'Karachi', type: 'AREA', displayName: 'Gulistan-e-Johar (Area, Karachi)' },
  { id: 'khi-bahria', name: 'Bahria Town Karachi', city: 'Karachi', type: 'SOCIETY', displayName: 'Bahria Town Karachi (Society, Karachi)' },
  { id: 'khi-north-nazimabad', name: 'North Nazimabad', city: 'Karachi', type: 'AREA', displayName: 'North Nazimabad (Area, Karachi)' },
  { id: 'khi-fb-area', name: 'Federal B Area', city: 'Karachi', type: 'AREA', displayName: 'Federal B Area (Area, Karachi)' },
  { id: 'khi-malir-cantt', name: 'Malir Cantt', city: 'Karachi', type: 'AREA', displayName: 'Malir Cantt (Area, Karachi)' },
  { id: 'khi-scheme-33', name: 'Scheme 33', city: 'Karachi', type: 'AREA', displayName: 'Scheme 33 (Area, Karachi)' },
  { id: 'khi-defence-view', name: 'Defence View', city: 'Karachi', type: 'AREA', displayName: 'Defence View (Area, Karachi)' },
  { id: 'khi-korangi', name: 'Korangi', city: 'Karachi', type: 'AREA', displayName: 'Korangi (Area, Karachi)' },
  { id: 'khi-tariq-road', name: 'Tariq Road', city: 'Karachi', type: 'AREA', displayName: 'Tariq Road (Area, Karachi)' },

  // ==================== FAISALABAD SOCIETIES & AREAS ====================
  { id: 'fsd-canal-road', name: 'Canal Road', city: 'Faisalabad', type: 'AREA', displayName: 'Canal Road (Area, Faisalabad)' },
  { id: 'fsd-civil-lines', name: 'Civil Lines', city: 'Faisalabad', type: 'AREA', displayName: 'Civil Lines (Area, Faisalabad)' },
  { id: 'fsd-madina-town', name: 'Madina Town', city: 'Faisalabad', type: 'AREA', displayName: 'Madina Town (Area, Faisalabad)' },
  { id: 'fsd-peoples-colony', name: 'Peoples Colony', city: 'Faisalabad', type: 'AREA', displayName: 'Peoples Colony (Area, Faisalabad)' },
  { id: 'fsd-kohinoor', name: 'Kohinoor City', city: 'Faisalabad', type: 'SOCIETY', displayName: 'Kohinoor City (Society, Faisalabad)' },
  { id: 'fsd-fda-city', name: 'FDA City', city: 'Faisalabad', type: 'SOCIETY', displayName: 'FDA City (Society, Faisalabad)' },
  { id: 'fsd-eden-valley', name: 'Eden Valley', city: 'Faisalabad', type: 'SOCIETY', displayName: 'Eden Valley (Society, Faisalabad)' },

  // ==================== MULTAN SOCIETIES & AREAS ====================
  { id: 'mul-cantt', name: 'Multan Cantt', city: 'Multan', type: 'AREA', displayName: 'Multan Cantt (Area, Multan)' },
  { id: 'mul-model-town', name: 'Model Town Multan', city: 'Multan', type: 'AREA', displayName: 'Model Town (Area, Multan)' },
  { id: 'mul-bosan-road', name: 'Bosan Road', city: 'Multan', type: 'AREA', displayName: 'Bosan Road (Area, Multan)' },
  { id: 'mul-gulgasht', name: 'Gulgasht Colony', city: 'Multan', type: 'AREA', displayName: 'Gulgasht Colony (Area, Multan)' },
  { id: 'mul-dha', name: 'DHA Multan', city: 'Multan', type: 'SOCIETY', displayName: 'DHA Multan (Society, Multan)' },
  { id: 'mul-buch-villas', name: 'Buch Executive Villas', city: 'Multan', type: 'SOCIETY', displayName: 'Buch Executive Villas (Society, Multan)' },

  // ==================== PESHAWAR SOCIETIES & AREAS ====================
  { id: 'pesh-hayatabad', name: 'Hayatabad', city: 'Peshawar', type: 'AREA', displayName: 'Hayatabad (Area, Peshawar)' },
  { id: 'pesh-university-town', name: 'University Town', city: 'Peshawar', type: 'AREA', displayName: 'University Town (Area, Peshawar)' },
  { id: 'pesh-dha', name: 'DHA Peshawar', city: 'Peshawar', type: 'SOCIETY', displayName: 'DHA Peshawar (Society, Peshawar)' },
  { id: 'pesh-cantt', name: 'Peshawar Cantt', city: 'Peshawar', type: 'AREA', displayName: 'Peshawar Cantt (Area, Peshawar)' },
  { id: 'pesh-regi', name: 'Regi Model Town', city: 'Peshawar', type: 'SOCIETY', displayName: 'Regi Model Town (Society, Peshawar)' },

  // ==================== SAHIWAL & GUJRANWALA & SIALKOT ====================
  { id: 'swl-farid-town', name: 'Farid Town', city: 'Sahiwal', type: 'AREA', displayName: 'Farid Town (Area, Sahiwal)' },
  { id: 'swl-scheme-3', name: 'Scheme No 3', city: 'Sahiwal', type: 'AREA', displayName: 'Scheme No 3 (Area, Sahiwal)' },
  { id: 'swl-college-rd', name: 'College Road', city: 'Sahiwal', type: 'AREA', displayName: 'College Road (Area, Sahiwal)' },
  { id: 'grw-dc-colony', name: 'DC Colony', city: 'Gujranwala', type: 'SOCIETY', displayName: 'DC Colony (Society, Gujranwala)' },
  { id: 'grw-citi-housing', name: 'Citi Housing Gujranwala', city: 'Gujranwala', type: 'SOCIETY', displayName: 'Citi Housing (Society, Gujranwala)' },
  { id: 'skt-cantt', name: 'Sialkot Cantt', city: 'Sialkot', type: 'AREA', displayName: 'Sialkot Cantt (Area, Sialkot)' },
  { id: 'skt-kashmir-rd', name: 'Kashmir Road', city: 'Sialkot', type: 'AREA', displayName: 'Kashmir Road (Area, Sialkot)' },
  { id: 'abbt-mandian', name: 'Mandian', city: 'Abbottabad', type: 'AREA', displayName: 'Mandian (Area, Abbottabad)' },
  { id: 'abbt-supply', name: 'Supply Area', city: 'Abbottabad', type: 'AREA', displayName: 'Supply Area (Area, Abbottabad)' },
]

/**
 * Normalizes input string (trims, converts to lower case, collapses extra spaces).
 */
export function normalizeLocationQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Searches locations dataset matching user's query string.
 * Priority: Exact match > Starts-with match > Partial match.
 * Limits results to `limit` items (default 8).
 */
export function searchLocations(query: string, limit: number = 8): LocationItem[] {
  const cleanQuery = normalizeLocationQuery(query)
  if (!cleanQuery) return []

  const exactMatches: LocationItem[] = []
  const startsWithMatches: LocationItem[] = []
  const partialMatches: LocationItem[] = []

  const seenIds = new Set<string>()

  for (const item of PAKISTAN_LOCATIONS) {
    if (seenIds.has(item.id)) continue

    const nameLower = item.name.toLowerCase()
    const cityLower = item.city.toLowerCase()
    const displayLower = item.displayName.toLowerCase()

    if (nameLower === cleanQuery || cityLower === cleanQuery) {
      exactMatches.push(item)
      seenIds.add(item.id)
    } else if (
      nameLower.startsWith(cleanQuery) ||
      cityLower.startsWith(cleanQuery) ||
      displayLower.startsWith(cleanQuery)
    ) {
      startsWithMatches.push(item)
      seenIds.add(item.id)
    } else if (
      nameLower.includes(cleanQuery) ||
      cityLower.includes(cleanQuery) ||
      displayLower.includes(cleanQuery)
    ) {
      partialMatches.push(item)
      seenIds.add(item.id)
    }
  }

  return [...exactMatches, ...startsWithMatches, ...partialMatches].slice(0, limit)
}
