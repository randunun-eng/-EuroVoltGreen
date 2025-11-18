// Product Data
const productData = {
    hybrid_inverters: [
        {
            name: 'MEGA-6KW',
            power: '6KVA/6KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '50-450Vdc',
            features: ['2 Independent AC Inputs', '2 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Function'],
            warranty: '5 years',
            price: '$377',
            dimensions: '521x470x236mm',
            weight: '30kg'
        },
        {
            name: 'MEGA-8KW',
            power: '8KVA/8KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '50-450Vdc',
            features: ['2 Independent AC Inputs', '2 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Function'],
            warranty: '5 years',
            dimensions: '500x483x260mm',
            weight: '38kg'
        },
        {
            name: 'MEGA-10KW',
            power: '10KVA/10KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '50-450Vdc',
            features: ['2 Independent AC Inputs', '2 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Function'],
            warranty: '5 years',
            dimensions: '500x483x260mm',
            weight: '42kg'
        },
        {
            name: 'MAGIC-10KW',
            power: '10KVA/10KW',
            voltage: '230VAC/400VAC (3-Phase)',
            efficiency: '97%',
            mppt_range: '200-800Vdc',
            features: ['3-Phase In/Out', '3 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Operation'],
            warranty: '5 years',
            weight: '48kg'
        },
        {
            name: 'MAGIC-12KW',
            power: '12KVA/12KW',
            voltage: '230VAC/400VAC (3-Phase)',
            efficiency: '97%',
            mppt_range: '200-800Vdc',
            features: ['3-Phase In/Out', '3 MPPT Trackers', 'Touchscreen', 'WiFi Monitoring', 'Parallel Operation'],
            warranty: '5 years',
            weight: '52kg'
        }
    ],

    ongrid_inverters: [
        {
            name: 'MATE-3KW',
            power: '3KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '60-450Vdc',
            features: ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Grid-Tie Ready'],
            warranty: '5 years',
            certifications: ['IEC/62109-1/2', 'IEC 61000-1/3']
        },
        {
            name: 'MATE-6KW',
            power: '6KW',
            voltage: '220/230/240VAC',
            efficiency: '97.3%',
            mppt_range: '60-450Vdc',
            features: ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Dual MPPT'],
            warranty: '5 years',
            certifications: ['IEC/62109-1/2', 'IEC 61000-1/3']
        },
        {
            name: 'MATE-10KW',
            power: '10KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '60-450Vdc',
            features: ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Triple MPPT'],
            warranty: '5 years',
            certifications: ['IEC/62109-1/2', 'IEC 61000-1/3']
        },
        {
            name: 'MATE-15KW',
            power: '15KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '60-450Vdc',
            features: ['High Efficiency', 'IP65 Rating', 'WiFi Monitoring', 'Quad MPPT'],
            warranty: '5 years',
            certifications: ['IEC/62109-1/2', 'IEC 61000-1/3']
        }
    ],

    offgrid_inverters: [
        {
            name: 'META-4KW',
            power: '4KVA/4KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '60-450Vdc',
            features: ['High Motor Capacity', 'WiFi Monitoring', 'Pure Sine Wave', 'UPS Function'],
            warranty: '2 years',
            dimensions: '300x278x106mm',
            weight: '4.92kg'
        },
        {
            name: 'META-6KW',
            power: '6KVA/6KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '60-450Vdc',
            features: ['High Motor Capacity', 'WiFi Monitoring', 'Dual MPPT', 'UPS Function'],
            warranty: '2 years',
            price: '$85',
            dimensions: '316.8x310.6x107.3mm',
            weight: '5.69kg'
        },
        {
            name: 'META-10KW',
            power: '10KVA/10KW',
            voltage: '220/230/240VAC',
            efficiency: '97%',
            mppt_range: '60-450Vdc',
            features: ['High Motor Capacity', 'WiFi Monitoring', 'Triple MPPT', 'UPS Function'],
            warranty: '2 years',
            price: '$112',
            dimensions: '300x278x106mm',
            weight: '4.5kg'
        },
        {
            name: 'PV5000-24L',
            power: '5KVA',
            voltage: '208/220/230/240VAC',
            features: ['Built-in 100A Solar Charger', 'Wide MPPT Range 40-500V', 'Generator Compatible', 'WiFi Monitoring'],
            certifications: ['CE'],
            weight: '64kg'
        },
        {
            name: 'PV9000-24 S5.0',
            power: '5KVA',
            voltage: '220/230/240VAC',
            features: ['Built-in 160A Solar Charger', 'Wide PV Range 60-500V', 'Dual AC Output', 'Feed-in to Grid'],
            weight: '8.4kg'
        }
    ],

    mppt_controllers: [
        {
            name: 'EV-MPPT-30A',
            current: '30A',
            voltage: '12V/24V',
            efficiency: '99.5%',
            mppt_range: '60-150Vdc',
            features: ['Auto Recognition', 'Temperature Compensation', 'USB Monitoring', 'LCD Display'],
            warranty: '5 years'
        },
        {
            name: 'EV-MPPT-60A',
            current: '60A',
            voltage: '12V/24V',
            efficiency: '99.5%',
            mppt_range: '60-150Vdc',
            features: ['Auto Recognition', 'Temperature Compensation', 'USB Monitoring', 'Bluetooth'],
            warranty: '5 years'
        },
        {
            name: 'EV-MPPT-100A',
            current: '100A',
            voltage: '12V/24V/48V',
            efficiency: '99.7%',
            mppt_range: '60-150Vdc',
            features: ['Bluetooth', 'App Control', 'Data Logging', 'Advanced MPPT Algorithm'],
            warranty: '5 years'
        },
        {
            name: 'EV-MPPT-150A',
            current: '150A',
            voltage: '12V/24V/48V',
            efficiency: '99.8%',
            mppt_range: '60-200Vdc',
            features: ['WiFi Monitoring', 'Cloud Connectivity', 'Advanced Analytics', 'Smart Scheduling'],
            warranty: '5 years'
        }
    ],

    pwm_controllers: [
        {
            name: 'EV-PWM-10A',
            current: '10A',
            voltage: '12V/24V',
            features: ['LED Display', 'Overcharge Protection', 'Short Circuit Protection', 'Load Control'],
            warranty: '3 years'
        },
        {
            name: 'EV-PWM-20A',
            current: '20A',
            voltage: '12V/24V',
            features: ['LCD Display', 'USB Output', 'Timer Control', 'Temperature Compensation'],
            warranty: '3 years'
        },
        {
            name: 'EV-PWM-30A',
            current: '30A',
            voltage: '12V/24V',
            features: ['LED Display', 'Overcharge Protection', 'Timer Control', 'Manual Control'],
            warranty: '3 years'
        },
        {
            name: 'EV-PWM-50A',
            current: '50A',
            voltage: '12V/24V',
            features: ['LCD Display', 'USB Output', 'Load Control', 'Data Logging'],
            warranty: '3 years'
        },
        {
            name: 'EV-PWM-60A',
            current: '60A',
            voltage: '12V/24V/48V',
            features: ['Large LCD Display', 'Dual USB Output', 'Remote Monitoring', 'Programmable Settings'],
            warranty: '3 years'
        }
    ]
};

