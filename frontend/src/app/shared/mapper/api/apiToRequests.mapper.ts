import {ApiRequestResponse} from "../../../types/api/request.interface";
import {CommunicationsStatus} from "../../../types/communications-status.enum";
import {Requests} from "../../../types/requests.interface";

export function mapApiToRequest(apiResponse: ApiRequestResponse): Requests {
  return {
    id: apiResponse.id,
    senderName: `${apiResponse?.sender_record?.first_name} ${apiResponse?.sender_record?.last_name}` ||  "",
    senderId: apiResponse.sender,
    body: apiResponse.body,
    subject: apiResponse.subject,
    date: apiResponse.created_at as string,
    actionType: apiResponse.action_type,
    isChecked: false,
    isComplete: apiResponse.is_complete || false,
    status: apiResponse.is_new ? CommunicationsStatus.NEW : CommunicationsStatus.OLD
  }
}
