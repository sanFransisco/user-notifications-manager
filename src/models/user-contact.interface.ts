export interface UserContact {
  userId: Number;
  email: String;
  telephone: String;
  preferences: NotificationMethod;
}

export interface NotificationMethod {
  email: Boolean | null;
  sms: Boolean | null;
}
