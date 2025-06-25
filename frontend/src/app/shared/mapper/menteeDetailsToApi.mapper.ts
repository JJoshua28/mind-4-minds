import {MenteeInfo} from "../../types/user details/user-info.interface";
import {MenteeDetailsApi} from "../../types/api/mentee-details-interface";

function mapMenteeDetailsToApiPayload(menteeInfo: MenteeInfo, userDetailsId?: string): Partial<MenteeDetailsApi> {
  const data: Partial<MenteeDetailsApi> = {
    description: menteeInfo.description,
    goals: menteeInfo.goals,
    learning_preferences: menteeInfo.learningPreferences,
    expectations: menteeInfo.expectations,
    meeting_preferences: menteeInfo.meetingPreferences,
    neurodivergent_conditions: menteeInfo.neurodivergentConditions,
    commitment: menteeInfo.commitment,
  };

  if (userDetailsId) {
    data.user_details = userDetailsId;
  }

  return data;
}

export default mapMenteeDetailsToApiPayload;
