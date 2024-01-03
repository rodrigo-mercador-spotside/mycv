import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
//DTO's
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto as Report);
    report.user = user; // Assign the Association, just going to extract the id
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }

  // ----- Create Estimate -------- //

  // 1º - Search through all reports we have...
  // 2º - Find reports for the same make/model (make,model)
  // 3º - Within +/- 5 degrees (lng and lat)
  // 4º - Within 3 years (years)
  // 5º - Order by closest mileage

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder() // everytime we want to run a complex query
      .select('AVG(price)', 'price')
      .where('make = :make', { make }) // All the rows on reports table
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage }) // Porque o OrderBy não aceita um segundo parâmetro
      .limit(3)
      .getRawOne();
    // .getRawMany();
  }

  // ----- END Create Estimate -------- //
}
