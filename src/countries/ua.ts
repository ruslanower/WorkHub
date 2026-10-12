import type { CountryPack } from './types';

/**
 * UKRAINE - demo Country Pack.
 * ILLUSTRATIVE CONFIGURATION - requires local legal validation.
 * Provider names are plain text only; no logos or state marks are used.
 */
export const UA: CountryPack = {
  code: 'UA',
  name: { en: 'Ukraine', uk: 'Україна' },
  defaultLocale: 'uk',
  locales: ['uk', 'en'],
  intlRegion: 'UA',
  currency: { code: 'UAH', symbol: '₴', decimals: 2 },
  fees: { customerPct: 0.05, workerPct: 0.07, minFee: 20, payoutFee: 0 },
  newAccountJobCap: 2,
  autoReleaseDays: 3,
  companyApprovalThreshold: 20000,
  identity: {
    providerName: 'Diia',
    levels: [
      {
        level: 0,
        label: { en: 'Phone or email confirmed', uk: 'Телефон або e-mail підтверджено' },
        steps: [
          { en: 'Enter your phone number', uk: 'Введіть номер телефону' },
          { en: 'Enter the one-time code', uk: 'Введіть одноразовий код' },
        ],
      },
      {
        level: 1,
        label: { en: 'Document and selfie checked', uk: 'Документ і селфі перевірено' },
        steps: [
          { en: 'Photograph your ID document', uk: 'Сфотографуйте документ, що посвідчує особу' },
          { en: 'Take a selfie for a liveness check', uk: 'Зробіть селфі для перевірки «живої» особи' },
          { en: 'Wait for the automatic check', uk: 'Дочекайтеся автоматичної перевірки' },
        ],
      },
      {
        level: 2,
        label: { en: 'State digital ID (Diia) confirmed', uk: 'Державний цифровий ID (Дія) підтверджено' },
        steps: [
          { en: 'Open the Diia app on your phone', uk: 'Відкрийте застосунок Дія на телефоні' },
          { en: 'Scan the QR code and approve data sharing', uk: 'Відскануйте QR-код і погодьте передачу даних' },
          { en: 'We receive only the verification result', uk: 'Ми отримуємо лише результат перевірки' },
        ],
      },
      {
        level: 3,
        label: { en: 'Licence or permit confirmed', uk: 'Ліцензію або допуск підтверджено' },
        steps: [
          { en: 'Choose the regulated trade', uk: 'Оберіть регульований вид робіт' },
          { en: 'Upload the permit or qualification certificate', uk: 'Завантажте допуск або посвідчення кваліфікації' },
          { en: 'Manual review by the operations team', uk: 'Ручна перевірка командою платформи' },
        ],
      },
    ],
    note: {
      en: 'Digital ID integration is illustrative. Access conditions for private services must be confirmed with the provider.',
      uk: 'Інтеграція цифрового ID ілюстративна. Умови доступу для приватних сервісів треба погодити з провайдером.',
    },
    privacyNote: {
      en: 'We store only the verification result, not your documents.',
      uk: 'Ми зберігаємо лише результат перевірки, а не ваші документи.',
    },
  },
  payments: {
    partnerName: 'Partner PSP Ukraine (illustrative)',
    protectedPaymentLabel: { en: 'Protected payment', uk: 'Захищена оплата' },
    payoutMethods: [
      { id: 'ua-card', kind: 'card', label: { en: 'Bank card', uk: 'Банківська картка' }, eta: { en: 'Within minutes', uk: 'Протягом кількох хвилин' }, extraFee: 5 },
      { id: 'ua-iban', kind: 'iban', label: { en: 'IBAN transfer', uk: 'Переказ на IBAN' }, eta: { en: '1 business day', uk: '1 робочий день' }, extraFee: 0 },
    ],
    cryptoEnabled: false,
    mobileMoneyFirst: false,
  },
  tax: {
    workerStatuses: [
      {
        id: 'ua-fop',
        label: { en: 'Sole proprietor (FOP)', uk: 'ФОП' },
        hint: { en: 'Issues invoices and pays taxes under the simplified system (illustrative).', uk: 'Виставляє рахунки й сплачує податки на спрощеній системі (ілюстративно).' },
      },
      {
        id: 'ua-self',
        label: { en: 'Self-employed individual (illustrative)', uk: 'Самозайнята особа (ілюстративно)' },
        hint: { en: 'Status to be confirmed by a local tax adviser.', uk: 'Статус треба підтвердити з місцевим податковим консультантом.' },
      },
    ],
    note: {
      en: 'Tax hints are informational only. The worker is responsible for declaring income. Not tax advice.',
      uk: 'Податкові підказки мають лише інформаційний характер. Виконавець самостійно декларує дохід. Це не податкова консультація.',
    },
    documentTemplates: [
      {
        id: 'ua-agreement',
        kind: 'agreement',
        title: { en: 'Service agreement', uk: 'Договір про надання послуг' },
        body: {
          en: 'SERVICE AGREEMENT No. {{docNumber}}\n{{city}}, {{date}}\n\nCustomer: {{customerName}}\nContractor: {{workerName}} ({{workerStatus}})\n\n1. Subject: {{taskTitle}}.\n2. Price: {{amount}}. Platform service fee for the customer: {{customerFee}}. Total payable: {{customerPays}}.\n3. Payment is held as a {{protectedPaymentLabel}} by {{partnerName}} and released after acceptance.\n4. Milestones:\n{{milestones}}\n5. If the customer does not respond within {{autoReleaseDays}} days after delivery, funds are released automatically unless a dispute is opened.\n6. Disputes are resolved under the {{brand}} rules.\n\nSigned electronically in the prototype (test mode).',
          uk: 'ДОГОВІР ПРО НАДАННЯ ПОСЛУГ № {{docNumber}}\n{{city}}, {{date}}\n\nЗамовник: {{customerName}}\nВиконавець: {{workerName}} ({{workerStatus}})\n\n1. Предмет: {{taskTitle}}.\n2. Вартість: {{amount}}. Сервісний збір платформи для замовника: {{customerFee}}. Разом до сплати: {{customerPays}}.\n3. Кошти утримуються як «{{protectedPaymentLabel}}» платіжним партнером {{partnerName}} і виплачуються після прийняття робіт.\n4. Етапи:\n{{milestones}}\n5. Якщо замовник не відповідає протягом {{autoReleaseDays}} днів після здачі, кошти виплачуються автоматично, якщо не відкрито спір.\n6. Спори вирішуються за правилами {{brand}}.\n\nПідписано електронно в прототипі (тестовий режим).',
        },
      },
      {
        id: 'ua-act',
        kind: 'completion_act',
        title: { en: 'Completion act', uk: 'Акт виконаних робіт' },
        body: {
          en: 'COMPLETION ACT No. {{docNumber}}\n{{city}}, {{date}}\n\nThe Contractor {{workerName}} has performed and the Customer {{customerName}} has accepted the work: {{taskTitle}}.\nAmount of work: {{amount}}.\nThe parties have no claims against each other.\n\nAccepted in the prototype (test mode).',
          uk: 'АКТ ВИКОНАНИХ РОБІТ № {{docNumber}}\n{{city}}, {{date}}\n\nВиконавець {{workerName}} виконав, а Замовник {{customerName}} прийняв роботи: {{taskTitle}}.\nВартість робіт: {{amount}}.\nСторони претензій одна до одної не мають.\n\nПрийнято в прототипі (тестовий режим).',
        },
      },
      {
        id: 'ua-invoice',
        kind: 'invoice',
        title: { en: 'Invoice', uk: 'Рахунок' },
        body: {
          en: 'INVOICE No. {{docNumber}} of {{date}}\n\nSeller: {{workerName}} ({{workerStatus}})\nBuyer: {{customerName}}\nService: {{taskTitle}}\nAmount: {{amount}}\nPlatform fee withheld from the contractor: {{workerFee}}\nPaid out to the contractor: {{workerReceives}}\nPayment processed by {{partnerName}}.\n\nSimulated document - not valid for accounting.',
          uk: 'РАХУНОК № {{docNumber}} від {{date}}\n\nПостачальник: {{workerName}} ({{workerStatus}})\nПокупець: {{customerName}}\nПослуга: {{taskTitle}}\nСума: {{amount}}\nКомісія платформи з виконавця: {{workerFee}}\nВиплачено виконавцю: {{workerReceives}}\nПлатіж оброблено: {{partnerName}}.\n\nСимульований документ - не має бухгалтерської сили.',
        },
      },
    ],
  },
  categories: [
    {
      id: 'repair',
      label: { en: 'Construction and repair', uk: 'Будівництво та ремонт' },
      icon: 'Hammer',
      priceGuide: { min: 1500, max: 40000 },
      templates: [
        { id: 'ua-repair-1', title: { en: 'Replace a damaged section of drywall', uk: 'Замінити пошкоджену ділянку гіпсокартону' }, description: { en: 'About 4 m² of drywall in a hallway needs replacing and finishing.', uk: 'Потрібно замінити й зашпаклювати близько 4 м² гіпсокартону в коридорі.' }, durationHours: 6 },
        { id: 'ua-repair-2', title: { en: 'Lay laminate flooring in one room', uk: 'Покласти ламінат в одній кімнаті' }, description: { en: 'Room of 16 m², materials are on site.', uk: 'Кімната 16 м², матеріали на місці.' }, durationHours: 8 },
        { id: 'ua-repair-3', title: { en: 'Repair a warehouse door frame', uk: 'Відремонтувати дверну раму на складі' }, description: { en: 'Metal frame is bent; needs straightening and re-fixing.', uk: 'Металева рама погнута, потрібно вирівняти й закріпити.' }, durationHours: 4 },
      ],
    },
    {
      id: 'painting',
      label: { en: 'Painting and finishing', uk: 'Фарбування та оздоблення' },
      icon: 'PaintRoller',
      priceGuide: { min: 2000, max: 30000 },
      templates: [
        { id: 'ua-paint-flagship', title: { en: 'Repaint 24 storage racks at a workshop', uk: 'Перефарбувати 24 складські стелажі в майстерні' }, description: { en: 'Metal racks 2 m high. Sanding, primer and two coats of paint. Paint is provided by the customer.', uk: 'Металеві стелажі висотою 2 м. Шліфування, ґрунт і два шари фарби. Фарбу надає замовник.' }, durationHours: 24 },
        { id: 'ua-paint-2', title: { en: 'Paint walls in a two-room apartment', uk: 'Пофарбувати стіни у двокімнатній квартирі' }, description: { en: 'About 90 m² of walls, light colours.', uk: 'Близько 90 м² стін, світлі кольори.' }, durationHours: 16 },
      ],
    },
    {
      id: 'moving',
      label: { en: 'Logistics and moving', uk: 'Логістика та переїзди' },
      icon: 'Truck',
      priceGuide: { min: 800, max: 8000 },
      templates: [
        { id: 'ua-move-1', title: { en: 'Help moving an office of 6 desks', uk: 'Допомогти з переїздом офісу на 6 робочих місць' }, description: { en: 'Two movers and a van, 3rd floor with a lift.', uk: 'Два вантажники та бус, 3-й поверх, є ліфт.' }, durationHours: 5 },
        { id: 'ua-move-2', title: { en: 'Unload a delivery truck at a warehouse', uk: 'Розвантажити вантажівку на складі' }, description: { en: 'About 40 boxes, pallet jack available.', uk: 'Близько 40 коробок, є рокла.' }, durationHours: 3 },
      ],
    },
    {
      id: 'cleaning',
      label: { en: 'Cleaning', uk: 'Прибирання' },
      icon: 'Sparkles',
      priceGuide: { min: 600, max: 6000 },
      templates: [
        { id: 'ua-clean-1', title: { en: 'Post-renovation cleaning of an apartment', uk: 'Прибирання квартири після ремонту' }, description: { en: '60 m², windows included.', uk: '60 м², разом із вікнами.' }, durationHours: 6 },
        { id: 'ua-clean-2', title: { en: 'Weekly office cleaning', uk: 'Щотижневе прибирання офісу' }, description: { en: 'Office of 120 m², every Friday evening.', uk: 'Офіс 120 м², щоп’ятниці ввечері.' }, durationHours: 3 },
      ],
    },
    {
      id: 'installation',
      label: { en: 'Installation and maintenance', uk: 'Монтаж і обслуговування' },
      icon: 'Wrench',
      priceGuide: { min: 700, max: 12000 },
      templates: [
        { id: 'ua-inst-1', title: { en: 'Install a backup power station and wiring kit', uk: 'Встановити резервну зарядну станцію та комплект під’єднання' }, description: { en: 'Customer has the equipment; needs safe mounting.', uk: 'Обладнання є, потрібен безпечний монтаж.' }, durationHours: 3 },
        { id: 'ua-inst-2', title: { en: 'Service two air conditioners', uk: 'Обслуговування двох кондиціонерів' }, description: { en: 'Cleaning and refrigerant check.', uk: 'Чистка та перевірка фреону.' }, durationHours: 2 },
      ],
    },
    {
      id: 'electrical',
      label: { en: 'Electrical work', uk: 'Електромонтажні роботи' },
      icon: 'Zap',
      priceGuide: { min: 800, max: 15000 },
      templates: [
        { id: 'ua-elec-1', title: { en: 'Replace the distribution board', uk: 'Замінити електрощиток' }, description: { en: 'Apartment board with 8 breakers.', uk: 'Квартирний щиток на 8 автоматів.' }, durationHours: 4 },
      ],
    },
  ],
  regulatedTrades: [
    { categoryId: 'electrical', permitName: { en: 'Electrical safety qualification group (illustrative)', uk: 'Група з електробезпеки (ілюстративно)' } },
  ],
  priorityPrograms: [
    {
      id: 'veterans',
      label: { en: 'Veterans', uk: 'Ветерани' },
      description: { en: 'People with confirmed veteran status.', uk: 'Особи з підтвердженим статусом ветерана.' },
      verificationSource: { en: 'Veteran status via state digital ID (illustrative)', uk: 'Статус ветерана через державний цифровий ID (ілюстративно)' },
      benefits: [
        { en: 'Reduced worker fee for the first 6 months (illustrative)', uk: 'Знижена комісія для виконавця перші 6 місяців (ілюстративно)' },
        { en: 'Free Pro plan for 3 months', uk: 'Безкоштовний план Pro на 3 місяці' },
      ],
    },
    {
      id: 'idp',
      label: { en: 'Internally displaced persons', uk: 'Внутрішньо переміщені особи' },
      description: { en: 'People registered as internally displaced.', uk: 'Особи, зареєстровані як внутрішньо переміщені.' },
      verificationSource: { en: 'IDP certificate via state digital ID (illustrative)', uk: 'Довідка ВПО через державний цифровий ID (ілюстративно)' },
      benefits: [{ en: 'Onboarding support in a new city', uk: 'Допомога з адаптацією в новому місті' }],
    },
    {
      id: 'disability',
      label: { en: 'People with disabilities', uk: 'Люди з інвалідністю' },
      description: { en: 'Workers with a confirmed disability status who opt in.', uk: 'Виконавці з підтвердженим статусом, які погодилися брати участь.' },
      verificationSource: { en: 'Official certificate, manual review (illustrative)', uk: 'Офіційна довідка, ручна перевірка (ілюстративно)' },
      benefits: [{ en: 'Accessible task matching filters', uk: 'Фільтри доступних завдань' }],
    },
    {
      id: 'seniors',
      label: { en: 'Seniors 60+', uk: 'Люди 60+' },
      description: { en: 'Experienced workers aged 60 and over.', uk: 'Досвідчені виконавці віком від 60 років.' },
      verificationSource: { en: 'Date of birth from the identity check', uk: 'Дата народження з перевірки особи' },
      benefits: [{ en: 'Short-format and consulting tasks highlighted', uk: 'Підсвічування коротких і консультаційних завдань' }],
    },
  ],
  cities: [
    { id: 'kyiv', name: { en: 'Kyiv', uk: 'Київ' }, x: 52, y: 32, districts: ['Podil', 'Obolon', 'Pechersk', 'Darnytsia'] },
    { id: 'lviv', name: { en: 'Lviv', uk: 'Львів' }, x: 14, y: 40, districts: ['Sykhiv', 'Halytskyi', 'Frankivskyi'] },
    { id: 'dnipro', name: { en: 'Dnipro', uk: 'Дніпро' }, x: 70, y: 52, districts: ['Center', 'Pidstantsiia'] },
    { id: 'odesa', name: { en: 'Odesa', uk: 'Одеса' }, x: 48, y: 78, districts: ['Prymorskyi', 'Kyivskyi'] },
    { id: 'vinnytsia', name: { en: 'Vinnytsia', uk: 'Вінниця' }, x: 38, y: 48, districts: ['Center', 'Vyshenka'] },
    { id: 'kharkiv', name: { en: 'Kharkiv', uk: 'Харків' }, x: 80, y: 34, districts: ['Saltivka', 'Kholodna Hora'] },
  ],
  emergencyNumber: '112',
  legalNotices: [
    {
      en: 'Funds are held and transferred by a licensed payment partner, not by the platform (illustrative arrangement).',
      uk: 'Кошти утримує та переказує ліцензований платіжний партнер, а не платформа (ілюстративна схема).',
    },
    {
      en: 'Workers are independent contractors. Classification rules must be validated by a local lawyer.',
      uk: 'Виконавці є незалежними підрядниками. Правила класифікації має перевірити місцевий юрист.',
    },
    {
      en: 'Personal data processing must follow local data-protection law.',
      uk: 'Обробка персональних даних має відповідати місцевому законодавству про захист даних.',
    },
  ],
  lowBandwidthMode: false,
};
