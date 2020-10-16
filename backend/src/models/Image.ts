import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Orphanage from './Orphanages';

@Entity('images')
export default class Image {
	@PrimaryGeneratedColumn('increment')
	id: Number;

	@Column()
	path: string;

	@ManyToOne(() => Orphanage, orphanage => orphanage.images)
	@JoinColumn({ name: 'orphanage_id' })
	orphanage: Orphanage;
}