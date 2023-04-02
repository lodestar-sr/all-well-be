export interface SimpleMail {
  to: string;
  subject?: string;
  body: string;
  link: { link: string, label: string };
}
