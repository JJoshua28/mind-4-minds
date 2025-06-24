import {MentorDetails} from "../../../types/user details/mentor/mentor.interface";
import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";
import {MentorDetailsApi} from "../../../types/api/mentor-details.interface";

export function mapMentorDetails(apiData: MentorDetailsApi): MentorDetails {
  return {
    id: apiData.id,
    description: apiData.description,
    qualifications: apiData.qualifications,
    experience: apiData.experience,
    commitment: apiData.commitment,
    meetingPreferences: apiData.meeting_preferences as MeetingPreferences[],
    neurodivergentConditions: apiData.neurodivergent_conditions as NeurodivergenceConditions[],
    isAvailable: apiData.is_available ?? false,
  };
}
