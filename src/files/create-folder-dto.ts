import { IsString } from 'class-validator';

export class CreateFolderDto{
  @IsString()
  readonly folderName: string;
}
