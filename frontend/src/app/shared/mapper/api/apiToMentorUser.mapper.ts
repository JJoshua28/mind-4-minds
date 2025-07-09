import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";
import {UserType} from "../../../types/user-type.enum";
import {MentorUserApi} from "../../../types/api/mentor-details.interface";
import {MentorUser} from "../../../types/user.interface";
import {environment} from "../../../../environments/environment";


export function mapMentorUserApiToUser(mentorApi: MentorUserApi): MentorUser {
  const user = mentorApi.user_details_record;
  const userAccount = mentorApi.user_details_record.user_account;

  const defaultImage = environment.defaultProfilePic;


  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    occupation: user.occupation || null,
    isAdmin: userAccount.is_staff,
    isArchived: !userAccount.is_active || false,
    email: userAccount.email,
    joined: userAccount.joined,
    accountId: userAccount.id,
    roles: [UserType.MENTOR],
    occupationStartDate: user.occupation_start_date || null,
    profilePic: user.profilePic || defaultImage,
    mentorDetails: {
      id: mentorApi.id,
      commitment: mentorApi.commitment,
      meetingPreferences: mentorApi.meeting_preferences as MeetingPreferences[],
      qualifications: mentorApi.qualifications,
      experience: mentorApi.experience,
      neurodivergentConditions: mentorApi.neurodivergent_conditions as NeurodivergenceConditions[],
      description: mentorApi.description,
      isAvailable: mentorApi.is_available ?? true,
    },
  };
}
