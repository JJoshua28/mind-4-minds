import {MentorDetails} from "../../../types/user details/mentor/mentor.interface";
import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";
import {MentorDetailsApi, MentorUserApi} from "../../../types/api/mentor-details.interface";
import {MentorUser} from "../../../types/user.interface";
import {UserType} from "../../../types/user-type.enum";

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

export function mapMentorUser(mentorDetails: MentorUserApi): MentorUser {
  const {user_details_record} = mentorDetails;
  return {
    id: mentorDetails.user_details_record.id,
    firstName: mentorDetails.user_details_record.first_name,
    lastName: mentorDetails.user_details_record.last_name,
    occupation: mentorDetails.user_details_record.occupation,
    isArchived: !mentorDetails.user_details_record.user_account.is_active || false,
    isAdmin: mentorDetails.user_details_record.user_account.is_staff,
    email: mentorDetails.user_details_record.user_account.email,
    joined: mentorDetails.user_details_record.user_account.joined,
    roles: user_details_record.roles as UserType[],
    accountId: user_details_record.user_account.id,
    occupationStartDate: mentorDetails.user_details_record.occupation_start_date,
    profilePic: mentorDetails.user_details_record.profilePic || '/assets/images/default.jpeg',
    mentorDetails: mapMentorDetails(mentorDetails)
  };
}
