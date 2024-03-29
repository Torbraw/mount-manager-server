import { ColorLocalize } from '../../mount-colors/models/color-localize';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { BaseDocument } from 'src/common/models/base-document';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';
import { MountGenderEnum } from '../enum/mount-gender.enum';

@Schema()
export class Mount extends BaseDocument {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  gender: MountGenderEnum;

  @ApiProperty()
  @Prop()
  color: ColorLocalize;

  @ApiProperty({ type: String })
  @Prop()
  userId: ObjectId;

  @ApiProperty({ type: String })
  @Prop()
  colorId: ObjectId;

  @ApiProperty()
  @Prop()
  type: MountTypeEnum;

  @ApiProperty()
  @Prop()
  maxNumberOfChild: number;

  @ApiProperty()
  @Prop()
  numberOfChild: number;
}

export const MountSchema = SchemaFactory.createForClass(Mount);
