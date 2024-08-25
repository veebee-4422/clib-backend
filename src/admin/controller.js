import { BadRequestError } from "../utils/customErrors.js";
import AdminService from "./service.js";

export default class AdminController {
	#service;

	constructor() {
		this.#service = new AdminService();
	}
}