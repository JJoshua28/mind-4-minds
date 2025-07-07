import { ApiUpdateRequest} from "../../types/api/request.interface";
import {CommunicationsStatus} from "../../types/communications-status.enum";
import {Requests} from "../../types/requests.interface";

export function mapRequestsToUpdateRequestApi(requests: Requests): ApiUpdateRequest {
  return {
    body: requests.body,
    subject: requests.subject,
    is_new: requests.status === CommunicationsStatus.NEW,
    is_complete: requests.isComplete,
    action_type: requests.actionType,
  }
}
