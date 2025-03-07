import { UserContact } from '@/models/user-contact.interface';

const usersContacts: UserContact[] = [];

function addUserContact(userId, email, telephone, preferences) {
  usersContacts.push({
    userId,
    email,
    telephone,
    preferences: preferences ?? { sms: false, email: false },
  });
}
function getUserContactById(userId: Number) {
  return usersContacts.find(contact => contact.userId === userId);
}

export const usersContactsDb = {
  addUserContact: addUserContact,
  getUserContactById: getUserContactById,
};
