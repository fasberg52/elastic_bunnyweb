import { ApiResponseOptions } from "@nestjs/swagger";

export class MessageResponse {
	message: string;
	success: boolean;
	constructor(message: string) {
		this.success = true;
		this.message = message;
	}

	static getApiDoc(): ApiResponseOptions {
		return {
			status: 200,
			description: 'Message response',
			type: MessageResponse,
		};
	}
}
