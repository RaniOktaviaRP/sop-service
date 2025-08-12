import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGroupDto } from './create-user_group.dto';

export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {}
