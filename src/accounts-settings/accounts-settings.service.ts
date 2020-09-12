import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AccountSettings } from './models/schemas/account-settings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAccountSettingsDto } from './models/dtos/update-account-settings.dto';
import { ThrowExceptionUtils } from 'src/utils/throw-exception.utils';
import { ServersService } from 'src/servers/servers.service';
import { CustomError } from 'src/models/custom-error';
import { MountTypeEnum } from './models/enum/mount-type.enum';

@Injectable()
export class AccountSettingsService {
  private readonly entityType = 'Account Setting';

  constructor(
    @InjectModel(AccountSettings.name)
    private accountSettingsModel: Model<AccountSettings>,
    private serversService: ServersService,
  ) {}

  //Update a existing accountSettings
  async updateAccountSettings(
    userId: string,
    id: string,
    updateAccountSettingsDto: UpdateAccountSettingsDto,
  ): Promise<AccountSettings> {
    //Validate the server, only if updated
    if (updateAccountSettingsDto.serverName) {
      await this.validateServerName(updateAccountSettingsDto.serverName);
    }

    const accountSetting = await this.accountSettingsModel.findById(id).exec();

    if (!accountSetting) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    //If the user who requested isn't the same as the one returned, throw exception
    if (accountSetting.userId != userId) {
      ThrowExceptionUtils.forbidden();
    }

    return this.accountSettingsModel.findByIdAndUpdate(id, updateAccountSettingsDto, { new: true }).exec();
  }

  //Validate that the requested server exist
  async validateServerName(serverName: string): Promise<void> {
    const server = await this.serversService.getServerByName(serverName);
    if (!server) {
      throw new HttpException(
        new CustomError(
          HttpStatus.BAD_REQUEST,
          'BadParameter',
          `serverName is invalid, the requested server doesn't exist`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Get a accountSettings by a userId
  async getAccountSettingsByUserId(userId: string): Promise<AccountSettings> {
    const accountSettings = await this.accountSettingsModel.findOne({ userId: userId }).exec();
    if (!accountSettings) {
      ThrowExceptionUtils.notFoundException(this.entityType, userId, 'userId');
    }
    return accountSettings;
  }

  //Create a new accountSettings with only userId & mountTypes
  async createNewAccountSettings(userId: string, mountTypes: MountTypeEnum[]): Promise<AccountSettings> {
    const newAccountSettings = new this.accountSettingsModel();
    newAccountSettings.userId = userId;
    newAccountSettings.mountTypes = mountTypes;
    return newAccountSettings.save();
  }
}