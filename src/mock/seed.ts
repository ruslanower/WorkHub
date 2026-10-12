import type { CountryPack } from '@/countries/types';
import { COUNTRY_PACKS } from '@/countries';
import type {
  User,
  Company,
  Task,
  Offer,
  Job,
  Message,
  Evidence,
  JobDocument,
  Dispute,
  Review,
  WalletTransaction,
  KycCase,
  Flag,
  PayoutException,
  AuditEvent,
} from '@/services/types';
import { splitIntoMilestones } from '@/lib/fees';

/**
 * Seed data generator per Country Pack.
 * Creates:
 * - 12 Workers with realistic profiles, skills, ratings, and priority badges
 * - 6 Customers + 2 Admins / Partners
 * - 6 B2B Companies
 * - 24 Tasks across categories (including the flagship "Repaint 24 storage racks at a workshop")
 * - 8 Jobs in various states (offer_accepted, funded, in_progress, delivered, approved, paid_out)
 * - 3 Disputes in different stages
 * - 20 Reviews with criteria breakdowns
 * - Wallet transactions, KYC cases, flags, and payout exceptions
 */

export interface MockDataset {
  users: User[];
  companies: Company[];
  tasks: Task[];
  offers: Offer[];
  jobs: Job[];
  messages: Message[];
  evidence: Evidence[];
  documents: JobDocument[];
  disputes: Dispute[];
  reviews: Review[];
  walletTransactions: WalletTransaction[];
  kycCases: KycCase[];
  flags: Flag[];
  payoutExceptions: PayoutException[];
  auditEvents: AuditEvent[];
}

