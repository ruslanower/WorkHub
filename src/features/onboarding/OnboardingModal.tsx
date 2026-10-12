import * as React from 'react';
import { useAppStore } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/services/registry';
import { getLocalizedText } from '@/i18n/formatters';
import type { VerificationLevel } from '@/services/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Camera,
  FileBadge,
  Sparkles,
  Lock,
  QrCode,
  HeartHandshake,
} from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  defaultLevel?: VerificationLevel;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  onClose,
  defaultLevel = 2,
}) => {
  const { pack, locale, currentUser, refreshCurrentUser } = useAppStore();
  const { t } = useTranslation();

  const [selectedLevel, setSelectedLevel] = React.useState<VerificationLevel>(defaultLevel);
  const [selectedTrade, setSelectedTrade] = React.useState<string>(
    pack.regulatedTrades[0]?.categoryId || 'electrical',
  );
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isDone, setIsDone] = React.useState(false);
  const [optInPriority, setOptInPriority] = React.useState(true);
  const [selectedPriorityProgram, setSelectedPriorityProgram] = React.useState<string>('veterans');

  const levelConfig =
    pack.identity.levels.find((l) => l.level === selectedLevel) || pack.identity.levels[0];
  const steps = levelConfig.steps;

  const handleStartVerification = async () => {
    if (!currentUser) return;
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await getServices().identity.verify(currentUser.id, selectedLevel, {
        tradeCategoryId: selectedLevel === 3 ? selectedTrade : undefined,
      });

      if (res.ok) {
        if (selectedLevel >= 2 && optInPriority) {
          try {
            await getServices().identity.requestProgram(
              currentUser.id,
              selectedPriorityProgram,
              true,
            );
          } catch {
            // ignore if program not available
          }
        }
        await refreshCurrentUser();
        setIsDone(true);
      } else {
        setErrorMsg(res.reason ? t(`common.errors.${res.reason}`) : 'Verification unsuccessful');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setErrorMsg(null);
    setIsDone(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-verify" />
          <span>Trust, Identity & GovTech Integration (Diia.ID)</span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-6 text-sm text-foreground">
        {/* Verification Level Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-muted border border-border">
          {[
            { lvl: 0, label: 'L0: Phone' },
            { lvl: 1, label: 'L1: Photo ID' },
            { lvl: 2, label: 'L2: Diia.ID' },
            { lvl: 3, label: 'L3: Trade Lic' },
          ].map((item) => {
            const isSel = selectedLevel === item.lvl;
            return (
              <button
                key={item.lvl}
                type="button"
                onClick={() => {
                  setSelectedLevel(item.lvl as VerificationLevel);
                  handleReset();
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? 'bg-card text-foreground shadow-sm border border-border text-teal-600 dark:text-teal-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Selected Level Description */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground text-sm">
              {getLocalizedText(levelConfig.label, locale)}
            </h4>
            <Badge variant="verify">Level {selectedLevel}</Badge>
          </div>

          {selectedLevel === 2 && (
            <div className="space-y-1">
              <p className="text-xs text-verify font-semibold flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                State Digital ID Provider: {pack.identity.providerName} (Дія / Diia.Signature)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Zero-knowledge proof verification. Validates citizen identity and veteran/IDP certificates without storing documents.
              </p>
            </div>
          )}

          {selectedLevel === 3 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-foreground block">
                Select Regulated Trade to Certify:
              </label>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                {pack.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getLocalizedText(c.label, locale)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step-by-Step Flow */}
        {!isDone ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Verification Steps ({steps.length}):
              </span>
              {steps.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-muted/30 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-foreground">{getLocalizedText(st, locale)}</span>
                </div>
              ))}
            </div>

            {/* Level 2: Opt-in for Ukrainian Veteran or IDP program */}
            {selectedLevel === 2 && (
              <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInPriority}
                    onChange={(e) => setOptInPriority(e.target.checked)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Link Social Resilience Status via Diia (Optional)</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Enables priority algorithmic matching boost (+14%) and 0% platform fee for 6 months.
                    </span>
                  </div>
                </label>

                {optInPriority && (
                  <div className="flex gap-2 pt-1 pl-6">
                    <button
                      type="button"
                      onClick={() => setSelectedPriorityProgram('veterans')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        selectedPriorityProgram === 'veterans'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-card border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      🇺🇦 Ukrainian Veteran
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPriorityProgram('idp')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        selectedPriorityProgram === 'idp'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-card border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      🛡️ IDP (ВПО)
                    </button>
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 text-xs border border-rose-300/40">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Privacy Guarantee Note */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-muted-foreground border border-border">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">Zero-Knowledge Privacy:</span>
                <span>{getLocalizedText(pack.identity.privacyNote, locale)}</span>
              </div>
            </div>

            <Button
              className="w-full font-bold"
              variant="verify"
              size="lg"
              isLoading={isVerifying}
              onClick={handleStartVerification}
            >
              Verify via {pack.identity.providerName} (Diia.ID)
            </Button>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-lg text-foreground">
                Level {selectedLevel} Verification Confirmed!
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Your account is cryptographically verified via {pack.identity.providerName}. You now have full access to high-value Escrow jobs and priority matching.
              </p>
            </div>
            <Button variant="primary" onClick={onClose} className="mt-2 font-bold">
              Return to Platform
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
