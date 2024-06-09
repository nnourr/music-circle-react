import { UserInterface } from "./user.model";

export interface CircleInfo {
  circleCode: string;
  circleName: string;
  users: UserInterface[];
}
