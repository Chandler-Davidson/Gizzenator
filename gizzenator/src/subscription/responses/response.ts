export type Status = "SUCCESS" | "FAIL"

export interface ControllerResponse {
  message: string;
  status: Status;
}