// Roadmap Data
const roadmapData = [
    {
        year: 2020,
        title: 'Foundation & Technology Base',
        achievements: [
            'Established R&D center in Shenzhen',
            'Launched first MPPT controller series',
            'Partnership with NEXT Solar',
            'ISO 9001 certification achieved'
        ]
    },
    {
        year: 2021,
        title: 'Product Expansion',
        achievements: [
            'Introduced hybrid inverter line',
            'Collaboration with POWMr and SUMRy',
            'Expanded manufacturing capacity by 200%',
            'CE and UL certifications obtained'
        ]
    },
    {
        year: 2022,
        title: 'Innovation & Quality',
        achievements: [
            'Smart monitoring systems integrated',
            'Partnership with EASUN and MUST',
            'Advanced testing laboratory established',
            'Energy storage solutions developed'
        ]
    },
    {
        year: 2023,
        title: 'Global Expansion',
        achievements: [
            'International distribution network',
            'ANERN strategic partnership',
            'AI-powered monitoring platform',
            'Sustainable manufacturing practices'
        ]
    },
    {
        year: 2024,
        title: 'Digital Transformation',
        achievements: [
            'IoT-enabled product ecosystem',
            'Cloud-based monitoring platform',
            'Advanced battery management systems',
            'Industry 4.0 manufacturing upgrade'
        ]
    },
    {
        year: 2025,
        title: 'Future Technologies',
        goals: [
            'Next-generation inverter technology',
            'Solid-state battery integration',
            'AI-optimized energy management',
            'Carbon-neutral manufacturing'
        ]
    }
];
