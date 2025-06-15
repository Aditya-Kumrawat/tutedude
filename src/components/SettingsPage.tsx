import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Language</label>
          <select className="w-full p-2 border rounded-lg">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          <input type="checkbox" className="toggle toggle-emerald" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Dark Theme</span>
          <input type="checkbox" className="toggle toggle-emerald" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 