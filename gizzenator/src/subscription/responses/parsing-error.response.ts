import { ControllerResponse, Status } from "./response";

export class ParsingErrorResponse implements ControllerResponse {
  constructor(message: string) {
    this.message = message;
  }
  message: string;
  status: Status = "FAIL";
}