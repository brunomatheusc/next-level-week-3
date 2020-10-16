import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from './../models/Orphanages';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

class OrphanagesController {
	async create(req: Request, res: Response) {
		const requestImages = req.files as Express.Multer.File[];
		const images = requestImages.map(image => { 
			return { path: image.filename }
		});
		
		const orphanageRepository = getRepository(Orphanage);

		const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } = req.body;
		const data = { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends, images };

		const schema = Yup.object().shape({
			name: Yup.string().required('Nome obrigatório'),
			latitude: Yup.number().required(),
			longitude: Yup.number().required(),
			about: Yup.string().required().max(300),
			instructions: Yup.string().required(),
			opening_hours: Yup.string().required(),
			open_on_weekends: Yup.boolean().required(),
			images: Yup.array(Yup.object().shape({
				path: Yup.string().required()
			}))
		});

		await schema.validate(data, { abortEarly: false });
		
		const orphanage = orphanageRepository.create(data);

		orphanageRepository.save(orphanage);

		return res.status(201).json(orphanage);
	}

	async index(req: Request, res: Response) {
		const orphanageRepository = getRepository(Orphanage);
		const orphanages = await orphanageRepository.find({ relations: ['images'] });

		return res.json(orphanageView.renderMany(orphanages));
	}

	async show(req: Request, res: Response) {
		const { orphanageId } = req.params;		
		const orphanageRepository = getRepository(Orphanage);

		const orphanage = await orphanageRepository.findOneOrFail(orphanageId, { relations: ['images'] });

		return res.json(orphanageView.render(orphanage));
	}
}

export default new OrphanagesController();