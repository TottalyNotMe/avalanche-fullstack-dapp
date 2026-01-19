import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';


@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}
    // GET /blockchain/value
    @Get("value")
    async getValue() {
      return this.blockchainService.getLatestValue();
    }
    @Post("events")
    async getEventsByRange(@Body() body: GetEventsDto) {
      return this.blockchainService.getValueUpdatedEvents(body.fromBlock, body.toBlock);
    }
    @Get('events')
    async getEvents() {
      return this.blockchainService.getValueUpdatedEvents(50560487, 50560921);
    }

}

