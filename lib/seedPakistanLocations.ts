import { prisma } from './db/client'

export interface LocationSeedProvince {
  name: string
  code: string
  districts: {
    name: string
    cities: {
      name: string
      areas?: string[]
    }[]
  }[]
}

export const PAKISTAN_LOCATION_TREE: LocationSeedProvince[] = [
  {
    name: 'Punjab',
    code: 'PB',
    districts: [
      {
        name: 'Lahore',
        cities: [
          {
            name: 'Lahore',
            areas: [
              'Johar Town',
              'Gulberg',
              'Gulberg III',
              'Model Town',
              'DHA Phase 1',
              'DHA Phase 2',
              'DHA Phase 3',
              'DHA Phase 4',
              'DHA Phase 5',
              'DHA Phase 6',
              'DHA Phase 7',
              'DHA Phase 8',
              'DHA Phase 9',
              'Bahria Town Lahore',
              'Askari Housing',
              'Askari 10',
              'Askari 11',
              'Garden Town',
              'Wapda Town',
              'Faisal Town',
              'Allama Iqbal Town',
              'Lake City',
              'Paragon City',
              'Valencia Town',
              'State Life Society',
              'Park View City Lahore',
              'Cavalry Ground',
              'Shadman',
              'Sabzazar',
              'Samanabad',
              'Township',
              'Lahore Cantt',
              'Architects Society',
              'LDA Avenue',
            ],
          },
        ],
      },
      {
        name: 'Rawalpindi',
        cities: [
          {
            name: 'Rawalpindi',
            areas: [
              'Saddar',
              'Bahria Town Rawalpindi',
              'DHA Phase 1 Rawalpindi',
              'DHA Phase 2 Rawalpindi',
              'Satellite Town',
              'Chaklala Scheme 3',
              'Gulraiz Housing Scheme',
              'Westridge',
              'Adyala Road',
              'Peshawar Road',
              'Commercial Market',
              'Bahria Town Phase 8',
              'Askari 14',
            ],
          },
          { name: 'Murree', areas: ['Mall Road', 'Bhurban', 'Ghora Gali', 'Kuldana'] },
          { name: 'Wah Cantt', areas: ['Lala Rukh', 'Nawababad', 'Model Town Wah'] },
          { name: 'Gujar Khan', areas: ['Main Bazar', 'Station Road'] },
          { name: 'Taxila', areas: ['Heavy Mechanical Complex', 'Museum Road'] },
        ],
      },
      {
        name: 'Faisalabad',
        cities: [
          {
            name: 'Faisalabad',
            areas: [
              'D Ground',
              'People Colony',
              'Gulberg Faisalabad',
              'Madina Town',
              'Civil Lines',
              'Canal Road',
              'Samanabad Faisalabad',
              'Eden Garden',
              'FDA City',
              'Wapda Town Faisalabad',
            ],
          },
        ],
      },
      {
        name: 'Multan',
        cities: [
          {
            name: 'Multan',
            areas: [
              'Gulgasht Colony',
              'Cantt Multan',
              'Bosan Road',
              'Model Town Multan',
              'Wapda Town Multan',
              'Shah Rukn-e-Alam Colony',
              'DHA Multan',
              'Buch Executive Villas',
            ],
          },
        ],
      },
      {
        name: 'Gujranwala',
        cities: [
          {
            name: 'Gujranwala',
            areas: ['Model Town', 'DC Colony', 'Wapda Town', 'Garden Town', 'People Colony', 'Master City', 'Satellite Town'],
          },
          { name: 'Kamoke' },
        ],
      },
      {
        name: 'Sialkot',
        cities: [
          {
            name: 'Sialkot',
            areas: ['Cantt Sialkot', 'Model Town', 'Citi Housing', 'Kashmir Road', 'Defense Road', 'Ugoki'],
          },
          { name: 'Daska' },
          { name: 'Pasrur' },
        ],
      },
      {
        name: 'Bahawalpur',
        cities: [{ name: 'Bahawalpur', areas: ['Model Town A', 'Model Town B', 'Cantonment', 'DHA Bahawalpur', 'Dubai Palace Road'] }],
      },
      {
        name: 'Sargodha',
        cities: [{ name: 'Sargodha', areas: ['University Road', 'Satellite Town', 'New Satellite Town', 'Cantonment'] }],
      },
      {
        name: 'Gujrat',
        cities: [{ name: 'Gujrat', areas: ['G.T. Road', 'Court Road', 'Services Colony', 'Rehman Shaheed Road'] }],
      },
      {
        name: 'Sheikhupura',
        cities: [{ name: 'Sheikhupura', areas: ['Housing Colony', 'Civil Lines', 'Sargodha Road'] }],
      },
      {
        name: 'Jhelum',
        cities: [{ name: 'Jhelum', areas: ['Cantt Jhelum', 'Citi Housing Jhelum', 'G.T. Road'] }],
      },
      {
        name: 'Attock',
        cities: [{ name: 'Attock', areas: ['Civil Lines', 'Kamra Road'] }],
      },
      {
        name: 'Chakwal',
        cities: [{ name: 'Chakwal', areas: ['Talagang Road', 'Pinwal'] }],
      },
      { name: 'Mianwali', cities: [{ name: 'Mianwali' }] },
      { name: 'Khushab', cities: [{ name: 'Khushab' }, { name: 'Jauharabad' }] },
      { name: 'Mandi Bahauddin', cities: [{ name: 'Mandi Bahauddin' }] },
      { name: 'Hafizabad', cities: [{ name: 'Hafizabad' }] },
      { name: 'Narowal', cities: [{ name: 'Narowal' }] },
      { name: 'Kasur', cities: [{ name: 'Kasur' }] },
      { name: 'Okara', cities: [{ name: 'Okara' }, { name: 'Renala Khurd' }] },
      { name: 'Sahiwal', cities: [{ name: 'Sahiwal', areas: ['Farid Town', 'Scheme No. 3', 'Girls College Road'] }] },
      { name: 'Pakpattan', cities: [{ name: 'Pakpattan' }] },
      { name: 'Vehari', cities: [{ name: 'Vehari' }, { name: 'Burewala' }] },
      { name: 'Khanewal', cities: [{ name: 'Khanewal' }] },
      { name: 'Lodhran', cities: [{ name: 'Lodhran' }] },
      { name: 'Dera Ghazi Khan', cities: [{ name: 'Dera Ghazi Khan', areas: ['Khyaban-e-Sarwar', 'Model Town'] }] },
      { name: 'Muzaffargarh', cities: [{ name: 'Muzaffargarh' }] },
      { name: 'Layyah', cities: [{ name: 'Layyah' }] },
      { name: 'Rajanpur', cities: [{ name: 'Rajanpur' }] },
      { name: 'Rahim Yar Khan', cities: [{ name: 'Rahim Yar Khan', areas: ['Model Town', 'Town Hall Road', 'Airport Road'] }] },
      { name: 'Toba Tek Singh', cities: [{ name: 'Toba Tek Singh' }, { name: 'Gojra' }] },
      { name: 'Jhang', cities: [{ name: 'Jhang', areas: ['Civil Lines', 'Saddar'] }] },
      { name: 'Chiniot', cities: [{ name: 'Chiniot' }] },
      { name: 'Bhakkar', cities: [{ name: 'Bhakkar' }] },
    ],
  },
  {
    name: 'Sindh',
    code: 'SD',
    districts: [
      {
        name: 'Karachi South',
        cities: [
          {
            name: 'Karachi',
            areas: [
              'Clifton',
              'Clifton Block 2',
              'Clifton Block 5',
              'Defence (DHA Karachi)',
              'DHA Phase 1 Karachi',
              'DHA Phase 2 Karachi',
              'DHA Phase 4 Karachi',
              'DHA Phase 5 Karachi',
              'DHA Phase 6 Karachi',
              'DHA Phase 7 Karachi',
              'DHA Phase 8 Karachi',
              'Saddar',
              'Bath Island',
              'Civil Lines',
            ],
          },
        ],
      },
      {
        name: 'Karachi East',
        cities: [
          {
            name: 'Karachi East',
            areas: [
              'Gulshan-e-Iqbal',
              'Gulshan Block 13',
              'Gulistan-e-Jauhar',
              'Jauhar Block 12',
              'PECHS',
              'Tariq Road',
              'Bahadurabad',
              'Karsaz',
            ],
          },
        ],
      },
      {
        name: 'Karachi Central',
        cities: [
          {
            name: 'Karachi Central',
            areas: ['North Nazimabad', 'Federal B Area', 'Nazimabad', 'Liaquatabad', 'Buffer Zone'],
          },
        ],
      },
      {
        name: 'Malir',
        cities: [
          {
            name: 'Malir Karachi',
            areas: ['Bahria Town Karachi', 'Malir Cantt', 'Model Colony', 'Airport Security Force Colony', 'Gadap'],
          },
        ],
      },
      {
        name: 'Hyderabad',
        cities: [
          {
            name: 'Hyderabad',
            areas: ['Latifabad', 'Qasimabad', 'Auto Bhan Road', 'Saddar Hyderabad', 'Citizen Colony'],
          },
        ],
      },
      { name: 'Sukkur', cities: [{ name: 'Sukkur', areas: ['Military Road', 'Minara Road', 'New Sukkur'] }] },
      { name: 'Larkana', cities: [{ name: 'Larkana', areas: ['VVIP Road', 'Resham Gali'] }] },
      { name: 'Nawabshah', cities: [{ name: 'Nawabshah (Shaheed Benazirabad)' }] },
      { name: 'Mirpur Khas', cities: [{ name: 'Mirpur Khas' }] },
      { name: 'Jacobabad', cities: [{ name: 'Jacobabad' }] },
      { name: 'Shikarpur', cities: [{ name: 'Shikarpur' }] },
      { name: 'Khairpur', cities: [{ name: 'Khairpur' }] },
      { name: 'Thatta', cities: [{ name: 'Thatta' }] },
      { name: 'Badin', cities: [{ name: 'Badin' }] },
      { name: 'Dadu', cities: [{ name: 'Dadu' }] },
      { name: 'Sanghar', cities: [{ name: 'Sanghar' }] },
      { name: 'Umerkot', cities: [{ name: 'Umerkot' }] },
      { name: 'Ghotki', cities: [{ name: 'Ghotki' }] },
      { name: 'Jamshoro', cities: [{ name: 'Jamshoro', areas: ['Sindh University Colony', 'Kotri'] }] },
      { name: 'Matiari', cities: [{ name: 'Matiari' }] },
      { name: 'Tando Allahyar', cities: [{ name: 'Tando Allahyar' }] },
      { name: 'Tando Muhammad Khan', cities: [{ name: 'Tando Muhammad Khan' }] },
    ],
  },
  {
    name: 'Khyber Pakhtunkhwa',
    code: 'KP',
    districts: [
      {
        name: 'Peshawar',
        cities: [
          {
            name: 'Peshawar',
            areas: [
              'Hayatabad',
              'Hayatabad Phase 1',
              'Hayatabad Phase 3',
              'Hayatabad Phase 5',
              'University Town',
              'Peshawar Cantt',
              'G.T. Road Peshawar',
              'Warsak Road',
              'Gulbahar',
              'Regi Model Town',
            ],
          },
        ],
      },
      {
        name: 'Abbottabad',
        cities: [
          {
            name: 'Abbottabad',
            areas: ['Supply', 'Mandian', 'Jinnahabad', 'Cantt Abbottabad', 'Mansehra Road', 'Kakul Road'],
          },
        ],
      },
      {
        name: 'Mardan',
        cities: [{ name: 'Mardan', areas: ['Nowshera Road', 'Sheikh Maltoon Town', 'Cantt Mardan'] }],
      },
      { name: 'Swabi', cities: [{ name: 'Swabi' }, { name: 'Topi' }] },
      { name: 'Nowshera', cities: [{ name: 'Nowshera', areas: ['Nowshera Cantt', 'Risalpur'] }] },
      { name: 'Kohat', cities: [{ name: 'Kohat', areas: ['KDA Kohat', 'Cantt Kohat'] }] },
      { name: 'Dera Ismail Khan', cities: [{ name: 'Dera Ismail Khan', areas: ['Circular Road', 'Town Hall'] }] },
      { name: 'Bannu', cities: [{ name: 'Bannu' }] },
      { name: 'Charsadda', cities: [{ name: 'Charsadda' }] },
      { name: 'Mansehra', cities: [{ name: 'Mansehra' }, { name: 'Balakot' }] },
      { name: 'Haripur', cities: [{ name: 'Haripur', areas: ['Main Bazar', 'Khalabat Township'] }] },
      { name: 'Swat', cities: [{ name: 'Mingora', areas: ['Saidu Sharif', 'Kabal Road', 'Fizagat'] }, { name: 'Kalam' }] },
      { name: 'Dir Lower', cities: [{ name: 'Timergara' }] },
      { name: 'Dir Upper', cities: [{ name: 'Dir' }] },
      { name: 'Chitral', cities: [{ name: 'Chitral' }] },
      { name: 'Kurram', cities: [{ name: 'Parachinar' }] },
      { name: 'Karak', cities: [{ name: 'Karak' }] },
      { name: 'Lakki Marwat', cities: [{ name: 'Lakki Marwat' }] },
    ],
  },
  {
    name: 'Balochistan',
    code: 'BA',
    districts: [
      {
        name: 'Quetta',
        cities: [
          {
            name: 'Quetta',
            areas: [
              'Quetta Cantt',
              'Zarghoon Road',
              'Satellite Town Quetta',
              'Jinnah Road',
              'Chaman Housing Scheme',
              'Model Town Quetta',
              'Samungli Road',
            ],
          },
        ],
      },
      {
        name: 'Gwadar',
        cities: [
          {
            name: 'Gwadar',
            areas: ['Sangar Housing Project', 'Marine Drive', 'New Town Gwadar', 'Airport Road Gwadar'],
          },
        ],
      },
      { name: 'Kech', cities: [{ name: 'Turbat' }] },
      { name: 'Khuzdar', cities: [{ name: 'Khuzdar' }] },
      { name: 'Chaman', cities: [{ name: 'Chaman' }] },
      { name: 'Sibi', cities: [{ name: 'Sibi' }] },
      { name: 'Zhob', cities: [{ name: 'Zhob' }] },
      { name: 'Loralai', cities: [{ name: 'Loralai' }] },
      { name: 'Nasirabad', cities: [{ name: 'Dera Murad Jamali' }] },
      { name: 'Lasbela', cities: [{ name: 'Hub', areas: ['Hub Industrial Trading Estate', 'Civic Centre'] }] },
    ],
  },
  {
    name: 'Islamabad Capital Territory',
    code: 'ICT',
    districts: [
      {
        name: 'Islamabad',
        cities: [
          {
            name: 'Islamabad',
            areas: [
              'Sector F-6',
              'Sector F-7',
              'Sector F-8',
              'Sector F-10',
              'Sector F-11',
              'Sector G-6',
              'Sector G-7',
              'Sector G-8',
              'Sector G-9',
              'Sector G-10',
              'Sector G-11',
              'Sector G-13',
              'Sector G-15',
              'Sector E-7',
              'Sector E-11',
              'Sector I-8',
              'Sector I-9',
              'Sector I-10',
              'DHA Islamabad',
              'DHA Phase 1 Islamabad',
              'DHA Phase 2 Islamabad',
              'Bahria Town Islamabad',
              'Gulberg Greens',
              'Park View City Islamabad',
              'Blue Area',
              'Bani Gala',
              'PWD Housing Scheme',
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Azad Jammu & Kashmir',
    code: 'AJK',
    districts: [
      { name: 'Muzaffarabad', cities: [{ name: 'Muzaffarabad', areas: ['Plateau', 'Upper Chattar', 'Bank Road'] }] },
      { name: 'Mirpur', cities: [{ name: 'Mirpur', areas: ['Sector F-1', 'Sector F-2', 'Chittarpuri'] }] },
      { name: 'Rawalakot', cities: [{ name: 'Rawalakot' }] },
      { name: 'Kotli', cities: [{ name: 'Kotli' }] },
      { name: 'Bagh', cities: [{ name: 'Bagh' }] },
      { name: 'Bhimber', cities: [{ name: 'Bhimber' }] },
    ],
  },
  {
    name: 'Gilgit-Baltistan',
    code: 'GB',
    districts: [
      { name: 'Gilgit', cities: [{ name: 'Gilgit', areas: ['Jutial', 'Nagaral', 'Airport Road'] }] },
      { name: 'Skardu', cities: [{ name: 'Skardu', areas: ['Main Bazar', 'Satpara Road'] }] },
      { name: 'Hunza', cities: [{ name: 'Karimabad', areas: ['Baltit', 'Altit'] }, { name: 'Aliabad' }] },
      { name: 'Ghizer', cities: [{ name: 'Gahkuch' }] },
      { name: 'Diamer', cities: [{ name: 'Chilas' }] },
      { name: 'Nagar', cities: [{ name: 'Nagar' }] },
      { name: 'Astore', cities: [{ name: 'Astore' }] },
      { name: 'Ghanche', cities: [{ name: 'Khaplu' }] },
      { name: 'Shigar', cities: [{ name: 'Shigar' }] },
    ],
  },
]

export const DEFAULT_SERVICE_CATEGORIES = [
  { name: 'Electrician', slug: 'electrician', description: 'Wiring, fan repair, circuit breaker, light fixture & electrical troubleshooting', icon: 'Zap', sortOrder: 1 },
  { name: 'Plumber', slug: 'plumber', description: 'Pipe leak fix, tap replacement, bathroom fittings, drain unblocking & kitchen sink repair', icon: 'Wrench', sortOrder: 2 },
  { name: 'AC Technician', slug: 'ac-technician', description: 'AC servicing, gas refilling, split AC installation, inverter AC repair & cooling fix', icon: 'Wind', sortOrder: 3 },
  { name: 'Painter', slug: 'painter', description: 'Indoor & outdoor wall painting, wall putty, texture paint, waterproofing & wood polish', icon: 'Paintbrush', sortOrder: 4 },
  { name: 'Carpenter', slug: 'carpenter', description: 'Furniture repair, door lock installation, wooden cabinets, wardrobe fix & custom woodwork', icon: 'Hammer', sortOrder: 5 },
  { name: 'Mason / Civil Worker', slug: 'mason', description: 'Wall construction, plaster repair, brickwork, concrete work & home renovation', icon: 'Building', sortOrder: 6 },
  { name: 'Tile & Marble Worker', slug: 'tile-worker', description: 'Tile laying, marble polishing, bathroom tile installation & floor restoration', icon: 'Grid', sortOrder: 7 },
  { name: 'Refrigerator Technician', slug: 'refrigerator-technician', description: 'Fridge cooling repair, compressor replacement, thermostat fix & gas refill', icon: 'Tv', sortOrder: 8 },
  { name: 'Washing Machine Technician', slug: 'washing-machine-technician', description: 'Automatic & manual washing machine motor repair, spin/wash drum fix & PCB board repair', icon: 'RefreshCw', sortOrder: 9 },
  { name: 'Generator Technician', slug: 'generator-technician', description: 'Petrol & diesel generator servicing, ATS panel installation, oil change & motor repair', icon: 'Cpu', sortOrder: 10 },
  { name: 'Solar System Technician', slug: 'solar-technician', description: 'Solar panel installation, net metering, inverter configuration & battery maintenance', icon: 'Sun', sortOrder: 11 },
  { name: 'Pest Control', slug: 'pest-control', description: 'Termite treatment, cockroach spray, bedbug eradication & general pest control', icon: 'ShieldAlert', sortOrder: 12 },
  { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', description: 'Underground & overhead water tank chemical washing, disinfection & sludge removal', icon: 'Droplets', sortOrder: 13 },
  { name: 'Geyser Technician', slug: 'geyser-technician', description: 'Gas & electric geyser installation, element replacement, thermostat fix & burner cleaning', icon: 'Flame', sortOrder: 14 },
  { name: 'Handyman / General Repair', slug: 'handyman', description: 'General home repairs, curtain rod mounting, picture hanging & minor fix-its', icon: 'Tool', sortOrder: 15 },
  { name: 'Deep Cleaning Services', slug: 'cleaning', description: 'Full home deep cleaning, sofa cleaning, carpet shampooing & kitchen degreasing', icon: 'Sparkles', sortOrder: 16 },
  { name: 'Moving & Loading', slug: 'moving-loading', description: 'Home shifting, furniture packing, pickup truck loading & relocation services', icon: 'Truck', sortOrder: 17 },
  { name: 'Internet & Network Technician', slug: 'internet-network', description: 'WiFi router setup, fiber optic cabling, LAN network wiring & signal boosting', icon: 'Wifi', sortOrder: 18 },
  { name: 'CCTV Camera Technician', slug: 'cctv-technician', description: 'Security camera installation, DVR/NVR configuration, mobile live view setup & wire fixing', icon: 'Video', sortOrder: 19 },
  { name: 'Locksmith', slug: 'locksmith', description: 'Key duplication, emergency door opening, smart lock installation & master key system', icon: 'Key', sortOrder: 20 },
  { name: 'Glass & Aluminium Worker', slug: 'glass-aluminium', description: 'Aluminium window fabrication, glass shower cabin, mirror fitting & partition wall', icon: 'Maximize', sortOrder: 21 },
  { name: 'Welder / Iron Worker', slug: 'welder', description: 'Main gate welding, iron grill repair, metal railing & structural welding', icon: 'Flame', sortOrder: 22 },
  { name: 'Roofer / Leak Proofing', slug: 'roofer', description: 'Roof seepage treatment, heat proofing coat, roof tile repair & gutter clearing', icon: 'Home', sortOrder: 23 },
  { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Microwave oven, kitchen hood, water dispenser & general home appliance fix', icon: 'Tv', sortOrder: 24 },
  { name: 'Other Configurable Services', slug: 'other-services', description: 'Custom home service requests not listed in standard categories', icon: 'MoreHorizontal', sortOrder: 25 },
]

export async function seedPakistanLocations() {
  console.log('Seeding Pakistan location hierarchy...')
  for (const provData of PAKISTAN_LOCATION_TREE) {
    const province = await prisma.locationProvince.upsert({
      where: { code: provData.code },
      update: { name: provData.name },
      create: { name: provData.name, code: provData.code },
    })

    for (const distData of provData.districts) {
      const district = await prisma.locationDistrict.upsert({
        where: {
          provinceId_name: {
            provinceId: province.id,
            name: distData.name,
          },
        },
        update: {},
        create: {
          name: distData.name,
          provinceId: province.id,
        },
      })

      for (const cityData of distData.cities) {
        let city = await prisma.locationCity.findFirst({
          where: {
            name: cityData.name,
            provinceId: province.id,
          },
        })

        if (!city) {
          city = await prisma.locationCity.create({
            data: {
              name: cityData.name,
              provinceId: province.id,
              districtId: district.id,
            },
          })
        }

        if (cityData.areas && cityData.areas.length > 0) {
          for (const areaName of cityData.areas) {
            const existingArea = await prisma.locationArea.findFirst({
              where: {
                name: areaName,
                cityId: city.id,
              },
            })

            if (!existingArea) {
              await prisma.locationArea.create({
                data: {
                  name: areaName,
                  cityId: city.id,
                  districtId: district.id,
                },
              })
            }
          }
        }
      }
    }
  }
  console.log('Pakistan location hierarchy seeded successfully.')
}

export async function seedServiceCategories() {
  console.log('Seeding default service categories...')
  for (const cat of DEFAULT_SERVICE_CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        isSystemDefault: true,
        isActive: true,
      },
    })
  }

  // Ensure default platform fee config exists
  await prisma.platformFeeConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      feeType: 'PERCENTAGE',
      percentage: 10.0,
      fixedAmount: 0.0,
      overdueDays: 7,
      blockThresholdDays: 14,
    },
  })

  console.log('Service categories & platform fee config seeded successfully.')
}
