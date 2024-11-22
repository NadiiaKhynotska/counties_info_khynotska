import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class CountryService {
  constructor(private readonly httpService: HttpService) {}

  async getAvailableCountries() {
    const url = 'https://date.nager.at/api/v3/AvailableCountries';
    return this.httpService.get(url).pipe(
      map((response) => response.data),
      catchError(() => {
        throw new HttpException(
          'Failed to fetch available countries',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  async getCountryInfo(countryCode: string, name: string) {
    const borderedCountries = await this.getCountryBorders(countryCode);
    const population = await this.getCountryPopulation(name);
    const flag = await this.getCountryFlag(name);
    return { borderedCountries, population, flag };
  }

  async getCountryBorders(countryCode: string) {
    const borderUrl = `https://date.nager.at/api/v3/CountryInfo/${countryCode}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(borderUrl).pipe(
          map((response) => response.data),
          catchError((error) => {
            Logger.log('Error fetching borders data:', error);
            throw new HttpException(
              'An error occurred while fetching country borders',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );

      if (response?.borders) {
        return response.borders.map((border) => ({
          name: border.commonName,
          code: border.countryCode,
        }));
      } else {
        throw new HttpException(
          'No borders data found for the specified country',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      Logger.log('Error in getCountryBorders:', error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while fetching country borders',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getCountryPopulation(countryName: string) {
    const populationUrl =
      'https://countriesnow.space/api/v0.1/countries/population';

    try {
      const response = await firstValueFrom(
        this.httpService.get(populationUrl).pipe(
          map((response) => response.data),
          catchError((error) => {
            throw new HttpException(
              error.message ||
                'An error occurred while fetching country population data',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      const countryData = response?.data?.find(
        (item) => item.country === countryName,
      );

      if (countryData && countryData.populationCounts) {
        return countryData.populationCounts;
      } else {
        throw new HttpException(
          'No population data found for the specified country',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while fetching country population data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getCountryFlag(countryName: string) {
    const flagUrl = 'https://countriesnow.space/api/v0.1/countries/flag/images';

    try {
      const response = await firstValueFrom(
        this.httpService.get(flagUrl).pipe(
          map((response) => response.data),
          catchError((error) => {
            Logger.log('Error fetching flag data:', error);
            throw new HttpException(
              'An error occurred while fetching country flag data',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );

      const countryData = response?.data?.find(
        (item) => item.name === countryName,
      );

      if (countryData && countryData.flag) {
        return countryData.flag;
      } else {
        throw new HttpException(
          'No flag data found for the specified country',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      Logger.log('Error in getCountryFlag:', error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while fetching country flag data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
