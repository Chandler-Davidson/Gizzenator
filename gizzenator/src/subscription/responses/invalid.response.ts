import { ControllerResponse, Status } from "./response";

export class InvalidResponse implements ControllerResponse {
  message = "Oops, that's not a phone number!";
  status: Status = "FAIL";
}