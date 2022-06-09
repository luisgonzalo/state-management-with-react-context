export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  settings: { [settingId: string]: string };
  termsAccepted: boolean;
}
