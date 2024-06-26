
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Filtering } from 'src/@core/domain/interfaces/filtering.interface';
import { FilterRule } from '../../domain/enums/filtering.enum';

//Decorator usado para filtragem de dados
export const FilteringParams = createParamDecorator(
  (data: { filter: string, permittedFilterRules: FilterRule[] }[], ctx: ExecutionContext): Filtering[] => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter;
    if (!filter) return null;

    // check if the valid params sent is an array
    if (typeof data != 'object')
      throw new BadRequestException('Invalid filter parameter');

    // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    let arrayFilter = [];
    if (typeof filter != 'object') arrayFilter.push(filter);
    else arrayFilter = filter as string[];

    arrayFilter.map((item) => {
      const decodedItem = item.toString().replace('%20', ' ');
      const [property, rule, value] = decodedItem.split(':')
      const filterName = data.filter(item => item.filter == property)
      if (filterName.length == 0) throw new BadRequestException('Invalid filter parameter');
      const isRulePermitted = filterName[0].permittedFilterRules.filter(item => item == rule)
      if (isRulePermitted.length === 0) throw new BadRequestException(`invalid filter rule ${rule}`)
      if (
        !decodedItem.match(
          /^[a-zA-Z0-9_-]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin|contains):[a-zA-Z0-9_,-\s]+$/,
        ) &&
        !decodedItem.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)
      ) {
        throw new BadRequestException('Invalid filter parameter');
      }
    });

    const filters = arrayFilter.map((item) => {
      const [property, rule, value] = item.toString().split(':');

      if (!data.filter(item => item.filter == property))
        throw new BadRequestException(
          `Invalid filter property: ${property}`,
        );

      if (!Object.values(FilterRule).includes(rule as FilterRule))
        throw new BadRequestException(`Invalid filter rule: ${rule}`);

      value.replace('%20', ' ');

      return { property, rule, value };
    },
    );
    return filters
  })
