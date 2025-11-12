// Contact Manager for Emergency Contacts
export class ContactsManager {
  constructor() {
    this.contacts = [];
    this.permissionGranted = false;
  }

  // Request permission to access device contacts
  async requestContactsPermission() {
    try {
      if ('contacts' in navigator && 'select' in navigator.contacts) {
        // Modern Contacts API (experimental)
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        const contacts = await navigator.contacts.select(props, opts);
        this.contacts = contacts.map(contact => ({
          id: Date.now() + Math.random(),
          name: contact.name?.[0] || 'Sin nombre',
          phone: contact.tel?.[0] || '',
          isEmergency: false
        }));
        this.permissionGranted = true;
        return this.contacts;
      } else if ('webkitContacts' in navigator) {
        // iOS Safari specific
        return this.requestIOSContacts();
      } else {
        // Fallback for unsupported browsers
        console.warn('Contacts API not supported');
        return [];
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return [];
    }
  }

  // iOS specific contacts handling
  async requestIOSContacts() {
    return new Promise((resolve) => {
      if (window.webkit && window.webkit.messageHandlers) {
        // iOS WebView communication
        window.webkit.messageHandlers.contactsHandler.postMessage({
          action: 'requestContacts'
        });
        resolve([]);
      } else {
        resolve([]);
      }
    });
  }

  // Add emergency contact manually
  addEmergencyContact(contact) {
    const emergencyContact = {
      id: Date.now() + Math.random(),
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship || '',
      isEmergency: true,
      addedManually: true
    };

    this.contacts.push(emergencyContact);
    this.saveContacts();
    return emergencyContact;
  }

  // Remove emergency contact
  removeEmergencyContact(contactId) {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
    this.saveContacts();
  }

  // Get all emergency contacts
  getEmergencyContacts() {
    return this.contacts.filter(contact => contact.isEmergency);
  }

  // Get all available contacts
  getAllContacts() {
    return this.contacts;
  }

  // Save contacts to localStorage
  saveContacts() {
    try {
      const encrypted = encryptData(this.contacts);
      localStorage.setItem('emergencyContacts', encrypted);
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  }

  // Load contacts from localStorage
  loadContacts() {
    try {
      const encrypted = localStorage.getItem('emergencyContacts');
      if (encrypted) {
        this.contacts = decryptData(encrypted) || [];
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      this.contacts = [];
    }
  }

  // Call emergency contact
  async callEmergencyContact(contactId) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact && contact.phone) {
      try {
        window.open(`tel:${contact.phone}`, '_self');
        return true;
      } catch (error) {
        console.error('Error calling contact:', error);
        return false;
      }
    }
    return false;
  }

  // Send emergency message
  async sendEmergencyMessage(contactId, message = "Necesito ayuda. Por favor contacta conmigo.") {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact && contact.phone) {
      try {
        const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
        window.open(smsUrl, '_self');
        return true;
      } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
      }
    }
    return false;
  }

  // Validate contact data
  validateContact(contact) {
    const errors = [];

    if (!contact.name || contact.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!contact.phone || !/^\+?[\d\s\-\(\)]{7,}$/.test(contact.phone)) {
      errors.push('Número de teléfono inválido');
    }

    return errors;
  }

  // Initialize contacts manager
  init() {
    this.loadContacts();
  }
}

// Import encryption functions
import { encryptData, decryptData } from './security';

// Export singleton instance
export const contactsManager = new ContactsManager();