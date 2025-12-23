import { useState, useEffect } from 'react';
import { RefreshCw, UserPlus } from 'lucide-react';
import { fetchRecentEmails, extractContactsFromEmail } from '../services/api';
import ContactForm from './ContactForm';

interface Email {
  id: number;
  subject: string;
  from: string;
  fromAddress: string;
  fromName: string;
  date: string;
  text: string;
}

interface ExtractedData {
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
}

interface EmailListProps {
  onContactAdded: () => void;
}

export default function EmailList({ onContactAdded }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecentEmails();
      setEmails(data);
    } catch (error) {
      console.error('Error loading emails:', error);
      alert('Erreur lors du chargement des emails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractContacts = async (email: Email) => {
    setSelectedEmail(email);
    setIsExtracting(true);

    try {
      const data = await extractContactsFromEmail(email.id);
      setExtractedData(data);
    } catch (error) {
      console.error('Error extracting contacts:', error);
      alert('Erreur lors de l\'extraction des contacts');
      setSelectedEmail(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCancelExtraction = () => {
    setSelectedEmail(null);
    setExtractedData(null);
  };

  const handleContactSaved = () => {
    setSelectedEmail(null);
    setExtractedData(null);
    onContactAdded();
  };

  return (
    <div className="h-full flex bg-white">
      {/* Email List */}
      <div className="w-2/3 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Emails Récents</h2>
            <button
              onClick={loadEmails}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Cliquez sur "Extraire" pour récupérer les contacts d'un email
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Chargement des emails...</div>
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun email trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 hover:bg-gray-50 transition ${
                    selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {email.subject}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{email.from}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(email.date).toLocaleString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {email.text}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExtractContacts(email)}
                      disabled={isExtracting && selectedEmail?.id === email.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap"
                    >
                      <UserPlus size={18} />
                      {isExtracting && selectedEmail?.id === email.id ? 'Extraction...' : 'Extraire'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Panel */}
      <div className="w-1/3">
        {extractedData && selectedEmail ? (
          <ContactForm
            extractedData={extractedData}
            onSave={handleContactSaved}
            onCancel={handleCancelExtraction}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <UserPlus size={64} className="mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un email et cliquez sur "Extraire"</p>
              <p className="text-sm mt-2">pour commencer l'extraction</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
