import { BadRequestError } from "../utils/customErrors.js";
import RegisterLoginService from "./service.js";

export default class RegisterLoginController {
	#service;

	constructor() {
		this.#service = new RegisterLoginService();
	}
}