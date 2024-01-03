import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
//DTO's
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
//Services
import { ReportsService } from './reports.service';
//Guards
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin-guard';
// Decorators
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
//Entities
import { User } from '../users/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    // console.log(query);
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto) // Transforma aquilo que vai ser passado no objeto de registo
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    const report = this.reportsService.create(body, user);

    return report;
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    const report = this.reportsService.changeApproval(id, body.approved);

    return report;
  }
}
