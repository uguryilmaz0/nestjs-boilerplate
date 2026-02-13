import { Exclude } from 'class-transformer';
import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string | null;
  deletedAt: Date | null;

  @Exclude() // Bu alan JSON yanıtından otomatik gizlenir / Auto-hidden from JSON responses
  password: string;

  role: $Enums.Role;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
