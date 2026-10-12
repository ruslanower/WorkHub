import type { CountryPack } from './types';

/**
 * POLAND - demo Country Pack.
 * ILLUSTRATIVE CONFIGURATION - requires local legal validation.
 * Provider names are plain text only; no logos or state marks are used.
 */
export const PL: CountryPack = {
  code: 'PL',
  name: { en: 'Poland', pl: 'Polska', uk: 'Польща' },
  defaultLocale: 'pl',
  locales: ['pl', 'en', 'uk'],
  intlRegion: 'PL',
  currency: { code: 'PLN', symbol: 'zł', decimals: 2 },
  fees: { customerPct: 0.06, workerPct: 0.08, minFee: 5, payoutFee: 0 },
  newAccountJobCap: 2,
  autoReleaseDays: 3,
  companyApprovalThreshold: 4000,
  identity: {
    providerName: 'mObywatel / Trusted Profile',
    levels: [
      {
        level: 0,
        label: { en: 'Phone or email confirmed', pl: 'Telefon lub e-mail potwierdzony', uk: 'Телефон або e-mail підтверджено' },
        steps: [
          { en: 'Enter your phone number', pl: 'Wpisz numer telefonu', uk: 'Введіть номер телефону' },
          { en: 'Enter the one-time code', pl: 'Wpisz jednorazowy kod', uk: 'Введіть одноразовий код' },
        ],
      },
      {
        level: 1,
        label: { en: 'Document and selfie checked', pl: 'Dokument i selfie zweryfikowane', uk: 'Документ і селфі перевірено' },
        steps: [
          { en: 'Photograph your ID document', pl: 'Zrób zdjęcie dokumentu tożsamości', uk: 'Сфотографуйте документ, що посвідчує особу' },
          { en: 'Take a selfie for a liveness check', pl: 'Zrób selfie do weryfikacji „żywej” osoby', uk: 'Зробіть селфі для перевірки «живої» особи' },
          { en: 'Wait for the automatic check', pl: 'Poczekaj na automatyczną weryfikację', uk: 'Дочекайтеся автоматичної перевірки' },
        ],
      },
      {
        level: 2,
        label: {
          en: 'State digital ID (mObywatel or Trusted Profile) confirmed',
          pl: 'Państwowa tożsamość cyfrowa (mObywatel lub Profil Zaufany) potwierdzona',
          uk: 'Державний цифровий ID (mObywatel або Довірений профіль) підтверджено',
        },
        steps: [
          { en: 'Choose mObywatel or Trusted Profile', pl: 'Wybierz mObywatel lub Profil Zaufany', uk: 'Оберіть mObywatel або Довірений профіль' },
          { en: 'Sign in and approve data sharing', pl: 'Zaloguj się i zatwierdź udostępnienie danych', uk: 'Увійдіть і погодьте передачу даних' },
          { en: 'We receive only the verification result', pl: 'Otrzymujemy wyłącznie wynik weryfikacji', uk: 'Ми отримуємо лише результат перевірки' },
        ],
      },
      {
        level: 3,
        label: { en: 'Licence or permit confirmed', pl: 'Uprawnienia lub licencja potwierdzone', uk: 'Ліцензію або допуск підтверджено' },
        steps: [
          { en: 'Choose the regulated trade', pl: 'Wybierz regulowany rodzaj prac', uk: 'Оберіть регульований вид робіт' },
          { en: 'Upload the qualification certificate', pl: 'Prześlij świadectwo kwalifikacyjne', uk: 'Завантажте кваліфікаційне свідоцтво' },
          { en: 'Manual review by the operations team', pl: 'Ręczna weryfikacja przez zespół platformy', uk: 'Ручна перевірка командою платформи' },
        ],
      },
    ],
    note: {
      en: 'Digital ID integration is illustrative. Access conditions for private services must be confirmed with the provider.',
      pl: 'Integracja z tożsamością cyfrową jest poglądowa. Warunki dostępu dla usług prywatnych należy potwierdzić u dostawcy.',
      uk: 'Інтеграція цифрового ID ілюстративна. Умови доступу для приватних сервісів треба погодити з провайдером.',
    },
    privacyNote: {
      en: 'We store only the verification result, not your documents.',
      pl: 'Przechowujemy wyłącznie wynik weryfikacji, a nie Twoje dokumenty.',
      uk: 'Ми зберігаємо лише результат перевірки, а не ваші документи.',
    },
  },
  payments: {
    partnerName: 'Partner PSP Poland (illustrative)',
    protectedPaymentLabel: { en: 'Protected payment', pl: 'Płatność chroniona', uk: 'Захищена оплата' },
    payoutMethods: [
      {
        id: 'pl-bank',
        kind: 'bank_transfer',
        label: { en: 'Bank transfer', pl: 'Przelew bankowy', uk: 'Банківський переказ' },
        eta: { en: '1 business day', pl: '1 dzień roboczy', uk: '1 робочий день' },
        extraFee: 0,
      },
      {
        id: 'pl-instant',
        kind: 'instant_bank',
        label: { en: 'Instant bank payment', pl: 'Przelew natychmiastowy', uk: 'Миттєвий банківський переказ' },
        eta: { en: 'Within minutes', pl: 'W ciągu kilku minut', uk: 'Протягом кількох хвилин' },
        extraFee: 2,
      },
    ],
    cryptoEnabled: false,
    mobileMoneyFirst: false,
  },
  tax: {
    workerStatuses: [
      {
        id: 'pl-jdg',
        label: { en: 'Sole proprietorship (JDG, illustrative)', pl: 'Jednoosobowa działalność gospodarcza (JDG, poglądowo)', uk: 'Одноосібна підприємницька діяльність (JDG, ілюстративно)' },
        hint: {
          en: 'Registered business that issues invoices and settles taxes itself (illustrative).',
          pl: 'Zarejestrowana firma, która wystawia faktury i samodzielnie rozlicza podatki (poglądowo).',
          uk: 'Зареєстрований підприємець, який виставляє рахунки й самостійно сплачує податки (ілюстративно).',
        },
      },
      {
        id: 'pl-unregistered',
        label: { en: 'Unregistered activity (działalność nierejestrowana, illustrative)', pl: 'Działalność nierejestrowana (poglądowo)', uk: 'Незареєстрована діяльність (działalność nierejestrowana, ілюстративно)' },
        hint: {
          en: 'Small-scale activity below a monthly revenue limit. Limits and conditions must be confirmed with a tax adviser.',
          pl: 'Działalność na małą skalę poniżej miesięcznego limitu przychodu. Limity i warunki należy potwierdzić z doradcą podatkowym.',
          uk: 'Невелика діяльність у межах місячного ліміту доходу. Ліміти та умови треба підтвердити з податковим консультантом.',
        },
      },
    ],
    note: {
      en: 'Tax hints are informational only. The worker is responsible for declaring income. Not tax advice.',
      pl: 'Wskazówki podatkowe mają wyłącznie charakter informacyjny. Wykonawca samodzielnie rozlicza dochód. To nie jest porada podatkowa.',
      uk: 'Податкові підказки мають лише інформаційний характер. Виконавець самостійно декларує дохід. Це не податкова консультація.',
    },
    documentTemplates: [
      {
        id: 'pl-agreement',
        kind: 'agreement',
        title: { en: 'Service agreement', pl: 'Umowa o świadczenie usług', uk: 'Договір про надання послуг' },
        body: {
          en: 'SERVICE AGREEMENT No. {{docNumber}}\n{{city}}, {{date}}\n\nCustomer: {{customerName}}\nContractor: {{workerName}} ({{workerStatus}})\n\n1. Subject: {{taskTitle}}.\n2. Price: {{amount}}. Platform service fee for the customer: {{customerFee}}. Total payable: {{customerPays}}.\n3. Payment is held as a {{protectedPaymentLabel}} by {{partnerName}} and released after acceptance.\n4. Milestones:\n{{milestones}}\n5. If the customer does not respond within {{autoReleaseDays}} days after delivery, funds are released automatically unless a dispute is opened.\n6. Disputes are resolved under the {{brand}} rules.\n\nSigned electronically in the prototype (test mode).',
          pl: 'UMOWA O ŚWIADCZENIE USŁUG nr {{docNumber}}\n{{city}}, {{date}}\n\nZamawiający: {{customerName}}\nWykonawca: {{workerName}} ({{workerStatus}})\n\n1. Przedmiot umowy: {{taskTitle}}.\n2. Wynagrodzenie: {{amount}}. Opłata serwisowa platformy dla Zamawiającego: {{customerFee}}. Razem do zapłaty: {{customerPays}}.\n3. Środki są przechowywane jako „{{protectedPaymentLabel}}” przez partnera płatniczego {{partnerName}} i wypłacane po odbiorze prac.\n4. Etapy:\n{{milestones}}\n5. Jeżeli Zamawiający nie odpowie w ciągu {{autoReleaseDays}} dni od przekazania prac, środki zostaną wypłacone automatycznie, o ile nie otwarto sporu.\n6. Spory rozstrzygane są zgodnie z regulaminem {{brand}}.\n\nPodpisano elektronicznie w prototypie (tryb testowy).',
          uk: 'ДОГОВІР ПРО НАДАННЯ ПОСЛУГ № {{docNumber}}\n{{city}}, {{date}}\n\nЗамовник: {{customerName}}\nВиконавець: {{workerName}} ({{workerStatus}})\n\n1. Предмет: {{taskTitle}}.\n2. Вартість: {{amount}}. Сервісний збір платформи для замовника: {{customerFee}}. Разом до сплати: {{customerPays}}.\n3. Кошти утримуються як «{{protectedPaymentLabel}}» платіжним партнером {{partnerName}} і виплачуються після прийняття робіт.\n4. Етапи:\n{{milestones}}\n5. Якщо замовник не відповідає протягом {{autoReleaseDays}} днів після здачі, кошти виплачуються автоматично, якщо не відкрито спір.\n6. Спори вирішуються за правилами {{brand}}.\n\nПідписано електронно в прототипі (тестовий режим).',
        },
      },
      {
        id: 'pl-act',
        kind: 'completion_act',
        title: { en: 'Acceptance protocol', pl: 'Protokół odbioru', uk: 'Протокол приймання робіт' },
        body: {
          en: 'ACCEPTANCE PROTOCOL No. {{docNumber}}\n{{city}}, {{date}}\n\nThe Contractor {{workerName}} has performed and the Customer {{customerName}} has accepted the work: {{taskTitle}}.\nAmount of work: {{amount}}.\nThe parties have no claims against each other.\n\nAccepted in the prototype (test mode).',
          pl: 'PROTOKÓŁ ODBIORU nr {{docNumber}}\n{{city}}, {{date}}\n\nWykonawca {{workerName}} wykonał, a Zamawiający {{customerName}} odebrał prace: {{taskTitle}}.\nWartość prac: {{amount}}.\nStrony nie zgłaszają wobec siebie żadnych roszczeń.\n\nOdebrano w prototypie (tryb testowy).',
          uk: 'ПРОТОКОЛ ПРИЙМАННЯ РОБІТ № {{docNumber}}\n{{city}}, {{date}}\n\nВиконавець {{workerName}} виконав, а Замовник {{customerName}} прийняв роботи: {{taskTitle}}.\nВартість робіт: {{amount}}.\nСторони претензій одна до одної не мають.\n\nПрийнято в прототипі (тестовий режим).',
        },
      },
      {
        id: 'pl-invoice',
        kind: 'invoice',
        title: { en: 'Bill / invoice', pl: 'Rachunek / faktura', uk: 'Рахунок / фактура' },
        body: {
          en: 'BILL / INVOICE No. {{docNumber}} of {{date}}\n\nSeller: {{workerName}} ({{workerStatus}})\nBuyer: {{customerName}}\nService: {{taskTitle}}\nAmount: {{amount}}\nPlatform fee withheld from the contractor: {{workerFee}}\nPaid out to the contractor: {{workerReceives}}\nPayment processed by {{partnerName}}.\n\nSimulated document - not valid for accounting.',
          pl: 'RACHUNEK / FAKTURA nr {{docNumber}} z dnia {{date}}\n\nSprzedawca: {{workerName}} ({{workerStatus}})\nNabywca: {{customerName}}\nUsługa: {{taskTitle}}\nKwota: {{amount}}\nProwizja platformy pobrana od Wykonawcy: {{workerFee}}\nWypłacono Wykonawcy: {{workerReceives}}\nPłatność obsłużył: {{partnerName}}.\n\nDokument symulowany - nie ma mocy księgowej.',
          uk: 'РАХУНОК / ФАКТУРА № {{docNumber}} від {{date}}\n\nПостачальник: {{workerName}} ({{workerStatus}})\nПокупець: {{customerName}}\nПослуга: {{taskTitle}}\nСума: {{amount}}\nКомісія платформи з виконавця: {{workerFee}}\nВиплачено виконавцю: {{workerReceives}}\nПлатіж оброблено: {{partnerName}}.\n\nСимульований документ - не має бухгалтерської сили.',
        },
      },
    ],
  },
  categories: [
    {
      id: 'repair',
      label: { en: 'Construction and repair', pl: 'Budowa i remonty', uk: 'Будівництво та ремонт' },
      icon: 'Hammer',
      priceGuide: { min: 300, max: 9000 },
      templates: [
        {
          id: 'pl-repair-1',
          title: { en: 'Replace a damaged section of drywall', pl: 'Wymienić uszkodzony fragment płyty g-k', uk: 'Замінити пошкоджену ділянку гіпсокартону' },
          description: { en: 'About 4 m² of drywall in a hallway needs replacing and finishing.', pl: 'Około 4 m² płyty g-k w przedpokoju do wymiany i wykończenia.', uk: 'Потрібно замінити й зашпаклювати близько 4 м² гіпсокартону в коридорі.' },
          durationHours: 6,
        },
        {
          id: 'pl-repair-2',
          title: { en: 'Tile a small bathroom', pl: 'Położyć płytki w małej łazience', uk: 'Покласти плитку в невеликій ванній' },
          description: { en: 'Bathroom of 5 m², walls and floor; tiles are on site.', pl: 'Łazienka 5 m², ściany i podłoga; płytki są na miejscu.', uk: 'Ванна 5 м², стіни й підлога; плитка на місці.' },
          durationHours: 16,
        },
        {
          id: 'pl-repair-3',
          title: { en: 'Fix a balcony railing in a block of flats', pl: 'Naprawić balustradę balkonu w bloku', uk: 'Полагодити балконне огородження в багатоквартирному будинку' },
          description: { en: 'Loose metal railing; needs re-anchoring and rust treatment.', pl: 'Poluzowana metalowa balustrada; trzeba ją ponownie zakotwić i zabezpieczyć przed rdzą.', uk: 'Хитке металеве огородження: потрібно заново закріпити й обробити від іржі.' },
          durationHours: 4,
        },
      ],
    },
    {
      id: 'painting',
      label: { en: 'Painting and finishing', pl: 'Malowanie i wykończenia', uk: 'Фарбування та оздоблення' },
      icon: 'PaintRoller',
      priceGuide: { min: 400, max: 7000 },
      templates: [
        {
          id: 'pl-paint-flagship',
          title: { en: 'Repaint 24 storage racks at a workshop', pl: 'Przemalować 24 regały magazynowe w warsztacie', uk: 'Перефарбувати 24 складські стелажі в майстерні' },
          description: {
            en: 'Metal racks 2 m high. Sanding, primer and two coats of paint. Paint is provided by the customer.',
            pl: 'Metalowe regały o wysokości 2 m. Szlifowanie, podkład i dwie warstwy farby. Farbę zapewnia zamawiający.',
            uk: 'Металеві стелажі висотою 2 м. Шліфування, ґрунт і два шари фарби. Фарбу надає замовник.',
          },
          durationHours: 24,
        },
        {
          id: 'pl-paint-2',
          title: { en: 'Paint walls in a two-room flat', pl: 'Pomalować ściany w mieszkaniu dwupokojowym', uk: 'Пофарбувати стіни у двокімнатній квартирі' },
          description: { en: 'About 90 m² of walls, light colours.', pl: 'Około 90 m² ścian, jasne kolory.', uk: 'Близько 90 м² стін, світлі кольори.' },
          durationHours: 16,
        },
        {
          id: 'pl-paint-3',
          title: { en: 'Varnish a wooden fence', pl: 'Polakierować drewniane ogrodzenie', uk: 'Покрити лаком дерев’яний паркан' },
          description: { en: 'Fence about 25 m long at a house; impregnation and one coat.', pl: 'Ogrodzenie ok. 25 m przy domu; impregnacja i jedna warstwa.', uk: 'Паркан близько 25 м біля будинку; просочення та один шар.' },
          durationHours: 8,
        },
      ],
    },
    {
      id: 'moving',
      label: { en: 'Logistics and moving', pl: 'Logistyka i przeprowadzki', uk: 'Логістика та переїзди' },
      icon: 'Truck',
      priceGuide: { min: 200, max: 3000 },
      templates: [
        {
          id: 'pl-move-1',
          title: { en: 'Help moving an office of 6 desks', pl: 'Pomoc w przeprowadzce biura na 6 stanowisk', uk: 'Допомогти з переїздом офісу на 6 робочих місць' },
          description: { en: 'Two movers and a van, 3rd floor with a lift.', pl: 'Dwóch tragarzy i bus, 3. piętro, jest winda.', uk: 'Два вантажники та бус, 3-й поверх, є ліфт.' },
          durationHours: 5,
        },
        {
          id: 'pl-move-2',
          title: { en: 'Move a student room to a new flat', pl: 'Przewieźć rzeczy studenta do nowego mieszkania', uk: 'Перевезти речі студента в нову квартиру' },
          description: { en: 'About 15 boxes, a desk and a bed; 4th floor without a lift.', pl: 'Około 15 kartonów, biurko i łóżko; 4. piętro bez windy.', uk: 'Близько 15 коробок, стіл і ліжко; 4-й поверх без ліфта.' },
          durationHours: 3,
        },
      ],
    },
    {
      id: 'cleaning',
      label: { en: 'Cleaning', pl: 'Sprzątanie', uk: 'Прибирання' },
      icon: 'Sparkles',
      priceGuide: { min: 150, max: 1500 },
      templates: [
        {
          id: 'pl-clean-1',
          title: { en: 'Post-renovation cleaning of a flat', pl: 'Sprzątanie mieszkania po remoncie', uk: 'Прибирання квартири після ремонту' },
          description: { en: '60 m², windows included.', pl: '60 m², razem z oknami.', uk: '60 м², разом із вікнами.' },
          durationHours: 6,
        },
        {
          id: 'pl-clean-2',
          title: { en: 'Weekly office cleaning', pl: 'Cotygodniowe sprzątanie biura', uk: 'Щотижневе прибирання офісу' },
          description: { en: 'Office of 120 m², every Friday evening.', pl: 'Biuro 120 m², w każdy piątek wieczorem.', uk: 'Офіс 120 м², щоп’ятниці ввечері.' },
          durationHours: 3,
        },
      ],
    },
    {
      id: 'installation',
      label: { en: 'Installation and maintenance', pl: 'Montaż i serwis', uk: 'Монтаж і обслуговування' },
      icon: 'Wrench',
      priceGuide: { min: 150, max: 3500 },
      templates: [
        {
          id: 'pl-inst-1',
          title: { en: 'Assemble and mount kitchen cabinets', pl: 'Złożyć i zamontować szafki kuchenne', uk: 'Зібрати й змонтувати кухонні шафи' },
          description: { en: 'Flat-pack set of 8 cabinets; wall mounting needed.', pl: 'Zestaw 8 szafek w paczkach; potrzebny montaż na ścianie.', uk: 'Комплект із 8 шаф у пакуванні; потрібен монтаж на стіну.' },
          durationHours: 6,
        },
        {
          id: 'pl-inst-2',
          title: { en: 'Service a gas boiler before winter', pl: 'Przegląd pieca gazowego przed zimą', uk: 'Обслуговування газового котла перед зимою' },
          description: { en: 'Cleaning and safety check of a wall-mounted boiler.', pl: 'Czyszczenie i kontrola bezpieczeństwa kotła wiszącego.', uk: 'Чистка та перевірка безпеки настінного котла.' },
          durationHours: 2,
        },
      ],
    },
    {
      id: 'electrical',
      label: { en: 'Electrical work', pl: 'Prace elektryczne', uk: 'Електромонтажні роботи' },
      icon: 'Zap',
      priceGuide: { min: 200, max: 4000 },
      templates: [
        {
          id: 'pl-elec-1',
          title: { en: 'Replace the distribution board', pl: 'Wymienić rozdzielnicę elektryczną', uk: 'Замінити електрощиток' },
          description: { en: 'Flat board with 8 circuit breakers.', pl: 'Rozdzielnica mieszkaniowa na 8 wyłączników.', uk: 'Квартирний щиток на 8 автоматів.' },
          durationHours: 4,
        },
        {
          id: 'pl-elec-2',
          title: { en: 'Install a wall charger for an electric car', pl: 'Zamontować ładowarkę ścienną do auta elektrycznego', uk: 'Встановити настінну зарядку для електромобіля' },
          description: { en: 'Private garage, charger is provided by the customer.', pl: 'Prywatny garaż, ładowarkę zapewnia zamawiający.', uk: 'Приватний гараж, зарядний пристрій надає замовник.' },
          durationHours: 4,
        },
      ],
    },
  ],
  regulatedTrades: [
    {
      categoryId: 'electrical',
      permitName: {
        en: 'Electrical qualification certificate (SEP-style, illustrative)',
        pl: 'Świadectwo kwalifikacyjne elektryczne (typu SEP, poglądowo)',
        uk: 'Кваліфікаційне свідоцтво електрика (на зразок SEP, ілюстративно)',
      },
    },
  ],
  priorityPrograms: [
    {
      id: 'newcomers',
      label: { en: 'Newcomers and refugees', pl: 'Nowo przybyli i uchodźcy', uk: 'Новоприбулі та біженці' },
      description: {
        en: 'People who recently arrived in Poland, including those under temporary protection.',
        pl: 'Osoby, które niedawno przyjechały do Polski, w tym objęte ochroną czasową.',
        uk: 'Люди, які нещодавно приїхали до Польщі, зокрема під тимчасовим захистом.',
      },
      verificationSource: {
        en: 'Residence or protection status document, manual review (illustrative)',
        pl: 'Dokument pobytowy lub potwierdzenie statusu ochrony, ręczna weryfikacja (poglądowo)',
        uk: 'Документ про перебування або статус захисту, ручна перевірка (ілюстративно)',
      },
      benefits: [
        { en: 'Onboarding in Ukrainian and English', pl: 'Wdrożenie po ukraińsku i angielsku', uk: 'Адаптація українською та англійською' },
        { en: 'Reduced worker fee for the first 3 months (illustrative)', pl: 'Obniżona prowizja dla wykonawcy przez pierwsze 3 miesiące (poglądowo)', uk: 'Знижена комісія для виконавця перші 3 місяці (ілюстративно)' },
      ],
    },
    {
      id: 'workers50',
      label: { en: 'Workers 50+', pl: 'Pracownicy 50+', uk: 'Працівники 50+' },
      description: { en: 'Experienced workers aged 50 and over.', pl: 'Doświadczeni wykonawcy w wieku 50 lat i więcej.', uk: 'Досвідчені виконавці віком від 50 років.' },
      verificationSource: { en: 'Date of birth from the identity check', pl: 'Data urodzenia z weryfikacji tożsamości', uk: 'Дата народження з перевірки особи' },
      benefits: [{ en: 'Mentoring and consulting tasks highlighted', pl: 'Wyróżnione zlecenia mentorskie i doradcze', uk: 'Підсвічування наставницьких і консультаційних завдань' }],
    },
    {
      id: 'disability',
      label: { en: 'People with disabilities', pl: 'Osoby z niepełnosprawnościami', uk: 'Люди з інвалідністю' },
      description: {
        en: 'Workers with a confirmed disability status who opt in.',
        pl: 'Wykonawcy z potwierdzonym orzeczeniem, którzy wyrazili zgodę na udział.',
        uk: 'Виконавці з підтвердженим статусом, які погодилися брати участь.',
      },
      verificationSource: {
        en: 'Official disability certificate, manual review (illustrative)',
        pl: 'Orzeczenie o niepełnosprawności, ręczna weryfikacja (poglądowo)',
        uk: 'Офіційна довідка про інвалідність, ручна перевірка (ілюстративно)',
      },
      benefits: [{ en: 'Accessible task matching filters', pl: 'Filtry dostępnych zleceń', uk: 'Фільтри доступних завдань' }],
    },
    {
      id: 'longterm',
      label: { en: 'Long-term unemployed', pl: 'Osoby długotrwale bezrobotne', uk: 'Особи, які довго не мають роботи' },
      description: {
        en: 'People returning to work after a long break.',
        pl: 'Osoby wracające do pracy po długiej przerwie.',
        uk: 'Люди, які повертаються до роботи після тривалої перерви.',
      },
      verificationSource: {
        en: 'Certificate from the local labour office (illustrative)',
        pl: 'Zaświadczenie z powiatowego urzędu pracy (poglądowo)',
        uk: 'Довідка з місцевого центру зайнятості (ілюстративно)',
      },
      benefits: [
        { en: 'Starter tasks and profile coaching', pl: 'Zlecenia na start i pomoc w tworzeniu profilu', uk: 'Стартові завдання та допомога з профілем' },
      ],
    },
  ],
  cities: [
    { id: 'warszawa', name: { en: 'Warsaw', pl: 'Warszawa', uk: 'Варшава' }, x: 66, y: 42, districts: ['Mokotów', 'Praga-Południe', 'Wola', 'Ursynów'] },
    { id: 'krakow', name: { en: 'Kraków', pl: 'Kraków', uk: 'Краків' }, x: 56, y: 82, districts: ['Stare Miasto', 'Podgórze', 'Nowa Huta'] },
    { id: 'wroclaw', name: { en: 'Wrocław', pl: 'Wrocław', uk: 'Вроцлав' }, x: 30, y: 66, districts: ['Krzyki', 'Psie Pole', 'Fabryczna'] },
    { id: 'gdansk', name: { en: 'Gdańsk', pl: 'Gdańsk', uk: 'Гданськ' }, x: 48, y: 10, districts: ['Wrzeszcz', 'Oliwa', 'Śródmieście'] },
    { id: 'poznan', name: { en: 'Poznań', pl: 'Poznań', uk: 'Познань' }, x: 28, y: 40, districts: ['Jeżyce', 'Grunwald', 'Rataje'] },
    { id: 'lodz', name: { en: 'Łódź', pl: 'Łódź', uk: 'Лодзь' }, x: 52, y: 54, districts: ['Bałuty', 'Widzew', 'Polesie'] },
  ],
  emergencyNumber: '112',
  legalNotices: [
    {
      en: 'Funds are held and transferred by a licensed payment partner, not by the platform (illustrative arrangement).',
      pl: 'Środki przechowuje i przekazuje licencjonowany partner płatniczy, a nie platforma (schemat poglądowy).',
      uk: 'Кошти утримує та переказує ліцензований платіжний партнер, а не платформа (ілюстративна схема).',
    },
    {
      en: 'Workers are independent contractors. Classification rules must be validated by a local lawyer.',
      pl: 'Wykonawcy są niezależnymi usługodawcami. Zasady kwalifikacji współpracy musi zweryfikować lokalny prawnik.',
      uk: 'Виконавці є незалежними підрядниками. Правила класифікації має перевірити місцевий юрист.',
    },
    {
      en: 'Personal data processing must follow the GDPR and local data-protection law.',
      pl: 'Przetwarzanie danych osobowych musi być zgodne z RODO i krajowymi przepisami o ochronie danych.',
      uk: 'Обробка персональних даних має відповідати GDPR і місцевому законодавству про захист даних.',
    },
  ],
  lowBandwidthMode: false,
};
