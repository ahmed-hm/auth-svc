import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

describe('SeedModule', () => {
  let seedModule: SeedModule;
  let testingModule: TestingModule;
  let seedService: SeedService;
  let mongoInstance: MongoMemoryServer;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongoInstance = await MongoMemoryServer.create();
            const uri = mongoInstance.getUri();

            return { uri };
          },
        }),
        SeedModule,
      ],
    })
      .useMocker((token) => {
        if (token === SeedService) {
          return { seedAll: jest.fn() };
        }
      })
      .compile();

    seedModule = testingModule.get<SeedModule>(SeedModule);
    seedService = testingModule.get<SeedService>(SeedService);
  });

  afterAll(async () => {
    await testingModule.close();
    await mongoInstance.stop();
  });

  it('should be defined', () => {
    expect(seedModule).toBeDefined();
  });

  it('seed service should be defined', () => {
    expect(seedService).toBeDefined();
  });

  it('should seed data', async () => {
    const seedAllSpy = jest.spyOn(seedService, 'seedAll');
    await seedModule.onModuleInit();

    expect(seedAllSpy).toBeCalled();
  });
});
