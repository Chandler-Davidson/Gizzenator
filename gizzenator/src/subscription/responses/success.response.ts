import { ControllerResponse, Status } from "./response";

export class SuccessResponse implements ControllerResponse {
  message: string;
  status: Status = "SUCCESS";
}