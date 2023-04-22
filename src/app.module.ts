import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Avinashkumar:Aman123@cluster0.gzpb0dy.mongodb.net/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }),
    CountryModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
