import type { DocumentService } from '../interfaces';
import type { JobDocument, RenderedDocument, ID } from '../types';
import type { DocumentKind, Locale } from '@/countries/types';
import { mockStore } from '@/mock/store';
import { ServiceError } from '../errors';
import { COUNTRY_PACKS } from '@/countries';
import { BRAND_NAME } from '@/config/brand';
import { computeFees } from '@/lib/fees';
import { formatCurrency, formatDate, getLocalizedText } from '@/i18n/formatters';

export class MockDocumentService implements DocumentService {
  async list(jobId: ID): Promise<JobDocument[]> {
    await mockStore.simulateLatency();
    return mockStore.getData().documents.filter((d) => d.jobId === jobId).map((d) => ({ ...d }));
  }

  async render(docId: ID, locale: Locale): Promise<RenderedDocument> {
    await mockStore.simulateLatency();
    const doc = mockStore.getData().documents.find((d) => d.id === docId);
    if (!doc) throw new ServiceError('not_found', `Document ${docId} not found`);
    return this.compileDocument(doc.jobId, doc.kind, doc.number, doc.createdAt, locale);
  }

  async preview(jobId: ID, kind: DocumentKind, locale: Locale): Promise<RenderedDocument> {
    await mockStore.simulateLatency();
    return this.compileDocument(jobId, kind, `PREVIEW-${Date.now().toString().slice(-4)}`, new Date().toISOString(), locale);
  }

  async download(docId: ID): Promise<{ fileName: string }> {
    await mockStore.simulateLatency(150);
    const doc = mockStore.getData().documents.find((d) => d.id === docId);
    return { fileName: `${doc?.number || 'document'}.pdf` };
  }

  private compileDocument(
    jobId: ID,
    kind: DocumentKind,
    docNumber: string,
    createdAt: string,
    locale: Locale,
  ): RenderedDocument {
    const { jobs, tasks, users } = mockStore.getData();
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new ServiceError('not_found', `Job ${jobId} not found`);

    const task = tasks.find((t) => t.id === job.taskId);
    const customer = users.find((u) => u.id === job.customerId);
    const worker = users.find((u) => u.id === job.workerId);

    const pack = COUNTRY_PACKS[job.countryCode] || COUNTRY_PACKS.UA;
    const template = pack.tax.documentTemplates.find((t) => t.kind === kind) || pack.tax.documentTemplates[0];

    const fees = computeFees(job.amount, pack);
    const city = pack.cities.find((c) => c.id === task?.cityId) || pack.cities[0];

    const milestonesText = job.milestones
      .map(
        (m, idx) =>
          `  ${idx + 1}. ${getLocalizedText(m.title, locale)}: ${formatCurrency(m.amount, pack, locale)} (${m.status})`,
      )
      .join('\n');

    let body = getLocalizedText(template.body, locale);
    const replacements: Record<string, string> = {
      '{{brand}}': BRAND_NAME,
      '{{docNumber}}': docNumber,
      '{{date}}': formatDate(createdAt, 'PPP', locale),
      '{{city}}': getLocalizedText(city.name, locale),
      '{{customerName}}': getLocalizedText(customer?.name, locale),
      '{{workerName}}': getLocalizedText(worker?.name, locale),
      '{{workerStatus}}': getLocalizedText(pack.tax.workerStatuses[0]?.label, locale),
      '{{taskTitle}}': getLocalizedText(task?.title, locale),
      '{{amount}}': formatCurrency(job.amount, pack, locale),
      '{{customerFee}}': formatCurrency(fees.customerFee, pack, locale),
      '{{workerFee}}': formatCurrency(fees.workerFee, pack, locale),
      '{{customerPays}}': formatCurrency(fees.customerPays, pack, locale),
      '{{workerReceives}}': formatCurrency(fees.workerReceives, pack, locale),
      '{{partnerName}}': pack.payments.partnerName,
      '{{protectedPaymentLabel}}': getLocalizedText(pack.payments.protectedPaymentLabel, locale),
      '{{milestones}}': milestonesText,
      '{{autoReleaseDays}}': String(pack.autoReleaseDays),
    };

    for (const [key, val] of Object.entries(replacements)) {
      body = body.split(key).join(val);
    }

    return {
      id: docNumber.startsWith('PREVIEW') ? null : docNumber,
      kind,
      title: getLocalizedText(template.title, locale),
      number: docNumber,
      body,
      createdAt,
    };
  }
}
