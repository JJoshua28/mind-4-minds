import {ApiUserDetails} from "./user-details.interface";

export interface ApiRequest {
  sender: string;
  recipients: string[];
  body: string;
  subject: string;
  action_type:string;
  is_new?: boolean;
  is_complete?: boolean;
}

export interface ApiUpdateRequest {
  body: string;
  subject: string;
  action_type:string;
  is_new?: boolean;
  is_complete?: boolean;
}

export interface ApiRequestResponse {
  id: string;
  sender: string;
  recipients: string[];
  body: string;
  subject: string;
  action_type:string;
  is_new: boolean;
  created_at?: string;
  is_complete?: boolean;
  sender_record?: ApiUserDetails
  recipient_record?: ApiUserDetails

}
