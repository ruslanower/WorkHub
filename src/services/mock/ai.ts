import type { AIService } from '../interfaces';
import type {
  AITaskParseResult,
  AIFraudResult,
  AIMatchScoreResult,
  GoogleCloudCreditAllocation,
  ID,
} from '../types';
import { maskContacts } from '@/lib/mask';
import { getServices } from '../registry';

// Artificial latency helper (200 - 350ms) to mirror Vertex AI / Gemini API
const simulateLatency = (ms: number = 280) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class MockAIService implements AIService {
  async parseTaskPrompt(prompt: string, countryCode: string = 'UA'): Promise<AITaskParseResult> {
    await simulateLatency(290);

    const lower = prompt.toLowerCase();
    const isUa = countryCode === 'UA';

    // Heuristic classification based on user keywords
    if (lower.includes('door') || lower.includes('двер') || lower.includes('фарб') || lower.includes('paint') || lower.includes('склад') || lower.includes('warehouse')) {
      return {
        categoryId: lower.includes('paint') || lower.includes('фарб') ? 'painting' : 'repair',
        title: {
          en: 'Warehouse Door Alignment & Industrial Floor Coating',
          uk: 'Ремонт складських дверей та фарбування промислової підлоги',
        },
        description: {
          en: '1. Inspect and adjust 3 metal roll-up/hinged warehouse doors, align hinges, calibrate locks.\n2. Surface preparation (degreasing and industrial primer) of designated floor area (approx. 180-220 m²).\n3. Apply two coats of high-durability epoxy/polyurethane floor paint.\n4. Clean site and remove debris.',
          uk: '1. Огляд та регулювання 3 металевих складських дверей, вирівнювання петель, калібрування замків.\n2. Підготовка поверхні (знежирення та нанесення ґрунтовки) складської зони (~180-220 м²).\n3. Нанесення двох шарів зносостійкої епоксидної фарби для бетонних підлог.\n4. Фінальне прибирання та вивіз технічного сміття.',
        },
        safetyChecklist: [
          {
            id: 'ppe_respirator',
            label: { en: 'Organic Vapor Respirator (FFP3 / A1P2)', uk: 'Респіратор від органічних парів (FFP3 / A1P2)' },
            required: true,
          },
          {
            id: 'ppe_eyewear',
            label: { en: 'Safety Goggles with side shields', uk: 'Захисні закриті окуляри' },
            required: true,
          },
          {
            id: 'ppe_gloves',
            label: { en: 'Nitrile chemical-resistant gloves', uk: 'Нітрилові хімостійкі рукавиці' },
            required: true,
          },
          {
            id: 'ppe_boots',
            label: { en: 'Steel-toe non-slip safety boots', uk: 'Спецвзуття з металевим підноском' },
            required: true,
          },
          {
            id: 'ppe_ventilation',
            label: { en: 'Forced ventilation / airflow verified', uk: 'Примусова вентиляція робочої зони' },
            required: false,
          },
        ],
        recommendedVerificationLevel: 2,
        verificationReasoning: {
          en: 'Recommended Level 2 (Diia.ID): Access to commercial warehouse facility with high-value logistics goods requires verified identity.',
          uk: 'Рекомендовано Рівень 2 (Дія.Підпис): Доступ до комерційного складу з матеріальними цінностями потребує верифікованої особи.',
        },
        durationHours: 16,
        priceGuidance: {
          min: isUa ? 12000 : 1800,
          max: isUa ? 22000 : 3200,
          median: isUa ? 16500 : 2400,
          confidencePct: 94,
        },
        milestonePlan: [
          { title: { en: 'Phase 1: Door repairs & surface prep' }, share: 0.35 },
          { title: { en: 'Phase 2: Painting & finishing coats' }, share: 0.45 },
          { title: { en: 'Phase 3: Final inspection & site acceptance' }, share: 0.2 },
        ],
        tokensUsed: 438,
        latencyMs: 290,
        model: 'gemini-1.5-flash',
      };
    }

    if (lower.includes('електр') || lower.includes('electric') || lower.includes('ecoflow') || lower.includes('щит') || lower.includes('генератор') || lower.includes('зарядн')) {
      return {
        categoryId: 'electrical',
        title: {
          en: 'Backup Power Station Integration & DB Upgrade',
          uk: 'Підключення зарядної станції/генератора та модернізація електрощитка',
        },
        description: {
          en: '1. Install automatic transfer switch (ATS / Ввідний автомат) and backup line routing.\n2. Safely integrate inverter / EcoFlow / generator connection box.\n3. Test grounding, voltage stability under 5kW load, and circuit breaker operation.\n4. Provide client safety briefing and electrical schematic tag.',
          uk: '1. Встановлення перемикача введення резерву (ручний/автоматичний) та лінії резервного живлення.\n2. Безпечне підключення зарядної станції EcoFlow / інвертора / генератора через щит розподілу.\n3. Тестування заземлення, реле напруги та автоматів під навантаженням до 5 кВт.\n4. Інструктаж замовника та маркування силових ліній.',
        },
        safetyChecklist: [
          {
            id: 'ppe_voltage_detector',
            label: { en: 'Calibrated non-contact voltage tester', uk: 'Покажчик напруги та діелектричний інструмент (до 1000В)' },
            required: true,
          },
          {
            id: 'ppe_dielectric_gloves',
            label: { en: 'Class 0 Dielectric gloves', uk: 'Діелектричні рукавички (клас 0)' },
            required: true,
          },
          {
            id: 'ppe_face_shield',
            label: { en: 'Arc-flash protective face shield', uk: 'Захисний щиток від електричної дуги' },
            required: true,
          },
        ],
        recommendedVerificationLevel: 3,
        verificationReasoning: {
          en: 'Level 3 Required: High-voltage electrical installations legally require certified electrical safety qualification and verified trade permit.',
          uk: 'Обов’язковий Рівень 3: Роботи з електрощитовим обладнанням вимагають підтвердженого посвідчення з електробезпеки (III+ група допуску).',
        },
        durationHours: 6,
        priceGuidance: {
          min: isUa ? 4000 : 600,
          max: isUa ? 9500 : 1400,
          median: isUa ? 6200 : 950,
          confidencePct: 98,
        },
        milestonePlan: [
          { title: { en: 'Phase 1: Installation of transfer switch & line prep' }, share: 0.5 },
          { title: { en: 'Phase 2: Load testing, commissioning & safety signoff' }, share: 0.5 },
        ],
        tokensUsed: 482,
        latencyMs: 310,
        model: 'gemini-1.5-pro',
      };
    }

    if (lower.includes('смітт') || lower.includes('демонт') || lower.includes('move') || lower.includes('переїзд') || lower.includes('вантаж')) {
      return {
        categoryId: 'moving',
        title: {
          en: 'Demolition Debris Removal & Heavy Hauling',
          uk: 'Демонтажні роботи та вивезення будівельного сміття',
        },
        description: {
          en: '1. Safe bagging and loading of approx. 3.5-4.5 tonnes of construction debris.\n2. Transport to official municipal waste disposal facility.\n3. Sweep and clear service stairwell and loading zone.',
          uk: '1. Фасування в мішки та спуск будівельного сміття (орієнтовно 3.5 - 4.5 тонни).\n2. Завантаження у вантажний транспорт та вивезення на сертифіковане сміттєзвалище.\n3. Підмітання сходового майданчика та прибудинкової території.',
        },
        safetyChecklist: [
          {
            id: 'ppe_heavy_gloves',
            label: { en: 'Heavy-duty cut-resistant gloves', uk: 'Міцні посилені рукавиці (захист від порізів)' },
            required: true,
          },
          {
            id: 'ppe_respirator',
            label: { en: 'Dust respirator (FFP2)', uk: 'Респіратор від мінерального пилу (FFP2)' },
            required: true,
          },
          {
            id: 'ppe_back_brace',
            label: { en: 'Ergonomic lumbar support belt', uk: 'Ергономічний пояс для захисту попереку' },
            required: false,
          },
        ],
        recommendedVerificationLevel: 1,
        verificationReasoning: {
          en: 'Level 1 (ID & Liveness Check) is sufficient for non-structural logistics and hauling.',
          uk: 'Рівень 1 (Паспорт + Селфі) достатній для логістичних та вантажних робіт.',
        },
        durationHours: 8,
        priceGuidance: {
          min: isUa ? 3500 : 500,
          max: isUa ? 7500 : 1100,
          median: isUa ? 5200 : 800,
          confidencePct: 91,
        },
        milestonePlan: [
          { title: { en: 'Phase 1: Loading & site departure' }, share: 0.5 },
          { title: { en: 'Phase 2: Disposal receipt & area handover' }, share: 0.5 },
        ],
        tokensUsed: 395,
        latencyMs: 260,
        model: 'gemini-1.5-flash',
      };
    }

    // Default intelligent fallback
    return {
      categoryId: 'repair',
      title: {
        en: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
        uk: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
      },
      description: {
        en: `1. Comprehensive inspection and execution of: "${prompt}".\n2. Adherence to safety protocol and standard building codes.\n3. Bilateral completion inspection upon delivery.`,
        uk: `1. Огляд об'єкта та виконання робіт за запитом: "${prompt}".\n2. Дотримання техніки безпеки та будівельних нормативів.\n3. Спільна перевірка та підписання акту приймання.`,
      },
      safetyChecklist: [
        {
          id: 'ppe_standard_gloves',
          label: { en: 'Protective work gloves', uk: 'Захисні робочі рукавиці' },
          required: true,
        },
        {
          id: 'ppe_safety_boots',
          label: { en: 'Reinforced work boots', uk: 'Робоче взуття з посиленою підошвою' },
          required: true,
        },
      ],
      recommendedVerificationLevel: 1,
      verificationReasoning: {
        en: 'Level 1 (Photo ID & selfie liveness check) recommended as baseline.',
        uk: 'Рекомендовано базовий Рівень 1 (Паспорт та селфі-перевірка).',
      },
      durationHours: 8,
      priceGuidance: {
        min: isUa ? 2500 : 350,
        max: isUa ? 6500 : 900,
        median: isUa ? 4200 : 600,
        confidencePct: 88,
      },
      milestonePlan: [
        { title: { en: 'Phase 1: Mobilization & Initial Progress' }, share: 0.4 },
        { title: { en: 'Phase 2: Completion & Final Handover' }, share: 0.6 },
      ],
      tokensUsed: 360,
      latencyMs: 250,
      model: 'gemini-1.5-flash',
    };
  }

  async detectChatFraud(message: string): Promise<AIFraudResult> {
    await simulateLatency(160);

    const maskRes = maskContacts(message);
    const lower = message.toLowerCase();

    const bypassKeywords = [
      'готівк',
      'на карту',
      'на картку',
      'скинь напряму',
      'без комісії',
      'в обхід',
      'кеш',
      'вайбер',
      'телеграм',
      'ватсап',
      'direct transfer',
      'cash in hand',
      'bypass',
      'off-platform',
    ];

    const detected = bypassKeywords.filter((kw) => lower.includes(kw));
    const hasPhoneOrHandle = maskRes.masked;

    if (hasPhoneOrHandle || detected.length > 0) {
      return {
        safe: false,
        riskScore: hasPhoneOrHandle ? 88 : 72,
        detectedEntities: [
          ...(hasPhoneOrHandle ? ['Contact Number / Handle Shielded'] : []),
          ...detected.map((d) => `Bypass trigger: "${d}"`),
        ],
        recommendation: {
          en: 'Gemini Safety Filter Alert: Off-platform communication detected. Keep all payments inside WorkHub Escrow to maintain payment guarantee, Diia.Signature contracts, and insurance coverage.',
          uk: 'Попередження Gemini Safety Filter: Виявлено спробу передачі контактів або обходу оплати. Проводьте угоду через Escrow WorkHub для збереження страхового захисту та гарантії виплати.',
        },
        maskedText: maskRes.text,
        flaggedReason: 'Off-platform contact/payment bypass attempt',
      };
    }

    return {
      safe: true,
      riskScore: 6,
      detectedEntities: [],
      recommendation: {
        en: 'Message content compliant with WorkHub Fair Exchange policy.',
        uk: 'Повідомлення відповідає політиці безпеки платформи.',
      },
      maskedText: message,
    };
  }

  async calculateMatchScore(taskId: ID, workerId: ID): Promise<AIMatchScoreResult> {
    await simulateLatency(180);

    const services = getServices();
    let worker;
    try {
      worker = await services.users.get(workerId);
    } catch {
      // Fallback
    }

    const hasVeteranBadge = worker?.programs?.some(
      (p) => p.programId === 'veterans' && p.status === 'verified',
    );
    const hasIdpBadge = worker?.programs?.some(
      (p) => p.programId === 'idp' && p.status === 'verified',
    );

    const isPriority = Boolean(hasVeteranBadge || hasIdpBadge);
    const beneficiaryType = hasVeteranBadge ? 'veteran' : hasIdpBadge ? 'idp' : 'none';

    // Algorithmic weights
    const spatialScore = 28; // out of 30 (Google Maps Distance Matrix)
    const trustScore = 28; // out of 30 (Ratings & Escrow history)
    const skillsScore = 24; // out of 25 (Category matches)
    const socialBoost = isPriority ? 14 : 0; // +14 bonus points for Veterans & IDPs

    const total = Math.min(100, spatialScore + trustScore + skillsScore + socialBoost);

    return {
      workerId,
      totalScore: total,
      breakdown: {
        spatial: spatialScore,
        trust: trustScore,
        skills: skillsScore,
        socialBoost,
      },
      distanceKm: 2.8,
      etaMinutes: 11,
      isPriorityBeneficiary: isPriority,
      beneficiaryType,
      explanation: {
        en: isPriority
          ? `Top 5% Match: Excellent proximity (2.8 km via Google Maps), Trust Score 94+, plus Verified ${
              hasVeteranBadge ? 'Ukrainian Veteran' : 'IDP'
            } priority inclusion boost (+14%).`
          : 'High compatibility: Close proximity (2.8 km via Google Maps) and high reliability rating.',
        uk: isPriority
          ? `Топ 5% рекомендація: Оптимальна локація (2.8 км через Google Maps), Trust Score 94+, пріоритетний буст для верифікованого ${
              hasVeteranBadge ? 'Ветерана ЗСУ' : 'ВПО'
            } (+14%).`
          : 'Висока відповідність: Близька локація (2.8 км через Google Maps) та підтверджена кваліфікація.',
      },
    };
  }

  getCloudCreditPlan(): GoogleCloudCreditAllocation[] {
    return [
      {
        id: 'vertex-ai-models',
        pillar: 'AI / DeepTech Core',
        googleService: 'Google Vertex AI & Custom Fine-Tuning',
        allocatedAmount: 120000,
        percentage: 34.3,
        description: {
          en: 'Fine-tuning proprietary embedding & LLM models on Ukrainian/CEE trade lexicons, contractor competency matching, and automated SOW verification.',
          uk: 'Довчання спеціалізованих моделей ембедінгів та LLM на будівельних регламентах, матчингу навичок та автоматичній генерації ТЗ.',
        },
        architectureRole: {
          en: 'Worker ranking ML pipeline, automated dispute classification, embeddings vector search in Vertex Feature Store.',
          uk: 'ML-пайплайн ранжування, класифікація спорів, векторний пошук у Vertex Feature Store.',
        },
      },
      {
        id: 'gemini-inference',
        pillar: 'Natural Language & Vision',
        googleService: 'Gemini 1.5 Pro / Flash Multi-modal APIs',
        allocatedAmount: 95000,
        percentage: 27.1,
        description: {
          en: 'Real-time multi-modal parsing of voice/text customer requests, photo evidence validation for completion acts, and chat safety filtering.',
          uk: 'Мультимодальний аналіз голосових та текстових замовлень, валідація фото-доказів для актів приймання, безпека чату.',
        },
        architectureRole: {
          en: 'Zero-shot SOW generator, PPE safety checklist auto-detection, fraud & bypass detection in communication threads.',
          uk: 'Генератор кошторисів та ТЗ, автоматичне визначення засобів захисту (ЗІЗ), блокування шахрайства в чаті.',
        },
      },
      {
        id: 'maps-platform',
        pillar: 'Spatial & Logistics Engine',
        googleService: 'Google Maps Platform (Distance Matrix, Places, Geocoding)',
        allocatedAmount: 60000,
        percentage: 17.1,
        description: {
          en: 'Hyper-local spatial routing, real-time travel duration calculation, and regional cluster optimization across Ukrainian cities.',
          uk: 'Мікролокальна маршрутизація, розрахунок часу доїзду з урахуванням трафіку та оптимізація міських кластерів.',
        },
        architectureRole: {
          en: 'Real-time ETA calculation, spatial match constraint (<15 km radius), hardware supply store routing.',
          uk: 'Динамічний розрахунок часу в дорозі, просторовий фільтр (<15 км), навігація до будівельних магазинів.',
        },
      },
      {
        id: 'firebase-spanner',
        pillar: 'Real-time State & DB',
        googleService: 'Firebase Auth, Cloud Firestore & Cloud Spanner',
        allocatedAmount: 45000,
        percentage: 12.9,
        description: {
          en: 'High-throughput escrow state synchronization, real-time multi-party Job Room websocket communication, and secure Diia.ID token vault.',
          uk: 'Синхронізація захищених платежів у реальному часі, вебсокети Job Room та безпечне сховище токенів Дія.ID.',
        },
        architectureRole: {
          en: 'Sub-100ms state updates for payments, milestone sign-offs, and Diia.Signature audit ledger.',
          uk: 'Суб-100мс оновлення статусів угод, підписання етапів та аудит-лог Дія.Підпис.',
        },
      },
      {
        id: 'cloud-run-infra',
        pillar: 'Global Infrastructure & Security',
        googleService: 'Cloud Run, Cloud Armor & Google Cloud VPC',
        allocatedAmount: 30000,
        percentage: 8.6,
        description: {
          en: 'Serverless container orchestration, enterprise DDoS protection, and sovereign European datacenter compliance (EU Frankfurt/Warsaw).',
          uk: 'Безсерверна оркестрація контейнерів, захист від DDoS (Cloud Armor) та розміщення в європейських датацентрах GCP.',
        },
        architectureRole: {
          en: 'Auto-scaling microservices architecture with 99.99% availability during peak civil infrastructure rebuilding periods.',
          uk: 'Автомасштабована мікросервісна архітектура з доступністю 99.99% для відбудови цивільної інфраструктури.',
        },
      },
    ];
  }
}
