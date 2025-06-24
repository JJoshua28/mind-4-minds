import {MentorInfo} from "../../types/user details/user-info.interface";
import {MentorDetailsApi} from "../../types/api/mentor-details.interface";
import {MentorDetails} from "../../types/user details/mentor/mentor.interface";

interface MentorDetailsApiPayload extends Omit<MentorDetails, "id" | "isAvailable"> {
  isAvailable?: boolean;
}

export function mapMentorDetailsToApiPayload(data: MentorDetailsApiPayload, userId?: string): Partial<MentorDetailsApi> {
  const payload: Partial<MentorDetailsApi> = {
    description: data.description,
    qualifications: data.qualifications,
    experience: data.experience || "",
    commitment: data.commitment,
    meeting_preferences: data.meetingPreferences || [],
    neurodivergent_conditions: data.neurodivergentConditions || [],
  };

  if(data?.isAvailable !== undefined) {
    payload.is_available = data.isAvailable
  }

  if(userId) {
    payload.user_details = userId;
  }

  return payload;
}
