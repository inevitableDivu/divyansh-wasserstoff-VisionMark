import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { HelperService } from 'src/helper/helper.service';
import { Role, TokenEnum } from 'src/models/helper.models';
import { setCookie } from 'src/utils';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly helper: HelperService,
    ) {}

    @Post('register')
    async handleRegister(
        @Body() body: CreateUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const is_existing_user = await this.authService.getUserByEmail(body.email);
        if (is_existing_user)
            throw new ConflictException('Oops! This email is already registered with us.');

        const user = await this.authService.createUserWithEmailAndPassword(body);

        if (!user)
            throw new UnprocessableEntityException(
                'Oops! Something went wrong while creating your account. Please try again.',
            );

        // TODO: trigger user creation event

        const access_token = this.helper.generateToken(TokenEnum.ACCESS_TOKEN, {
            user_id: user._id,
            email: user.email,
        });

        // Generate a refresh token and set it as a cookie
        const token_id = new ObjectId().toString();
        const refresh_token = this.helper.generateToken(TokenEnum.REFRESH_TOKEN, {
            token_id,
            user_id: user._id,
        });
        setCookie(response, TokenEnum.REFRESH_TOKEN, refresh_token);

        this.helper.clearCookies(response, TokenEnum.ADMIN_TOKEN);

        // TODO: trigger refresh token creation event and store request details with token and it's expiry

        return {
            message: 'Glad to have you onboard! 🎉',
            user: this.authService.serializeUser(user),
            token: access_token,
        };
    }

    @Post('login')
    async handleLogin(@Body() body: LoginUserDto, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.getUserByEmail(body.email);
        if (!user)
            throw new UnprocessableEntityException('Oops! This email is not registered with us.');

        const is_password_valid = await this.authService.validatePassword(
            body.password,
            user.password,
        );
        if (!is_password_valid)
            throw new BadRequestException(
                'Um, the password you entered is incorrect. Please try again.',
            );

        const access_token = this.helper.generateToken(TokenEnum.ACCESS_TOKEN, {
            user_id: user._id,
            email: user.email,
        });

        // Generate a refresh token and set it as a cookie
        const token_id = new ObjectId().toString();
        const refresh_token = this.helper.generateToken(TokenEnum.REFRESH_TOKEN, {
            token_id,
            user_id: user._id,
        });
        setCookie(response, TokenEnum.REFRESH_TOKEN, refresh_token);

        // TODO: trigger refresh token creation event and store request details with token and it's expiry

        // TODO: trigger user login event

        const is_admin = user.role === Role.ADMIN;
        if (is_admin) {
            // add extra security layer to check for admin in database admin's table
            const admin_token = this.helper.generateToken(TokenEnum.ADMIN_TOKEN, {
                admin_id: user._id,
                role: user.role,
            });
            setCookie(response, TokenEnum.ADMIN_TOKEN, admin_token);
        } else {
            this.helper.clearCookies(response, TokenEnum.ADMIN_TOKEN);
        }

        return {
            message: 'Welcome back buddy! 🎉',
            user: this.authService.serializeUser(user),
            token: access_token,
        };
    }

    @Get('token/refresh')
    handleTokenRefreshing() {
        return 'Not Implemented';
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('get/me')
    async handleGetMe(@Req() request: Request) {
        if (!request.user) return null;
        return this.authService.getUserByEmail(request.user.email);
    }
}
