import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { createContact } from '@/lib/storage';
import type { SkillLevel, PlayFrequency } from '@/types';
import { toast } from 'sonner';

export function AddBuddyPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    homeCity: '',
    homeState: '',
    skillLevel: 'intermediate' as SkillLevel,
    playFrequency: 'regular' as PlayFrequency,
    approximateAge: '',
    handicap: '',
    phone: '',
    email: '',
    hasPlayedWith: false,
    wouldPlayWith: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.homeCity || !form.homeState) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      await createContact({
        firstName: form.firstName,
        lastName: form.lastName,
        nickname: form.nickname || undefined,
        homeCity: form.homeCity,
        homeState: form.homeState,
        skillLevel: form.skillLevel,
        playFrequency: form.playFrequency,
        approximateAge: form.approximateAge ? parseInt(form.approximateAge) : undefined,
        handicap: form.handicap ? parseFloat(form.handicap) : undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        hasPlayedWith: form.hasPlayedWith,
        wouldPlayWith: form.wouldPlayWith,
        memberClubs: [],
        coursesPlayedTogether: [],
        knowsMemberAt: [],
        notes: form.notes || undefined,
      });

      toast.success('Buddy added!');
      navigate('/buddies');
    } catch (error) {
      toast.error('Failed to add buddy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-safe">
      <PageHeader title="Add Buddy" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-6">
        {/* Name section */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Name
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="First Name *"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              required
            />
            <input
              type="text"
              placeholder="Last Name *"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              required
            />
            <input
              type="text"
              placeholder="Nickname (optional)"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
            />
          </div>
        </section>

        {/* Location section */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Location
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City *"
              value={form.homeCity}
              onChange={(e) => setForm({ ...form, homeCity: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              required
            />
            <input
              type="text"
              placeholder="State *"
              value={form.homeState}
              onChange={(e) => setForm({ ...form, homeState: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              required
            />
          </div>
        </section>

        {/* Golf profile section */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Golf Profile
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--foreground-muted)] mb-1 block">Skill Level</label>
              <select
                value={form.skillLevel}
                onChange={(e) => setForm({ ...form, skillLevel: e.target.value as SkillLevel })}
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)]"
              >
                <option value="recreational">Recreational</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--foreground-muted)] mb-1 block">Play Frequency</label>
              <select
                value={form.playFrequency}
                onChange={(e) => setForm({ ...form, playFrequency: e.target.value as PlayFrequency })}
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)]"
              >
                <option value="occasional">Occasional</option>
                <option value="regular">Regular</option>
                <option value="avid">Avid</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Approx. Age"
                value={form.approximateAge}
                onChange={(e) => setForm({ ...form, approximateAge: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Handicap"
                value={form.handicap}
                onChange={(e) => setForm({ ...form, handicap: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              />
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Contact (Optional)
          </h3>
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
            />
          </div>
        </section>

        {/* Relationship section */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Relationship
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasPlayedWith}
                onChange={(e) => setForm({ ...form, hasPlayedWith: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)]"
              />
              <span className="text-[var(--foreground)]">Have played together</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={form.wouldPlayWith}
                onChange={(e) => setForm({ ...form, wouldPlayWith: e.target.checked })}
                className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)]"
              />
              <span className="text-[var(--foreground)]">Would play with</span>
            </label>
          </div>
        </section>

        {/* Notes section */}
        <section>
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Notes
          </h3>
          <textarea
            placeholder="Add notes about this buddy..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] resize-none"
          />
        </section>

        {/* Submit button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-[var(--primary)] text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Buddy'}
        </button>
      </form>
    </div>
  );
}
