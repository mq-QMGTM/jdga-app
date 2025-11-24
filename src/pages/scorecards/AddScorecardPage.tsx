import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Camera, PenLine, FileText } from 'lucide-react';

export function AddScorecardPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="pb-safe">
      <PageHeader title="Add Scorecard" showBack />

      <div className="px-4 py-6 space-y-4">
        {/* Manual entry option */}
        <button
          onClick={() => {/* TODO: Navigate to manual entry */}}
          className="w-full card card-hover p-4 flex items-start gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
            <PenLine className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--foreground)]">Manual Entry</h3>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
              Enter your scores hole by hole
            </p>
          </div>
        </button>

        {/* OCR option */}
        <button
          onClick={() => {/* TODO: Navigate to OCR capture */}}
          className="w-full card card-hover p-4 flex items-start gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Camera className="w-6 h-6 text-[var(--accent-foreground)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--foreground)]">Scan Scorecard</h3>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
              Take a photo and import scores automatically
            </p>
          </div>
        </button>

        {/* Quick score option */}
        <button
          onClick={() => {/* TODO: Navigate to quick entry */}}
          className="w-full card card-hover p-4 flex items-start gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--background-secondary)] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-[var(--foreground-muted)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--foreground)]">Quick Entry</h3>
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
              Just enter your total score
            </p>
          </div>
        </button>
      </div>

      <div className="px-4 py-4">
        <div className="bg-[var(--background-secondary)] rounded-lg p-4">
          <p className="text-xs text-[var(--foreground-muted)] text-center">
            Scorecard images will be stored locally on your device and can be viewed in your scorecard gallery.
          </p>
        </div>
      </div>
    </div>
  );
}
