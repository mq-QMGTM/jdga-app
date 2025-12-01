import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { createContact } from '@/lib/storage';
import type { SkillLevel, PlayFrequency } from '@/types';
import { toast } from 'sonner';

const styles = {
  page: {
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 90px)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  form: {
    padding: '0 20px',
    marginTop: '24px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: '#6b7280',
    marginBottom: '12px',
  },
  inputGroup: {
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '16px 18px',
    backgroundColor: '#1c1c1e',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    fontSize: '17px',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  inputFocus: {
    borderColor: '#22c55e',
  },
  select: {
    width: '100%',
    padding: '16px 18px',
    backgroundColor: '#1c1c1e',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    fontSize: '17px',
    color: '#fff',
    outline: 'none',
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 18px center',
    paddingRight: '48px',
  },
  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: 500,
    color: '#9ca3af',
    marginBottom: '8px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  checkboxContainer: {
    marginBottom: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '18px',
    backgroundColor: '#1c1c1e',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  checkboxLabelActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: '2px solid #4b5563',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    appearance: 'none' as const,
    position: 'relative' as const,
    transition: 'all 0.2s ease',
  },
  checkboxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkboxText: {
    fontSize: '17px',
    color: '#fff',
    fontWeight: 500,
  },
  textarea: {
    width: '100%',
    padding: '16px 18px',
    backgroundColor: '#1c1c1e',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    fontSize: '17px',
    color: '#fff',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '120px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  submitButton: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  placeholder: {
    color: '#6b7280',
  },
};

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
    <div style={styles.page}>
      <PageHeader title="Add Buddy" showBack />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Name</h3>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="First Name *"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Last Name *"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Nickname (optional)"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>

        {/* Location section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Location</h3>
          <div style={styles.row}>
            <input
              type="text"
              placeholder="City *"
              value={form.homeCity}
              onChange={(e) => setForm({ ...form, homeCity: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="State *"
              value={form.homeState}
              onChange={(e) => setForm({ ...form, homeState: e.target.value })}
              style={styles.input}
              required
            />
          </div>
        </div>

        {/* Golf profile section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Golf Profile</h3>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Skill Level</label>
            <select
              value={form.skillLevel}
              onChange={(e) => setForm({ ...form, skillLevel: e.target.value as SkillLevel })}
              style={styles.select}
            >
              <option value="recreational">Recreational</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Play Frequency</label>
            <select
              value={form.playFrequency}
              onChange={(e) => setForm({ ...form, playFrequency: e.target.value as PlayFrequency })}
              style={styles.select}
            >
              <option value="occasional">Occasional (1-20 rounds/year)</option>
              <option value="regular">Regular (20-50 rounds/year)</option>
              <option value="avid">Avid (50+ rounds/year)</option>
            </select>
          </div>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Approx. Age</label>
              <input
                type="number"
                placeholder="45"
                value={form.approximateAge}
                onChange={(e) => setForm({ ...form, approximateAge: e.target.value })}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>Handicap</label>
              <input
                type="number"
                step="0.1"
                placeholder="8.5"
                value={form.handicap}
                onChange={(e) => setForm({ ...form, handicap: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contact Info (Optional)</h3>
          <div style={styles.inputGroup}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>

        {/* Relationship section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Relationship</h3>
          <div style={styles.checkboxContainer}>
            <label
              style={{
                ...styles.checkboxLabel,
                ...(form.hasPlayedWith ? styles.checkboxLabelActive : {}),
              }}
            >
              <input
                type="checkbox"
                checked={form.hasPlayedWith}
                onChange={(e) => setForm({ ...form, hasPlayedWith: e.target.checked })}
                style={{
                  ...styles.checkbox,
                  ...(form.hasPlayedWith ? styles.checkboxChecked : {}),
                }}
              />
              <span style={styles.checkboxText}>Have played together</span>
            </label>
          </div>
          <div style={styles.checkboxContainer}>
            <label
              style={{
                ...styles.checkboxLabel,
                ...(form.wouldPlayWith ? styles.checkboxLabelActive : {}),
              }}
            >
              <input
                type="checkbox"
                checked={form.wouldPlayWith}
                onChange={(e) => setForm({ ...form, wouldPlayWith: e.target.checked })}
                style={{
                  ...styles.checkbox,
                  ...(form.wouldPlayWith ? styles.checkboxChecked : {}),
                }}
              />
              <span style={styles.checkboxText}>Would play with</span>
            </label>
          </div>
        </div>

        {/* Notes section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Notes</h3>
          <textarea
            placeholder="Add notes about this buddy (e.g., how you met, memorable rounds together, playing style, etc.)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            style={styles.textarea}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={saving}
          style={{
            ...styles.submitButton,
            ...(saving ? styles.submitButtonDisabled : {}),
          }}
        >
          {saving ? 'Adding Buddy...' : 'Add Buddy'}
        </button>
      </form>
    </div>
  );
}
