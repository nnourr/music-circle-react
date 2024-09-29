import { CircleInfo } from "../../home/models/circleInfo.model";

export interface userLoginInterface {
  username: string;
  userId: string;
  userCircles: CircleInfo[];
}
