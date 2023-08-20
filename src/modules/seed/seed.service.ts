import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRoleModel, ROLE_MODEL_NAME } from '../role/schemas/role.schema';
import { IUserModel, USER_MODEL_NAME } from '../user/schema/user.schema';
import * as seed from './seed.json';

@Injectable()
export class SeedService {
  private logger = new Logger('Seed Data');

  constructor(
    @InjectModel(ROLE_MODEL_NAME) private readonly roleModel: IRoleModel,
    @InjectModel(USER_MODEL_NAME) private readonly userModel: IUserModel,
  ) {}

  private async seedRoles() {
    const roles = seed.role.map(async (role) => await this.roleModel.create(role));

    await Promise.all(roles).catch((err) => {
      if (err.code === 11000) this.logger.warn('roles already seeded, remove them from database and try again.');
      else this.logger.error('error seeding roles', JSON.stringify(err, null, 2));
    });
  }

  private async seedUsers() {
    const users = seed.user.map(async (user) => await this.userModel.create(user));

    await Promise.all(users).catch((err) => {
      if (err.code === 11000) this.logger.warn('users already seeded, remove them from database and try again.');
      else this.logger.error('error seeding users', JSON.stringify(err, null, 2));
    });
  }

  async seedAll() {
    this.logger.log('starting role seed');
    await this.seedRoles();
    this.logger.log('finished role seed');

    this.logger.log('starting user seed');
    await this.seedUsers();
    this.logger.log('finished user seed');
  }
}
