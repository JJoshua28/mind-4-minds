
import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";
import {MenteeDetailsApi} from "../../../types/api/mentee-details-interface";
import {MenteeDetails} from "../../../types/user details/mentee.interface";
import {LearningPreferences} from "../../../types/user details/learning-preferences.enum";
import { MenteeUser } from "../../../types/user.interface";
import {mapApiToUserInfo} from "./apiToUserInfo.mapper";
import {mapApiToUserDetails} from "./apiToUserDetails.mapper";
import { UserAccount } from "../../../types/api/user-account .interface";
import {ApiUserDetails} from "../../../types/api/user-details.interface";

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


export function mapMenteeUser(apiData: MenteeDetailsApi): MenteeUser{
  const {user_details, user_details_record,  ...menteeDetails} = apiData
  return {
    ...mapApiToUserDetails(user_details_record?.user_account as UserAccount, user_details_record as ApiUserDetails),
    menteeDetails: mapMenteeDetails(apiData)
  }
}
