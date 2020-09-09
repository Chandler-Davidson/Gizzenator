import { ControllerResponse, Status } from "./response";

export class DuplicateResponse implements ControllerResponse {
  message = "Oops, you're already signed up!";
  status: Status = "FAIL";
}