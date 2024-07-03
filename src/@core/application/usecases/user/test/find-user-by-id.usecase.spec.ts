import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";
import { TUserInputDTO } from "../../../dto/user.dto";
import { userFactory } from "../../../factories/user.factory";
import { FindUserByIdUsecase } from "../find-user-by-id.usecase";
import { mapUserOutput } from "../map";

describe("FindUserByIdUsecase", () => {
  let userRepository: IUserRepository;
  let findUserByIdUsecase: FindUserByIdUsecase;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      isOwner: jest.fn(),
    } as jest.Mocked<IUserRepository>
    findUserByIdUsecase = new FindUserByIdUsecase(userRepository);
  });

  it("should throw an not found exception when user is not found", async () => {
    const userId = "123";
    userRepository.findById = jest.fn().mockResolvedValue(null);

    // Assert
    await expect(findUserByIdUsecase.execute(userId)).rejects.toThrow(NotFoundException)
  });

  it("should return user output when user is found", async () => {
    const userProps: TUserInputDTO = {
      email: 'lidia@gmail.com',
      password: 'password',
      username: 'Lidia',
    };
    const user = userFactory(userProps).value.getValue()
    // Arrange
    const userId = "123";
    user.setId(userId);
    userRepository.findById = jest.fn().mockResolvedValue(user);

    // Act
    const result = await findUserByIdUsecase.execute(userId);

    // Assert
    expect(result).toEqual(mapUserOutput(user));
  });
});
