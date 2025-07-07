import {CommunicationsStatus} from "./communications-status.enum";

export interface Requests {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  actionType: string;
  subject: string;
  date: string;
  isChecked: boolean;
  isComplete: boolean;
  status: CommunicationsStatus;
}
