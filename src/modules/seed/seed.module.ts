import { Module, OnModuleInit } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UserModule, RoleModule],
  providers: [SeedService],
})
export class SeedModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seedAll();
  }
}
