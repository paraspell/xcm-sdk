import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { XTransferService } from './x-transfer.service.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { EventName } from '../analytics/EventName.js';
import { ZodValidationPipe } from '../zod-validation-pipe.js';
import { XTransferDto, XTransferDtoSchema } from './dto/XTransferDto.js';

@Controller('x-transfer')
@UsePipes(new ZodValidationPipe(XTransferDtoSchema))
export class XTransferController {
  constructor(
    private xTransferService: XTransferService,
    private analyticsService: AnalyticsService,
  ) {}

  private trackAnalytics(eventName: EventName, req, params: XTransferDto) {
    const { from, to, currency } = params;
    const resolvedCurrency =
      typeof currency === 'string' ? currency : 'MultiLocation';
    const resolvedTo = typeof to === 'string' ? to : 'MultiLocation';
    this.analyticsService.track(eventName, req, {
      from,
      resolvedTo,
      resolvedCurrency,
    });
  }

  @Get()
  generateXcmCall(@Query() queryParams: XTransferDto, @Req() req) {
    this.trackAnalytics(EventName.GENERATE_XCM_CALL, req, queryParams);
    return this.xTransferService.generateXcmCall(queryParams);
  }

  @Post()
  generateXcmCallV2(@Body() bodyParams: XTransferDto, @Req() req) {
    this.trackAnalytics(EventName.GENERATE_XCM_CALL, req, bodyParams);
    return this.xTransferService.generateXcmCall(bodyParams);
  }
}
