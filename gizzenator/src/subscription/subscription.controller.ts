import { Controller, Post, Body, Delete, Query, Get, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) { }

  @Post()
  createSubscription(
    @Body() createDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.createSubscription(createDto);
  }

  @Delete()
  removeSubscription(
    @Query('phoneNumber') phoneNumber: string
  ) {
    return this.subscriptionService.removeSubscription(phoneNumber);
  }
}
