import { Exclude } from 'class-transformer';
import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string | null;

  @Exclude() // 🔥 İşte sihir burada! Bu alan JSON'a dönüştürülürken silinecek.
  password: string;

  role: $Enums.Role;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
