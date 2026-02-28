export interface LoginDto {
    username?: string;
    password?: string;
}

export interface LoginResponseDto {
    token?: string;
    user?: any;
}

export interface RegisterDto {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    username?: string;
    password?: string;
}

export interface ForgotPasswordDto { }
export interface VerifyOtpDto { }
export interface ResetPasswordDto { }
export interface UpdateProfileDto { }
