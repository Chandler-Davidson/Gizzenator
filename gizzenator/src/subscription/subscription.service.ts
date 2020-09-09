import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entity/subscription.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { InvalidResponse } from './responses/invalid.response';
import { ControllerResponse } from './responses/response';
import { DuplicateResponse } from './responses/duplicate.response';
import { ParsingErrorResponse } from './responses/parsing-error.response';
import { SuccessResponse } from './responses/success.response';
import { TextsService } from 'src/texts/texts.service';

@Injectable()
export class SubscriptionService {
  private readonly phoneNumberUtil = new PhoneNumberUtil()

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) { }

  getSubscriptions(): any {
    return this.subscriptionRepository.find();
  }

  async createSubscription(createDto: CreateSubscriptionDto): Promise<Subscription | ControllerResponse> {
    try {
      const phoneNumber = this.phoneNumberUtil.parse(createDto.phoneNumber);

      if (!this.isValid(phoneNumber))
        return new InvalidResponse();
    
      if (await this.isDuplicate(phoneNumber))
        return new DuplicateResponse();
      
      this.subscriptionRepository.save({ phoneNumber: phoneNumber.getNationalNumber().toString() });

      return new SuccessResponse();
    }
    catch (e) {
      return new ParsingErrorResponse(e.message);
    }
  }

  removeSubscription(phoneNumber: string) {
    return this.subscriptionRepository.delete({
      phoneNumber
    });
  }

  isValid(phoneNumber: libphonenumber.PhoneNumber): boolean {
    return this.phoneNumberUtil.isValidNumber(phoneNumber);
  }

  async isDuplicate(phoneNumber: libphonenumber.PhoneNumber): Promise<boolean> {
    const strPhone: string = phoneNumber.getNationalNumber().toString();
    const count = await this.subscriptionRepository.count({ where: { phoneNumber: strPhone } });
    return count > 0;
  }
}
