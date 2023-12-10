import { EntityRepository, Repository } from 'typeorm';
import { ShareEntity } from './share.entity';

@EntityRepository(ShareEntity)
export class ShareRepository extends Repository<ShareEntity> {}
