import { TUserType } from "../../../types/index.js";

export type TokenPayload = {
  email: string;
  name: string;
  type: TUserType;
  avatar?: string;
  id: string;
};
