import {MentorInfo} from "../../types/user details/user-info.interface";

export function mapMentorDetailsToApiPayload(data: MentorInfo, userId: string) {
  return {
    user_details: userId,
    description: data.description,
    qualifications: data.qualifications,
    experience: data.experience || "",
    commitment: data.commitment,
    meeting_preferences: data.meetingPreferences || [],
    neurodivergent_conditions: data.neurodivergentConditions || [],
  };
}
