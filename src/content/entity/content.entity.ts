import { BaseElasticEntity } from '@base/common/base/base.entity';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContentElasticEntity extends BaseElasticEntity {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsArray()
  @IsOptional()
  images: { url: string; alt: string }[];

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  categories: string[];
}
