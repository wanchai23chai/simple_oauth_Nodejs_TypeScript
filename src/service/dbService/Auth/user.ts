import { User } from "../../../model/Auth/User";
import { getConnection, QueryRunner, Connection, Repository, UpdateResult, Like, Raw, FindOperator, FindOptionsUtils, FindConditions } from 'typeorm';
import { mapDataPropertiesToDBColumns } from "../../../utils/dbUtils";
import { O_RDONLY } from "constants";
class UserDbService {
	connection!: Connection;
	userModel!: Repository<User>;
	getDb() {
		this.connection = getConnection();
		this.userModel = this.connection.getRepository(User)
		return this.connection;
	}
	async createUser(entity: User): Promise<User> {
		this.getDb();
		const result = await this.userModel.save(entity)
		return result;
	}
	async findUserByUid(uid: string) {
		this.getDb();
		const result = await this.userModel.findOne({ uid: uid })
		return result;
	}
	async findUserById(id: number) {
		this.getDb();
		const result = await this.userModel.findOne({ user_id: id })
		return result;
	}
	async findUserByEmail(email: string) {
		this.getDb();
		const result = await this.userModel.findOne({ email: email })
		return result;
	}
	async findUserByEmailOrUsername(emailOrUsername: string) {
		this.getDb();
		const result = await this.userModel.findOne({ where: [{ email: emailOrUsername }, { username: emailOrUsername }] })
		return result;
	}
	async updateUserByEmail(entity: User, email: string): Promise<UpdateResult> {
		this.getDb();
		const columns = Object.keys(this.userModel.metadata.propertiesMap);
		let updateData = mapDataPropertiesToDBColumns(columns, entity);
		const result = await this.userModel.update({ email }, updateData);
		return result;
	}
	async updateUserById(entity: User, id: number): Promise<UpdateResult> {
		this.getDb();
		const columns = Object.keys(this.userModel.metadata.propertiesMap);
		let updateData = mapDataPropertiesToDBColumns(columns, entity);
		const result = await this.userModel.update({ user_id: id }, updateData);
		return result;
	}
}
export const userService = new UserDbService();
export default userService;