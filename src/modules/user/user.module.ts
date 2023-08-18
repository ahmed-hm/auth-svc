import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchemaFactory, USER_MODEL_NAME } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

export const UserMongooseDynamicModule = MongooseModule.forFeature([
  { name: USER_MODEL_NAME, schema: userSchemaFactory() },
]);

@Module({
  imports: [UserMongooseDynamicModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserMongooseDynamicModule],
})
export class UserModule {}
