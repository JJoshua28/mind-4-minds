import {MenteeInfo} from "../../types/user details/user-info.interface";

function mapMenteeDetailsToApiPayload(menteeInfo: MenteeInfo, userDetailsId: string) {
  return {
    description: menteeInfo.description,
    goals: menteeInfo.goals,
    user_details: userDetailsId,
    learning_preferences: menteeInfo.learningPreferences,
    expectations: menteeInfo.expectations,
    meeting_preferences: menteeInfo.meetingPreferences,
    neurodivergent_conditions: menteeInfo.neurodivergentConditions,
    commitment: menteeInfo.commitment,
  };
}

export default mapMenteeDetailsToApiPayload;
