import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  // obj -> refers to the original report entity
  @Transform(({ obj }) => obj.user.id) // Takes the orignial report entity and look ate the id of the user property
  @Expose()
  userID: number;
}
