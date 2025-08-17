'use client';

import { useState } from 'react';

export default function LeadForm({ onSubmitLead, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!formData.first_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    await onSubmitLead(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="p-2">
      <h4 className="font-bold text-center mb-2 text-gray-800">
        A specialist can help. Please provide your details.
      </h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name*"
            className="border rounded-md px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border rounded-md px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address*"
          className="w-full border rounded-md px-3 py-2  text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number*"
          className="w-full border rounded-md px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Submitting...' : 'Request a Call'}
        </button>
      </form>
    </div>
  );
}