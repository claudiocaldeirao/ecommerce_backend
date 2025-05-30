export class UserCredentialsDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
  ) {}
}
