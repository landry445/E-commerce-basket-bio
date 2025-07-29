import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Express } from 'express';
import { Response } from 'express';

import { BasketsService } from './baskets.service';
import { Basket } from './entities/basket.entity';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

const multerOptions = {
  storage: memoryStorage(), // fichier gardé en mémoire
  fileFilter: (_req, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Only images are allowed'), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
};

@Controller('baskets')
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}

  @Get()
  findAll(): Promise<Basket[]> {
    return this.basketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Basket> {
    return this.basketsService.findOne(id);
  }

  @Get(':id/image')
  async getImage(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const basket = await this.basketsService.findOne(id);
    if (!basket?.image_data || !basket.image_mime?.startsWith('image/')) {
      return res.status(404).send('No image found');
    }
    res.setHeader('Content-Type', basket.image_mime);
    res.send(basket.image_data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(@UploadedFile() file: Express.Multer.File, @Req() req): Promise<Basket> {
    const { name, price, description, actif } = req.body;
    return this.basketsService.create({
      name_basket: name,
      price_basket: Math.round(parseFloat(price) * 100),
      description,
      image_data: file?.buffer,
      image_mime: file?.mimetype,
      actif: actif === 'true' || actif === true,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ): Promise<Basket> {
    const { name, price, description, actif } = req.body;
    // On récupère le panier actuel pour l’ancienne image
    const current = await this.basketsService.findOne(id);

    return this.basketsService.update(id, {
      name_basket: name,
      price_basket: Math.round(parseFloat(price) * 100),
      description,
      image_data: file?.buffer || current.image_data,
      image_mime: file?.mimetype || current.image_mime,
      actif: actif === 'true' || actif === true,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.basketsService.remove(id);
  }
}
