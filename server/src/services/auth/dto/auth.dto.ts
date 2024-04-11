import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

class LoginUserDto {
	@ApiProperty({ type: String, required: true })
	@IsEmail()
	email: string;

	@ApiProperty({ type: String, required: true })
	@IsStrongPassword()
	password: string;
}

class CreateUserDto extends LoginUserDto {
	@ApiProperty({ type: String, required: true })
	@IsString()
	@Length(1, Infinity)
	display_name: string;
}

class AdminDto {}

export { CreateUserDto, LoginUserDto, AdminDto };
