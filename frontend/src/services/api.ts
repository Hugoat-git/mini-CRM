import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const testImapConnection = async (email: string, password: string, host?: string, port?: number) => {
  const response = await api.post('/auth/test-imap', { email, password, host, port });
  return response.data;
};

export const saveImapConfig = async (email: string, password: string, host?: string, port?: number) => {
  const response = await api.post('/auth/save-config', { email, password, host, port });
  return response.data;
};

export const checkImapConfig = async () => {
  const response = await api.get('/auth/config');
  return response.data;
};

// Emails
export const fetchRecentEmails = async () => {
  const response = await api.get('/emails/recent');
  return response.data;
};

export const extractContactsFromEmail = async (emailId: number) => {
  const response = await api.post('/emails/extract-contacts', { emailId });
  return response.data;
};

// Contacts
export const fetchContacts = async () => {
  const response = await api.get('/contacts');
  return response.data;
};

export const addContact = async (contact: any) => {
  const response = await api.post('/contacts', contact);
  return response.data;
};

export const updateContact = async (id: number, contact: any) => {
  const response = await api.put(`/contacts/${id}`, contact);
  return response.data;
};

export const deleteContact = async (id: number) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

export const searchContacts = async (query: string) => {
  const response = await api.get(`/contacts/search?q=${encodeURIComponent(query)}`);
  return response.data;
};
