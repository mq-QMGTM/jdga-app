import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Plane, MapPin, Download, Upload, Trash2, ChevronRight } from 'lucide-react';
import type { UserSettings } from '@/types';
import { getSettings, setHomeAirport } from '@/lib/storage';
import { toast } from 'sonner';

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [form, setForm] = useState({
    homeAirportCode: '',
    homeAirportName: '',
    homeCity: '',
    homeState: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSettings();
    setSettings(data);
    setForm({
      homeAirportCode: data.homeAirportCode || '',
      homeAirportName: data.homeAirportName || '',
      homeCity: data.homeCity || '',
      homeState: data.homeState || '',
    });
  };

  const handleSave = async () => {
    if (!form.homeCity || !form.homeState) {
      toast.error('Please enter your home city and state');
      return;
    }

    setSaving(true);
    try {
      await setHomeAirport(form.homeAirportCode, form.homeAirportName, form.homeCity, form.homeState);
      toast.success('Settings saved!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-safe">
      <PageHeader title="Settings" showBack />

      <div className="px-5 py-4 space-y-6">
        {/* Home location */}
        <div>
          <p className="section-header px-0 mt-0">Home Location</p>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="nav-row-icon"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <MapPin className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <p className="text-[15px] text-[var(--foreground-tertiary)]">
                Used to calculate flight times
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={form.homeCity}
                onChange={(e) => setForm({ ...form, homeCity: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="State"
                value={form.homeState}
                onChange={(e) => setForm({ ...form, homeState: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Home airport */}
        <div>
          <p className="section-header px-0 mt-0">Home Airport</p>
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="nav-row-icon"
                style={{ backgroundColor: '#007aff' }}
              >
                <Plane className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <p className="text-[15px] text-[var(--foreground-tertiary)]">
                Your primary departure airport
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Airport Code (e.g., LAX)"
                value={form.homeAirportCode}
                onChange={(e) => setForm({ ...form, homeAirportCode: e.target.value.toUpperCase() })}
                maxLength={4}
                className="input uppercase"
              />
              <input
                type="text"
                placeholder="Airport Name (e.g., Los Angeles International)"
                value={form.homeAirportName}
                onChange={(e) => setForm({ ...form, homeAirportName: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {/* Data management */}
        <div>
          <p className="section-header px-0">Data Management</p>
          <div className="list-group">
            <button className="nav-row w-full text-left">
              <div className="nav-row-icon" style={{ backgroundColor: '#34c759' }}>
                <Download className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="nav-row-content">
                <div className="nav-row-title">Export All Data</div>
              </div>
              <ChevronRight className="w-5 h-5 nav-row-chevron" />
            </button>
            <button className="nav-row w-full text-left">
              <div className="nav-row-icon" style={{ backgroundColor: '#007aff' }}>
                <Upload className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="nav-row-content">
                <div className="nav-row-title">Import Data</div>
              </div>
              <ChevronRight className="w-5 h-5 nav-row-chevron" />
            </button>
            <button className="nav-row w-full text-left">
              <div className="nav-row-icon" style={{ backgroundColor: '#ff3b30' }}>
                <Trash2 className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="nav-row-content">
                <div className="nav-row-title text-[#ff3b30]">Clear All Data</div>
              </div>
              <ChevronRight className="w-5 h-5 nav-row-chevron" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
