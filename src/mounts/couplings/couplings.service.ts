import { MountsService } from './../mounts.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ThrowExceptionUtils } from 'src/common/utils/throw-exception.utils';
import { CreateCouplingDto } from './models/dtos/create-coupling.dto';
import { Coupling } from './models/schemas/coupling.schema';
import { SearchCouplingDto } from './models/dtos/search-coupling.dto';
import { CustomError } from 'src/common/models/custom-error';
import { MountGenderEnum } from '../models/enum/mount-gender.enum';

@Injectable()
export class CouplingsService {
  private readonly entityType = 'Coupling';

  constructor(
    @InjectModel(Coupling.name) private couplingModel: Model<Coupling>,
    private mountsService: MountsService,
  ) {}

  //Get a coupling by is id then validate that it exist and the userIds are the same
  async getCouplingById(couplingId: string, userId: string): Promise<Coupling> {
    const coupling = await this.couplingModel.findById(couplingId).exec();
    if (!coupling) {
      ThrowExceptionUtils.notFoundException(this.entityType, couplingId);
    }
    //If the user who requested isn't the same as the one returned, throw exception
    if (coupling.userId != userId) {
      ThrowExceptionUtils.forbidden();
    }
    return coupling;
  }

  //CreateCoupling
  async createCoupling(createCouplingDto: CreateCouplingDto, userId: string): Promise<Coupling> {
    const dadMount = await this.mountsService.getMountById(createCouplingDto.dadId, userId);
    const momMount = await this.mountsService.getMountById(createCouplingDto.momId, userId);

    if (dadMount.gender !== MountGenderEnum.Male) {
      throw new HttpException(
        new CustomError(HttpStatus.BAD_REQUEST, 'BadParameter', 'Dad mount have wrong gender.'),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (momMount.gender !== MountGenderEnum.Female) {
      throw new HttpException(
        new CustomError(HttpStatus.BAD_REQUEST, 'BadParameter', 'Mom mount have wrong gender.'),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dadMount.type !== momMount.type) {
      throw new HttpException(
        new CustomError(HttpStatus.BAD_REQUEST, 'BadParameter', "Mounts types aren't the same"),
        HttpStatus.BAD_REQUEST,
      );
    }

    //Create coupling
    const newCoupling = new this.couplingModel(createCouplingDto);
    newCoupling.dad = dadMount;
    newCoupling.mom = momMount;
    newCoupling.userId = userId;
    return newCoupling.save();
  }

  //Delete coupling
  async deleteCoupling(couplingId: string, userId: string): Promise<void> {
    await this.getCouplingById(couplingId, userId);
    await this.couplingModel.findByIdAndRemove(couplingId).exec();
  }

  async getCouplingsForUserId(searchCouplingDto: SearchCouplingDto, userId: string): Promise<Coupling[]> {
    const query = await this.createSearchQuery(searchCouplingDto);

    return this.couplingModel
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(`${userId}`),
            $and: query,
          },
        },
      ])
      .exec();
  }

  private async createSearchQuery(searchCouplingDto: SearchCouplingDto) {
    // eslint-disable-next-line prefer-const
    let query = [];

    if (searchCouplingDto.childName) {
      const q = `{ "childName": { "$regex": "^${searchCouplingDto.childName}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    if (searchCouplingDto.dadName) {
      const q = `{ "dad.name": { "$regex": "^${searchCouplingDto.dadName}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    if (searchCouplingDto.momName) {
      const q = `{ "mom.name": { "$regex": "^${searchCouplingDto.momName}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    //Check if array is empty (mongo don't accept empty array)
    return query.length === 0 ? [{}] : query;
  }
}