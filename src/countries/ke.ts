import type { CountryPack } from './types';

/**
 * KENYA - demo Country Pack.
 * ILLUSTRATIVE CONFIGURATION - requires local legal validation.
 * Provider names are plain text only; no logos, brands or state marks are used.
 * Mobile-money first and low-bandwidth UI are enabled for this market.
 */
export const KE: CountryPack = {
  code: 'KE',
  name: { en: 'Kenya', sw: 'Kenya' },
  defaultLocale: 'en',
  locales: ['en', 'sw'],
  intlRegion: 'KE',
  currency: { code: 'KES', symbol: 'KSh', decimals: 0 },
  fees: { customerPct: 0.05, workerPct: 0.06, minFee: 50, payoutFee: 30 },
  newAccountJobCap: 2,
  autoReleaseDays: 2,
  companyApprovalThreshold: 50000,
  identity: {
    providerName: 'National digital ID',
    levels: [
      {
        level: 0,
        label: { en: 'Phone or email confirmed', sw: 'Simu au barua pepe imethibitishwa' },
        steps: [
          { en: 'Enter your phone number', sw: 'Weka nambari yako ya simu' },
          { en: 'Enter the one-time code', sw: 'Weka msimbo wa matumizi moja' },
        ],
      },
      {
        level: 1,
        label: { en: 'Document and selfie checked', sw: 'Hati na picha ya selfie zimekaguliwa' },
        steps: [
          { en: 'Photograph your national ID card', sw: 'Piga picha ya kitambulisho chako cha taifa' },
          { en: 'Take a selfie for a liveness check', sw: 'Piga selfie ili kuthibitisha kuwa ni wewe halisi' },
          { en: 'Wait for the automatic check', sw: 'Subiri ukaguzi wa kiotomatiki' },
        ],
      },
      {
        level: 2,
        label: { en: 'National digital ID confirmed', sw: 'Kitambulisho cha kidijitali cha taifa kimethibitishwa' },
        steps: [
          { en: 'Enter your ID number', sw: 'Weka nambari ya kitambulisho chako' },
          { en: 'Approve the data-sharing request on your phone', sw: 'Kubali ombi la kushiriki data kwenye simu yako' },
          { en: 'We receive only the verification result', sw: 'Tunapokea matokeo ya uthibitisho pekee' },
        ],
      },
      {
        level: 3,
        label: { en: 'Licence or permit confirmed', sw: 'Leseni au kibali kimethibitishwa' },
        steps: [
          { en: 'Choose the regulated trade', sw: 'Chagua kazi inayodhibitiwa' },
          { en: 'Upload your licence', sw: 'Pakia leseni yako' },
          { en: 'Manual review by the operations team', sw: 'Ukaguzi wa mkono na timu ya jukwaa' },
        ],
      },
    ],
    note: {
      en: 'Digital ID integration is illustrative. Access conditions for private services must be confirmed with the provider.',
      sw: 'Muunganisho wa kitambulisho cha kidijitali ni wa mfano tu. Masharti ya matumizi kwa huduma za kibinafsi lazima yathibitishwe na mtoa huduma.',
    },
    privacyNote: {
      en: 'We store only the verification result, not your documents.',
      sw: 'Tunahifadhi matokeo ya uthibitisho pekee, si hati zako.',
    },
  },
  payments: {
    partnerName: 'Partner PSP Kenya (illustrative)',
    protectedPaymentLabel: { en: 'Protected payment', sw: 'Malipo yaliyolindwa' },
    payoutMethods: [
      {
        id: 'ke-mobile',
        kind: 'mobile_money',
        label: { en: 'Mobile money wallet', sw: 'Pochi ya pesa kwa simu' },
        eta: { en: 'Within minutes', sw: 'Ndani ya dakika chache' },
        extraFee: 0,
      },
      {
        id: 'ke-bank',
        kind: 'bank_transfer',
        label: { en: 'Bank transfer', sw: 'Uhamisho wa benki' },
        eta: { en: '1-2 business days', sw: 'Siku 1-2 za kazi' },
        extraFee: 0,
      },
    ],
    cryptoEnabled: false,
    mobileMoneyFirst: true,
  },
  tax: {
    workerStatuses: [
      {
        id: 'ke-sole-trader',
        label: { en: 'Registered sole trader (illustrative)', sw: 'Mfanyabiashara binafsi aliyesajiliwa (mfano)' },
        hint: {
          en: 'Registered business name; issues receipts and files returns itself (illustrative).',
          sw: 'Jina la biashara lililosajiliwa; hutoa risiti na huwasilisha ritani mwenyewe (mfano).',
        },
      },
      {
        id: 'ke-individual-pin',
        label: { en: 'Individual with tax PIN (illustrative)', sw: 'Mtu binafsi mwenye PIN ya kodi (mfano)' },
        hint: {
          en: 'Individual earning income under a personal tax PIN. Obligations must be confirmed with a tax adviser.',
          sw: 'Mtu binafsi anayepata mapato kwa PIN yake ya kodi. Wajibu wake lazima uthibitishwe na mshauri wa kodi.',
        },
      },
    ],
    note: {
      en: 'Tax hints are informational only. The worker is responsible for declaring income. Not tax advice.',
      sw: 'Vidokezo vya kodi ni kwa taarifa tu. Mfanyakazi ana jukumu la kutangaza mapato yake. Huu si ushauri wa kodi.',
    },
    documentTemplates: [
      {
        id: 'ke-agreement',
        kind: 'agreement',
        title: { en: 'Service agreement', sw: 'Mkataba wa huduma' },
        body: {
          en: 'SERVICE AGREEMENT No. {{docNumber}}\n{{city}}, {{date}}\n\nCustomer: {{customerName}}\nContractor: {{workerName}} ({{workerStatus}})\n\n1. Subject: {{taskTitle}}.\n2. Price: {{amount}}. Platform service fee for the customer: {{customerFee}}. Total payable: {{customerPays}}.\n3. Payment is held as a {{protectedPaymentLabel}} by {{partnerName}} and released after acceptance.\n4. Milestones:\n{{milestones}}\n5. If the customer does not respond within {{autoReleaseDays}} days after delivery, funds are released automatically unless a dispute is opened.\n6. Disputes are resolved under the {{brand}} rules.\n\nSigned electronically in the prototype (test mode).',
          sw: 'MKATABA WA HUDUMA Na. {{docNumber}}\n{{city}}, {{date}}\n\nMteja: {{customerName}}\nMkandarasi: {{workerName}} ({{workerStatus}})\n\n1. Kazi: {{taskTitle}}.\n2. Bei: {{amount}}. Ada ya huduma ya jukwaa kwa mteja: {{customerFee}}. Jumla ya kulipa: {{customerPays}}.\n3. Malipo yanashikiliwa kama "{{protectedPaymentLabel}}" na {{partnerName}} na kutolewa baada ya kazi kukubaliwa.\n4. Hatua za kazi:\n{{milestones}}\n5. Mteja asipojibu ndani ya siku {{autoReleaseDays}} baada ya kazi kukabidhiwa, pesa zitatolewa kiotomatiki isipokuwa mgogoro umefunguliwa.\n6. Migogoro inatatuliwa kwa mujibu wa kanuni za {{brand}}.\n\nImetiwa saini kielektroniki katika mfano huu (hali ya majaribio).',
        },
      },
      {
        id: 'ke-act',
        kind: 'completion_act',
        title: { en: 'Completion certificate', sw: 'Cheti cha kukamilisha kazi' },
        body: {
          en: 'COMPLETION CERTIFICATE No. {{docNumber}}\n{{city}}, {{date}}\n\nThe Contractor {{workerName}} has performed and the Customer {{customerName}} has accepted the work: {{taskTitle}}.\nAmount of work: {{amount}}.\nThe parties have no claims against each other.\n\nAccepted in the prototype (test mode).',
          sw: 'CHETI CHA KUKAMILISHA KAZI Na. {{docNumber}}\n{{city}}, {{date}}\n\nMkandarasi {{workerName}} amekamilisha na Mteja {{customerName}} amekubali kazi: {{taskTitle}}.\nThamani ya kazi: {{amount}}.\nPande zote hazina madai dhidi ya mwenzake.\n\nImekubaliwa katika mfano huu (hali ya majaribio).',
        },
      },
      {
        id: 'ke-receipt',
        kind: 'receipt',
        title: { en: 'Receipt', sw: 'Risiti' },
        body: {
          en: 'RECEIPT No. {{docNumber}} of {{date}}\n\nReceived by: {{workerName}} ({{workerStatus}})\nPaid by: {{customerName}}\nService: {{taskTitle}}\nAmount: {{amount}}\nPlatform fee withheld from the contractor: {{workerFee}}\nPaid out to the contractor: {{workerReceives}}\nPayment processed by {{partnerName}}.\n\nSimulated document - not valid for accounting.',
          sw: 'RISITI Na. {{docNumber}} ya {{date}}\n\nImepokelewa na: {{workerName}} ({{workerStatus}})\nImelipwa na: {{customerName}}\nHuduma: {{taskTitle}}\nKiasi: {{amount}}\nAda ya jukwaa iliyokatwa kwa mkandarasi: {{workerFee}}\nKiasi alicholipwa mkandarasi: {{workerReceives}}\nMalipo yameshughulikiwa na {{partnerName}}.\n\nHati ya mfano - si halali kwa uhasibu.',
        },
      },
    ],
  },
  categories: [
    {
      id: 'repair',
      label: { en: 'Construction and repair', sw: 'Ujenzi na ukarabati' },
      icon: 'Hammer',
      priceGuide: { min: 3000, max: 200000 },
      templates: [
        {
          id: 'ke-repair-1',
          title: { en: 'Fix a leaking iron-sheet roof', sw: 'Rekebisha paa la mabati linalovuja' },
          description: { en: 'Replace 6 rusted sheets and reseal nails before the rains.', sw: 'Badilisha mabati 6 yaliyoshika kutu na uzibe misumari kabla ya mvua.' },
          durationHours: 6,
        },
        {
          id: 'ke-repair-2',
          title: { en: 'Build a block perimeter wall section', sw: 'Jenga sehemu ya ukuta wa matofali wa mzunguko' },
          description: { en: 'About 10 m of wall, 2 m high; blocks and cement are on site.', sw: 'Takriban mita 10 za ukuta, urefu wa mita 2; matofali na saruji vipo.' },
          durationHours: 24,
        },
        {
          id: 'ke-repair-3',
          title: { en: 'Repair a shop roller door', sw: 'Rekebisha mlango wa kuviringisha wa duka' },
          description: { en: 'Door is stuck halfway; needs new springs and greasing.', sw: 'Mlango umekwama katikati; unahitaji springi mpya na grisi.' },
          durationHours: 3,
        },
      ],
    },
    {
      id: 'painting',
      label: { en: 'Painting and finishing', sw: 'Upakaji rangi na umaliziaji' },
      icon: 'PaintRoller',
      priceGuide: { min: 8000, max: 150000 },
      templates: [
        {
          id: 'ke-paint-flagship',
          title: { en: 'Repaint 24 storage racks at a workshop', sw: 'Paka upya rangi rafu 24 za kuhifadhia katika karakana' },
          description: {
            en: 'Metal racks 2 m high. Sanding, primer and two coats of paint. Paint is provided by the customer.',
            sw: 'Rafu za chuma zenye urefu wa mita 2. Kusugua, rangi ya msingi na tabaka mbili za rangi. Rangi itatolewa na mteja.',
          },
          durationHours: 24,
        },
        {
          id: 'ke-paint-2',
          title: { en: 'Paint a two-bedroom apartment', sw: 'Paka rangi nyumba ya vyumba viwili vya kulala' },
          description: { en: 'About 90 m² of walls, light colours.', sw: 'Takriban mita za mraba 90 za kuta, rangi nyepesi.' },
          durationHours: 16,
        },
        {
          id: 'ke-paint-3',
          title: { en: 'Paint the exterior of a small shop', sw: 'Paka rangi nje ya duka dogo' },
          description: { en: 'Front wall and shutters; weather-resistant paint.', sw: 'Ukuta wa mbele na milango ya chuma; rangi inayostahimili hali ya hewa.' },
          durationHours: 8,
        },
      ],
    },
    {
      id: 'moving',
      label: { en: 'Logistics and moving', sw: 'Usafirishaji na kuhama' },
      icon: 'Truck',
      priceGuide: { min: 2000, max: 60000 },
      templates: [
        {
          id: 'ke-move-1',
          title: { en: 'Move a one-bedroom house with a pickup', sw: 'Hamisha nyumba ya chumba kimoja kwa pickup' },
          description: { en: 'Two helpers and a pickup truck, within the same estate area.', sw: 'Wasaidizi wawili na gari la pickup, ndani ya eneo moja la mtaa.' },
          durationHours: 4,
        },
        {
          id: 'ke-move-2',
          title: { en: 'Unload a delivery truck at a warehouse', sw: 'Pakua lori la mizigo ghalani' },
          description: { en: 'About 60 sacks and boxes, handcart available.', sw: 'Takriban magunia na makasha 60, mkokoteni upo.' },
          durationHours: 3,
        },
      ],
    },
    {
      id: 'cleaning',
      label: { en: 'Cleaning', sw: 'Usafi' },
      icon: 'Sparkles',
      priceGuide: { min: 1500, max: 30000 },
      templates: [
        {
          id: 'ke-clean-1',
          title: { en: 'Post-construction cleaning of a house', sw: 'Usafi wa nyumba baada ya ujenzi' },
          description: { en: 'Three-bedroom house, windows and floors included.', sw: 'Nyumba ya vyumba vitatu vya kulala, pamoja na madirisha na sakafu.' },
          durationHours: 6,
        },
        {
          id: 'ke-clean-2',
          title: { en: 'Clean a rooftop water tank', sw: 'Safisha tangi la maji la juu ya paa' },
          description: { en: '5,000-litre tank: drain, scrub and rinse.', sw: 'Tangi la lita 5,000: kumwaga maji, kusugua na kusuuza.' },
          durationHours: 3,
        },
      ],
    },
    {
      id: 'installation',
      label: { en: 'Solar and appliance installation', sw: 'Ufungaji wa sola na vifaa' },
      icon: 'Wrench',
      priceGuide: { min: 2500, max: 120000 },
      templates: [
        {
          id: 'ke-inst-1',
          title: { en: 'Mount solar panels on a house roof', sw: 'Funga paneli za sola kwenye paa la nyumba' },
          description: { en: 'Four panels with a battery and inverter; equipment is on site.', sw: 'Paneli nne pamoja na betri na inverta; vifaa vipo.' },
          durationHours: 6,
        },
        {
          id: 'ke-inst-2',
          title: { en: 'Install a water tank on a raised stand', sw: 'Funga tangi la maji juu ya kinara' },
          description: { en: '2,000-litre tank, connect inlet and outlet pipes.', sw: 'Tangi la lita 2,000, unganisha mabomba ya kuingiza na kutoa maji.' },
          durationHours: 4,
        },
        {
          id: 'ke-inst-3',
          title: { en: 'Install a gas cooker and check for leaks', sw: 'Funga jiko la gesi na kukagua uvujaji' },
          description: { en: 'Connect regulator and hose; customer has the cylinder.', sw: 'Unganisha regulator na mpira; mteja ana mtungi.' },
          durationHours: 2,
        },
      ],
    },
    {
      id: 'electrical',
      label: { en: 'Electrical work', sw: 'Kazi za umeme' },
      icon: 'Zap',
      priceGuide: { min: 2000, max: 80000 },
      templates: [
        {
          id: 'ke-elec-1',
          title: { en: 'Rewire a small shop', sw: 'Weka upya nyaya za umeme katika duka dogo' },
          description: { en: 'New sockets, lighting and a consumer unit with 6 breakers.', sw: 'Soketi mpya, taa na kisanduku cha umeme chenye swichi 6 za usalama.' },
          durationHours: 8,
        },
      ],
    },
  ],
  regulatedTrades: [
    {
      categoryId: 'electrical',
      permitName: { en: 'Electrical worker licence (illustrative)', sw: 'Leseni ya fundi umeme (mfano)' },
    },
  ],
  priorityPrograms: [
    {
      id: 'youth',
      label: { en: 'Youth 18-29', sw: 'Vijana wa miaka 18-29' },
      description: { en: 'Young people starting their working life.', sw: 'Vijana wanaoanza maisha ya kazi.' },
      verificationSource: { en: 'Date of birth from the identity check', sw: 'Tarehe ya kuzaliwa kutoka kwa ukaguzi wa utambulisho' },
      benefits: [
        { en: 'Reduced worker fee for the first 6 months (illustrative)', sw: 'Ada iliyopunguzwa kwa mfanyakazi kwa miezi 6 ya kwanza (mfano)' },
        { en: 'Starter tasks and skills badges', sw: 'Kazi za kuanzia na beji za ujuzi' },
      ],
    },
    {
      id: 'women_crews',
      label: { en: 'Women-led crews', sw: 'Vikundi vinavyoongozwa na wanawake' },
      description: { en: 'Work crews led by women in any trade.', sw: 'Vikundi vya kazi vinavyoongozwa na wanawake katika fani yoyote.' },
      verificationSource: { en: 'Crew profile and leader identity check (illustrative)', sw: 'Wasifu wa kikundi na ukaguzi wa utambulisho wa kiongozi (mfano)' },
      benefits: [{ en: 'Highlighted in company tenders', sw: 'Kuangaziwa katika zabuni za makampuni' }],
    },
    {
      id: 'disability',
      label: { en: 'People with disabilities', sw: 'Watu wenye ulemavu' },
      description: { en: 'Workers with a confirmed disability status who opt in.', sw: 'Wafanyakazi wenye hali ya ulemavu iliyothibitishwa waliokubali kushiriki.' },
      verificationSource: { en: 'Official disability card, manual review (illustrative)', sw: 'Kadi rasmi ya ulemavu, ukaguzi wa mkono (mfano)' },
      benefits: [{ en: 'Accessible task matching filters', sw: 'Vichujio vya kazi zinazofikika' }],
    },
  ],
  cities: [
    { id: 'nairobi', name: { en: 'Nairobi', sw: 'Nairobi' }, x: 54, y: 64, districts: ['Westlands', 'Embakasi', 'Kasarani', 'Kibera'] },
    { id: 'mombasa', name: { en: 'Mombasa', sw: 'Mombasa' }, x: 82, y: 88, districts: ['Nyali', 'Likoni', 'Kisauni'] },
    { id: 'kisumu', name: { en: 'Kisumu', sw: 'Kisumu' }, x: 16, y: 54, districts: ['Milimani', 'Nyalenda', 'Kondele'] },
    { id: 'nakuru', name: { en: 'Nakuru', sw: 'Nakuru' }, x: 38, y: 52, districts: ['Lanet', 'Shabab', 'Milimani'] },
    { id: 'eldoret', name: { en: 'Eldoret', sw: 'Eldoret' }, x: 26, y: 38, districts: ['Langas', 'Kapsoya', 'Pioneer'] },
    { id: 'thika', name: { en: 'Thika', sw: 'Thika' }, x: 58, y: 56, districts: ['Makongeni', 'Section 9'] },
  ],
  emergencyNumber: '999',
  legalNotices: [
    {
      en: 'Funds are held and transferred by a licensed payment partner, not by the platform (illustrative arrangement).',
      sw: 'Pesa zinashikiliwa na kuhamishwa na mshirika wa malipo mwenye leseni, si na jukwaa (mpangilio wa mfano).',
    },
    {
      en: 'Workers are independent contractors. Classification rules must be validated by a local lawyer.',
      sw: 'Wafanyakazi ni wakandarasi huru. Kanuni za uainishaji lazima zithibitishwe na wakili wa ndani.',
    },
    {
      en: 'Personal data processing must follow local data-protection law.',
      sw: 'Uchakataji wa data binafsi lazima ufuate sheria ya ndani ya ulinzi wa data.',
    },
  ],
  lowBandwidthMode: true,
};
