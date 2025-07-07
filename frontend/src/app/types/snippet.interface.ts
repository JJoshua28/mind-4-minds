import {CommunicationsStatus} from "./communications-status.enum";

export interface Snippet {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  subject: string;
  date: string;
  isChecked: boolean;
  status: CommunicationsStatus;
}
