import { useState, useEffect } from 'react';
import { Search, Trash2, Building, Phone, Mail, User, Calendar } from 'lucide-react';
import { fetchContacts, deleteContact, searchContacts } from '../services/api';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  note: string;
  sender_email: string;
  sender_name: string;
  source_email_subject: string;
  created_at: string;
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadContacts();
      return;
    }

    try {
      const data = await searchContacts(query);
      setContacts(data);
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      return;
    }

    try {
      await deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes Contacts</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher un contact..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {contacts.length} contact{contacts.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Chargement...</div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">
              {searchQuery ? 'Aucun contact trouvé' : 'Aucun contact pour le moment'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Allez dans la section Emails pour extraire des contacts
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                          {contact.email}
                        </a>
                      </div>

                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} />
                          <span>{contact.phone}</span>
                        </div>
                      )}

                      {contact.company && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building size={16} />
                          <span>{contact.company}</span>
                        </div>
                      )}

                      {contact.note && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-gray-700">{contact.note}</p>
                        </div>
                      )}

                      {contact.sender_email && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Envoyé par: {contact.sender_name || contact.sender_email}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <Calendar size={14} />
                        <span>Ajouté le {new Date(contact.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
