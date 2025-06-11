export interface Mentor {
  id: string
  firstname: string;
  surname: string;
  occupation: string;
  description: string;
  mainSpeciality: string;
  neurodivergentConditions: Array<string>;
  profilePic: string;
  isAvailable?: boolean;
}
