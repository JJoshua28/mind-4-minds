
import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";
import {MenteeDetailsApi} from "../../../types/api/mentee-details-interface";
import {MenteeDetails} from "../../../types/user details/mentee.interface";
import {LearningPreferences} from "../../../types/user details/learning-preferences.enum";

export function mapMenteeDetails(apiData: MenteeDetailsApi): MenteeDetails {
  return {
    id: apiData.id,
    description: apiData.description,
    expectations: apiData.expectations,
    goals: apiData.goals,
    commitment: apiData.commitment,
    meetingPreferences: apiData.meeting_preferences as MeetingPreferences[],
    neurodivergentConditions: apiData.neurodivergent_conditions as NeurodivergenceConditions[],
    learningPreferences: apiData.learning_preferences as LearningPreferences[],
  };
}