export function generateSeedData(): MockDataset {
  const users: User[] = [];
  const companies: Company[] = [];
  const tasks: Task[] = [];
  const offers: Offer[] = [];
  const jobs: Job[] = [];
  const messages: Message[] = [];
  const evidence: Evidence[] = [];
  const documents: JobDocument[] = [];
  const disputes: Dispute[] = [];
  const reviews: Review[] = [];
  const walletTransactions: WalletTransaction[] = [];
  const kycCases: KycCase[] = [];
  const flags: Flag[] = [];
  const payoutExceptions: PayoutException[] = [];
  const auditEvents: AuditEvent[] = [];

  const now = new Date();
  const dAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();
  const dAhead = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();

  // Helper names per country
  const namesData: Record<string, { workerNames: string[]; customerNames: string[]; companyNames: string[] }> = {
    UA: {
      workerNames: [
        'Тарас Шевченко', 'Олександр Коваленко', 'Іван Мельник', 'Михайло Бондар',
        'Сергій Кравченко', 'Андрій Бойко', 'Олена Ткаченко', 'Дмитро Поліщук',
        'Василь Мороз', 'Юрій Лисенко', 'Богдан Руденко', 'Максим Савчук'
      ],
      customerNames: [
        'Оксана Петренко', 'Віктор Гончар', 'Наталія Сидоренко',
        'Павло Гриценко', 'Марина Демченко', 'Роман Кузьменко'
      ],
      companyNames: [
        'ТОВ «Логістик-Спектр»', 'ОСББ «Затишний Двір»', 'Майстерня «ТехноПром»',
        'Рітейл Хаб Київ', 'Склад Сервіс Дніпро', 'Агро-Логістика Поділля'
      ],
    },
    PL: {
      workerNames: [
        'Piotr Wiśniewski', 'Tomasz Kowalski', 'Krzysztof Kamiński', 'Michał Lewandowski',
        'Jakub Zieliński', 'Marek Szymański', 'Anna Woźniak', 'Paweł Kozłowski',
        'Łukasz Jankowski', 'Stanisław Mazur', 'Wojciech Kwiatkowski', 'Mateusz Krawczyk'
      ],
      customerNames: [
        'Katarzyna Dąbrowska', 'Andrzej Grabowski', 'Magdalena Nowak',
        'Marcin Wójcik', 'Agnieszka Pawlak', 'Bartosz Michalski'
      ],
      companyNames: [
        'ProLogistyka Sp. z o.o.', 'Wspólnota Mieszkaniowa Zielona', 'Warsztat Precyzja',
        'Centrum Dystrybucji Gdańsk', 'Remont Serwis Wrocław', 'Retail Magazyn Poznań'
      ],
    },
    KE: {
      workerNames: [
        'Juma Omondi', 'David Kiprono', 'Mwangi Kamau', 'Peter Otieno',
        'Samuel Mutua', 'Brian Njoroge', 'Grace Wambui', 'Kelvin Cheruiyot',
        'Faith Achieng', 'Dennis Maina', 'Joseph Kibet', 'Victor Barasa'
      ],
      customerNames: [
        'Wanjiku Mwangi', 'Amina Hassan', 'Kariuki Githinji',
        'Esther Nduta', 'Moses Koech', 'Mercy Chebet'
      ],
      companyNames: [
        'Apex Logistics Hub Ltd', 'Green Estates Management', 'Nairobi Precision Workshop',
        'Rift Valley Cold Storage', 'Coastal Warehousing Mombasa', 'Kilimani Property Care'
      ],
    },
  };

  // Generate dataset for each configured pack
  for (const cc of Object.keys(COUNTRY_PACKS)) {
    const pack = COUNTRY_PACKS[cc];
    const n = namesData[cc] || namesData.UA;
    const cities = pack.cities;

    // 1. Seed Customer Accounts (6)
    const seededCustomers: User[] = [];
    for (let i = 0; i < 6; i++) {
      const city = cities[i % cities.length];
      const cust: User = {
        id: `usr-${cc.toLowerCase()}-cust-${i + 1}`,
        countryCode: cc,
        accountType: 'customer',
        name: { en: n.customerNames[i] },
        initials: n.customerNames[i].split(' ').map((p) => p[0]).join('').slice(0, 2),
        cityId: city.id,
        district: city.districts[0] || 'Center',
        verificationLevel: (i % 2 === 0 ? 2 : 1) as 0 | 1 | 2 | 3,
        verifiedTrades: [],
        programs: [],
        rating: 4.8 - (i * 0.1),
        reviewsCount: 3 + i * 2,
        completedJobs: 4 + i * 3,
        completionRate: 0.95,
        responseMinutes: 15 + i * 5,
        disputesLost: 0,
        joinedAt: dAgo(180 - i * 20),
        savedWorkerIds: [],
        hasPhoto: true,
      };
      users.push(cust);
      seededCustomers.push(cust);
    }

    // 2. Seed Workers (12)
    const seededWorkers: User[] = [];
    for (let i = 0; i < 12; i++) {
      const city = cities[i % cities.length];
      const level = (i === 0 ? 3 : i < 4 ? 2 : i < 10 ? 1 : 0) as 0 | 1 | 2 | 3;
      const programs = pack.priorityPrograms.slice(0, 2).map((p, idx) => ({
        programId: p.id,
        status: 'verified' as const,
        showBadge: idx === 0, // only show with explicit consent
      }));

      const w: User = {
        id: `usr-${cc.toLowerCase()}-work-${i + 1}`,
        countryCode: cc,
        accountType: 'worker',
        name: { en: n.workerNames[i] },
        initials: n.workerNames[i].split(' ').map((p) => p[0]).join('').slice(0, 2),
        cityId: city.id,
        district: city.districts[i % city.districts.length] || 'Center',
        verificationLevel: level,
        verifiedTrades: level === 3 ? ['electrical'] : [],
        programs: i < 5 ? programs : [],
        rating: i === 11 ? null : +(4.6 + (i % 5) * 0.08).toFixed(1),
        reviewsCount: i === 11 ? 0 : 5 + i * 3,
        completedJobs: i === 11 ? 0 : 6 + i * 4,
        completionRate: 0.96,
        responseMinutes: 10 + (i % 4) * 8,
        disputesLost: i === 7 ? 1 : 0,
        joinedAt: dAgo(240 - i * 15),
        taxStatusId: pack.tax.workerStatuses[0]?.id,
        headline: { en: `Professional contractor in ${city.name.en}` },
        skills: ['painting', 'repair', 'installation', 'assembly'],
        pro: i < 3,
        hasPhoto: true,
      };
      users.push(w);
      seededWorkers.push(w);
    }

    // 3. Seed B2B Companies (6)
    const seededCompanies: Company[] = [];
    for (let i = 0; i < 6; i++) {
      const city = cities[i % cities.length];
      const compCust = seededCustomers[i % seededCustomers.length];
      const comp: Company = {
        id: `comp-${cc.toLowerCase()}-${i + 1}`,
        countryCode: cc,
        name: { en: n.companyNames[i] },
        cityId: city.id,
        monthlyBudget: pack.companyApprovalThreshold * 8,
        approvalThreshold: pack.companyApprovalThreshold,
        spentThisMonth: pack.companyApprovalThreshold * 2.5,
        members: [
          { userId: compCust.id, role: 'owner' },
          { userId: seededCustomers[(i + 1) % seededCustomers.length].id, role: 'manager' },
        ],
      };
      companies.push(comp);
      seededCompanies.push(comp);
    }

    // 4. Seed Tasks (24 across categories)
    const seededTasks: Task[] = [];
    let taskIdx = 0;
    for (const cat of pack.categories) {
      for (const tmpl of cat.templates) {
        taskIdx++;
        const city = cities[(taskIdx) % cities.length];
        const isFlagship = tmpl.id.includes('flagship');
        const budget = isFlagship
          ? (cc === 'KE' ? 45000 : cc === 'PL' ? 2400 : 18000)
          : Math.round((cat.priceGuide.min + cat.priceGuide.max) / 2);

        const milestoneShares = [0.4, 0.6];
        const milestoneAmounts = splitIntoMilestones(budget, milestoneShares, pack.currency.decimals);

        const t: Task = {
          id: `tsk-${cc.toLowerCase()}-${taskIdx}`,
          countryCode: cc,
          customerId: seededCustomers[taskIdx % seededCustomers.length].id,
          companyId: taskIdx % 3 === 0 ? seededCompanies[taskIdx % seededCompanies.length].id : undefined,
          categoryId: cat.id,
          templateId: tmpl.id,
          title: tmpl.title,
          description: tmpl.description,
          cityId: city.id,
          district: city.districts[0] || 'Central',
          x: city.x + ((taskIdx % 5) - 2),
          y: city.y + ((taskIdx % 3) - 1),
          budget,
          budgetType: 'milestones',
          milestonePlan: [
            { title: { en: 'Phase 1: Preparation, sanding and primer' }, share: 0.4 },
            { title: { en: 'Phase 2: Final coating and inspection' }, share: 0.6 },
          ],
          date: dAhead(2 + (taskIdx % 7)),
          durationHours: tmpl.durationHours,
          minVerificationLevel: (cat.id === 'electrical' ? 3 : taskIdx % 4 === 0 ? 2 : 1) as 0 | 1 | 2 | 3,
          openToPriorityPrograms: true,
          preferPriority: taskIdx % 2 === 0,
          status: isFlagship ? 'in_progress' : taskIdx < 16 ? 'open' : 'hired',
          createdAt: dAgo(5 + taskIdx),
          photos: 2,
          isFlagship,
        };
        tasks.push(t);
        seededTasks.push(t);

        // Add 2-3 offers for open tasks
        if (t.status === 'open') {
          for (let oi = 0; oi < 3; oi++) {
            const w = seededWorkers[(taskIdx + oi) % seededWorkers.length];
            const off: Offer = {
              id: `off-${t.id}-${oi + 1}`,
              taskId: t.id,
              workerId: w.id,
              price: Math.round(t.budget * (0.95 + oi * 0.05)),
              etaDays: Math.ceil(t.durationHours / 8) + oi,
              message: `Available immediately with full required toolset. Experienced in ${cat.label.en}.`,
              availableFrom: dAhead(1 + oi),
              status: 'pending',
              createdAt: dAgo(2),
            };
            offers.push(off);
          }
        }
      }
    }

    // 5. Seed Jobs in 8 Different States
    const jobStates = [
      'offer_accepted',
      'funded',
      'in_progress', // flagship!
      'delivered',
      'approved',
      'paid_out',
      'paid_out',
      'paid_out',
    ] as const;

    for (let ji = 0; ji < 8; ji++) {
      const isFlagship = ji === 2; // in_progress flagship job
      const targetTask = isFlagship
        ? seededTasks.find((t) => t.isFlagship) || seededTasks[0]
        : seededTasks[seededTasks.length - 1 - ji];

      const assignedWorker = seededWorkers[ji % seededWorkers.length];
      const customer = seededCustomers[ji % seededCustomers.length];
      const amount = targetTask.budget;
      const amounts = splitIntoMilestones(amount, [0.4, 0.6], pack.currency.decimals);

      const st = jobStates[ji];
      const paymentState =
        st === 'offer_accepted' ? 'unfunded'
        : st === 'funded' || st === 'in_progress' ? 'funded'
        : st === 'delivered' ? 'funded'
        : st === 'approved' ? 'released'
        : 'released';

      const job: Job = {
        id: `job-${cc.toLowerCase()}-${ji + 1}`,
        countryCode: cc,
        taskId: targetTask.id,
        offerId: `off-${targetTask.id}-accepted`,
        customerId: customer.id,
        workerId: assignedWorker.id,
        companyId: targetTask.companyId,
        amount,
        status: st,
        paymentState,
        milestones: [
          {
            id: `ms-${cc.toLowerCase()}-${ji + 1}-1`,
            title: { en: 'Phase 1: Preparation & Base work' },
            amount: amounts[0],
            status: st === 'paid_out' || st === 'approved' ? 'released' : st === 'delivered' ? 'delivered' : 'in_progress',
          },
          {
            id: `ms-${cc.toLowerCase()}-${ji + 1}-2`,
            title: { en: 'Phase 2: Final completion' },
            amount: amounts[1],
            status: st === 'paid_out' || st === 'approved' ? 'released' : 'pending',
          },
        ],
        createdAt: dAgo(10 - ji),
        agreementSignedAt: dAgo(9 - ji),
        fundedAt: st !== 'offer_accepted' ? dAgo(8 - ji) : undefined,
        startedAt: ['in_progress', 'delivered', 'approved', 'paid_out'].includes(st) ? dAgo(6 - ji) : undefined,
        deliveredAt: ['delivered', 'approved', 'paid_out'].includes(st) ? dAgo(2) : undefined,
        approvedAt: ['approved', 'paid_out'].includes(st) ? dAgo(1) : undefined,
        paidOutAt: st === 'paid_out' ? dAgo(1) : undefined,
        autoReleaseAt: st === 'delivered' ? dAhead(pack.autoReleaseDays) : undefined,
        changeRequests: 0,
        reviewedByCustomer: st === 'paid_out',
        reviewedByWorker: st === 'paid_out',
        isFlagship,
      };
      jobs.push(job);

      // Add Chat Messages for this job
      messages.push(
        {
          id: `msg-${job.id}-1`,
          jobId: job.id,
          authorId: null,
          kind: 'system',
          text: '',
          systemKey: 'offer_accepted',
          masked: false,
          createdAt: dAgo(8),
        },
        {
          id: `msg-${job.id}-2`,
          jobId: job.id,
          authorId: customer.id,
          kind: 'user',
          text: 'Hello! Looking forward to starting. Can you confirm the required materials?',
          masked: false,
          createdAt: dAgo(7),
        },
        {
          id: `msg-${job.id}-3`,
          jobId: job.id,
          authorId: assignedWorker.id,
          kind: 'user',
          text: 'Hello! Yes, all primer and equipment are prepared. I will be on site at 08:30.',
          masked: false,
          createdAt: dAgo(7),
        },
      );

      // Add Evidence Photos
      evidence.push({
        id: `evi-${job.id}-1`,
        jobId: job.id,
        uploadedBy: assignedWorker.id,
        label: 'Surface preparation and primer coat applied',
        hue: (ji * 45) % 360,
        createdAt: dAgo(3),
      });

      // Add Generated Documents
      documents.push({
        id: `doc-${job.id}-agr`,
        jobId: job.id,
        kind: 'agreement',
        number: `AGR-${cc}-${1000 + ji}`,
        createdAt: dAgo(9 - ji),
      });

      if (['approved', 'paid_out'].includes(st)) {
        documents.push({
          id: `doc-${job.id}-act`,
          jobId: job.id,
          kind: 'completion_act',
          number: `ACT-${cc}-${2000 + ji}`,
          createdAt: dAgo(1),
        });
        documents.push({
          id: `doc-${job.id}-inv`,
          jobId: job.id,
          kind: 'invoice',
          number: `INV-${cc}-${3000 + ji}`,
          createdAt: dAgo(1),
        });
      }

      // Add Reviews for completed jobs
      if (st === 'paid_out') {
        reviews.push({
          id: `rev-${job.id}-cust`,
          jobId: job.id,
          countryCode: cc,
          fromId: customer.id,
          toId: assignedWorker.id,
          direction: 'customer_to_worker',
          criteria: { quality: 5, punctuality: 5, communication: 4, value: 5 },
          overall: 4.8,
          text: 'Excellent work, very professional and punctual. Finished exactly within the scheduled timeline!',
          createdAt: dAgo(1),
        });
      }
    }

    // 6. Seed 3 Disputes
    for (let di = 0; di < 3; di++) {
      const disputedJob = jobs[di + 3];
      const disp: Dispute = {
        id: `dsp-${cc.toLowerCase()}-${di + 1}`,
        jobId: disputedJob.id,
        countryCode: cc,
        openedBy: disputedJob.customerId,
        reason: di === 0 ? 'quality' : di === 1 ? 'late' : 'scope',
        description: 'Discrepancy observed in the finished coat coverage requiring arbitration review.',
        desiredOutcome: di === 0 ? 'rework' : 'partial_refund',
        evidence: [evidence[0]],
        notes: [{ id: `note-${di}-1`, authorId: null, text: 'Platform mediator assigned to review case.', createdAt: dAgo(1) }],
        stage: di === 0 ? 'opened' : di === 1 ? 'evidence' : 'mediation',
        slaDueAt: dAhead(1),
        createdAt: dAgo(2),
      };
      disputes.push(disp);
    }

    // 7. Seed Wallet Transactions
    for (let wi = 0; wi < 10; wi++) {
      walletTransactions.push({
        id: `tx-${cc.toLowerCase()}-${wi + 1}`,
        userId: seededWorkers[wi % seededWorkers.length].id,
        countryCode: cc,
        type: wi % 3 === 0 ? 'withdrawal' : 'earning',
        direction: wi % 3 === 0 ? 'out' : 'in',
        amount: Math.round(pack.companyApprovalThreshold * (0.2 + (wi % 5) * 0.15)),
        fee: wi % 3 === 0 ? pack.fees.payoutFee : 0,
        status: 'completed',
        methodId: pack.payments.payoutMethods[0].id,
        createdAt: dAgo(30 - wi * 3),
      });
    }

    // 8. Seed Admin Queues (KYC, Flags, Payout exceptions)
    kycCases.push(
      {
        id: `kyc-${cc.toLowerCase()}-1`,
        countryCode: cc,
        userId: seededWorkers[10].id,
        level: 2,
        status: 'pending',
        riskFlags: [],
        submittedAt: dAgo(1),
      },
      {
        id: `kyc-${cc.toLowerCase()}-2`,
        countryCode: cc,
        userId: seededWorkers[0].id,
        level: 3,
        tradeCategoryId: 'electrical',
        status: 'pending',
        riskFlags: ['requires_permit_verification'],
        submittedAt: dAgo(2),
      },
    );

    flags.push({
      id: `flg-${cc.toLowerCase()}-1`,
      countryCode: cc,
      entityType: 'message',
      entityId: `msg-${jobs[0].id}-2`,
      reason: 'contact_sharing',
      snippet: 'User attempted to share off-platform phone number in chat.',
      status: 'open',
      createdAt: dAgo(1),
    });

    payoutExceptions.push({
      id: `pex-${cc.toLowerCase()}-1`,
      countryCode: cc,
      userId: seededWorkers[4].id,
      txId: `tx-${cc.toLowerCase()}-1`,
      amount: 1500,
      reason: 'name_mismatch',
      status: 'open',
      createdAt: dAgo(2),
    });
  }

  return {
    users,
    companies,
    tasks,
    offers,
    jobs,
    messages,
    evidence,
    documents,
    disputes,
    reviews,
    walletTransactions,
    kycCases,
    flags,
    payoutExceptions,
    auditEvents,
  };
}
