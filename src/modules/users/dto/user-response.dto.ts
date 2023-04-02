import { SuccessResponseDto } from '../../../shared/dtos/success-response.dto';
import { User } from '../entities/user.entity';

export class SuccessUserResponseDto extends SuccessResponseDto<User> {}
