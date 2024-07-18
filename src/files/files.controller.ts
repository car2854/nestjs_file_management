import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response } from 'express';
import { CreateFolderDto } from './create-folder-dto';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}
  // Obtener los archivos
  @Get()
  async getAllFiles(
    @Query('folderName') folderName: string,
  ): Promise<
    { fileName: string; name: string; publicUrl: string; format: string }[]
  > {
    return this.fileService.listFiles(folderName);
  }
  // Subir los archivos
  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  async uploadFiles(
    @Query('folderName') folderName: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    console.log(folderName);
    const data = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await this.fileService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          folderName,
        );
        return uploadedFile;
      }),
    );
    console.log(data);
    return data;
  }
  // Crear carpetas
  @Post('/folders')
  async createFolder(
    @Body(ValidationPipe) createFolderDto: CreateFolderDto,
    @Res() res: Response,
  ) {
    try {
      const { folderName } = createFolderDto;

      const result = await this.fileService.createFolder(folderName);
      return res.status(201).json({ message: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Error al crear la carpeta: ${error.message}` });
    }
  }
  // Eliminar un archivo o carpeta
  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      if (fileName.endsWith('/')) {
        await this.fileService.deleteFolder(fileName);
      } else {
        await this.fileService.deleteFile(fileName);
      }
      return res
        .status(200)
        .json({ message: `Archivo ${fileName} eliminado exitosamente.` });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Error al eliminar el archivo: ${error.message}` });
    }
  }
}
