import readline from "node:readline";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { allFunctions as calendarFunctions } from "./tools/calendar.js";
import { allFunctions as emailFunctions } from "./tools/email.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_API_KEY });

const allDefinitions = [...calendarFunctions, ...emailFunctions];
const allDeclarations = allDefinitions.map((f) => f.declaration);
const allFunctions = Object.fromEntries(
	allDefinitions.map((def) => [def.declaration.name, def.function]),
);

const contents = [];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

while (true) {
	const query = await new Promise((resolve) => {
		rl.question("Você: ", resolve);
	});

	contents.push({
		role: "user",
		parts: [{ text: query }],
	});

	let response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents,
		config: {
			tools: [
				{
					functionDeclarations: allDeclarations,
				},
			],
		},
	});

	while (response.functionCalls) {
		const functionCall = response.candidates[0].content.parts[0].functionCall;
		const functionToExecute = functionCall.name;
		const functionParameters = functionCall.args;
		const fn = allFunctions[functionToExecute];

		console.log(`** Chamando função ${functionToExecute}`);

		const result = fn(functionParameters);

		contents.push(response.candidates[0].content);

		const functionResponse = {
			role: "user",
			parts: [
				{
					functionResponse: {
						name: functionToExecute,
						response: {
							result: result,
						},
					},
				},
			],
		};

		contents.push(functionResponse);

		response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents,
			config: {
				tools: [
					{
						functionDeclarations: allDeclarations,
					},
				],
			},
		});
	}

	console.log(`IA: ${response.candidates[0].content.parts[0].text}`);
}
