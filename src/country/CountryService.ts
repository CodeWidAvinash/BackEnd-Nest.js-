import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './country.schema';
import { DeleteResult } from 'typeorm';

@Injectable()
export class CountryService {
    constructor(
        @InjectModel('Country') private readonly countryModel: Model<Country>,
    ) { }

    async createCountry(name: string, shortcode: string): Promise<Country> {
        const newCountry = new this.countryModel({ name, shortcode });
        return await newCountry.save();
    }

    async getCountries(): Promise<Country[]> {
        return await this.countryModel.find().exec();
    }

    async getCountryByName(name: string): Promise<Country> {
        const country = await this.countryModel.findOne({ name }).exec();
        if (!country) {
            throw new NotFoundException(`Country with name "${name}" not found`);
        }
        return country;
    }
    // delete by id
    async deleteCountry(id: string): Promise<Country> {
        const deletedCountry = await this.countryModel.findByIdAndDelete(id).exec();
        return deletedCountry;
    }

    // update by id
    async updateCountryById(id: string, updatedFields: Partial<Country>): Promise<Country> {
        const updatedCountry = await this.countryModel
            .findByIdAndUpdate(id, updatedFields, { new: true })
            .exec();
        if (!updatedCountry) {
            throw new NotFoundException(`Country with id "${id}" not found`);
        }
        return updatedCountry;
    }

   // Delete multiple countries by their shortcode
    // async deleteCountriesByShortcodes(shortcodes: string[]): Promise<DeleteResult> {
    //     const result = await this.countryModel.deleteMany({ shortcode: { $in: shortcodes } }).exec();
    //     return {
    //       deletedCount: result.deletedCount ?? 0,
    //     };
    //   }
    // to search all countries that contain a word

    async searchCountries(keyword: string): Promise<Country[]> {
        const regex = new RegExp(keyword, 'i');
        try {
          const countries = await this.countryModel.find({
            $or: [
              { name: { $regex: regex } },
              { shortcode: { $regex: regex } },
            ],
          }).exec();
          console.log("hi");
          
          return countries;
        } catch (err) {
          throw new InternalServerErrorException(err);
        }
      }


}



