import { useState } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { addContact } from '../services/api';

interface ContactFormProps {
  extractedData: {
    contacts: Array<{
      name: string;
      email: string;
      phone: string;
      company: string;
    }>;
    sender: {
      email: string;
      name: string;
    };
    subject: string;
    date: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

export default function ContactForm({ extractedData, onSave, onCancel }: ContactFormProps) {
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedContact = extractedData.contacts[selectedContactIndex] || {
    name: '',
    email: '',
    phone: '',
    company: ''
  };

  const [formData, setFormData] = useState({
    name: selectedContact.name,
    email: selectedContact.email,
    phone: selectedContact.phone,
    company: selectedContact.company
  });

  const handleContactSelect = (index: number) => {
    setSelectedContactIndex(index);
    const contact = extractedData.contacts[index];
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await addContact({
        ...formData,
        note,
        sender_email: extractedData.sender.email,
        sender_name: extractedData.sender.name,
        source_email_subject: extractedData.subject,
        source_email_date: extractedData.date
      });

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du contact');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Ajouter un Contact</h3>
        <p className="text-sm text-gray-600 mt-1">
          {extractedData.contacts.length} contact{extractedData.contacts.length > 1 ? 's' : ''} trouvé{extractedData.contacts.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {extractedData.contacts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-yellow-800">Aucun contact détecté</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Vous pouvez créer un contact manuellement ci-dessous
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un contact
            </label>
            <div className="space-y-2">
              {extractedData.contacts.map((contact, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleContactSelect(index)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition ${
                    selectedContactIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{contact.name || contact.email}</p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entreprise
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note personnelle
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Ajoutez une note sur ce contact..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Envoyé par:</strong> {extractedData.sender.name || extractedData.sender.email}
            </p>
            <p className="text-xs text-blue-800 mt-1">
              <strong>Sujet:</strong> {extractedData.subject}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <X size={18} />
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
