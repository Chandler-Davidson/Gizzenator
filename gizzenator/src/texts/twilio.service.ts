import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Twilio } from "twilio";

@Injectable()
export class TwilioService {
  private readonly twilio: Twilio;
  
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.twilio = new Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'));
   }

  sendText(recipient: string, message: string) {
    return this.twilio.messages.create({
      to: recipient,
      from: this.configService.get('TWILIO_SENDER_NUMBER'),
      body: message
    });
  }
}