import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MountTypeEnum } from '../../../mounts/models/enum/mount-type.enum';
import { ObjectId } from 'mongoose';
import { BaseDocument } from 'src/common/models/base-document';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class AccountSettings extends BaseDocument {
  @ApiProperty({ type: String })
  @Prop({ unique: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop()
  igUsername: string;

  @ApiProperty()
  @Prop()
  serverName: string;

  @ApiProperty()
  @Prop([String])
  mountTypes: MountTypeEnum[];

  @ApiProperty()
  @Prop()
  autoFillChildName: boolean;
}

export const AccountSettingSchema = SchemaFactory.createForClass(AccountSettings);
