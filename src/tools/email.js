const mockInbox = [
	{ from: "prof.carlos@uni.edu", subject: "Reunião de orientação", body: "Podemos marcar para quinta às 10h?" },
	{ from: "coord.ana@uni.edu", subject: "Entrega de documentos", body: "Favor enviar o formulário até sexta." },
	{ from: "joao.silva@gmail.com", subject: "Dúvida sobre TCC", body: "Quando é a próxima apresentação?" },
];

const getEmails = {
	function: () => {
		if (mockInbox.length === 0) return "Caixa de entrada vazia.";
		return mockInbox
			.map((e, i) => `[${i + 1}] De: ${e.from} | Assunto: ${e.subject}\n    ${e.body}`)
			.join("\n\n");
	},
	declaration: {
		name: "getEmails",
		description: "Retorna todos os emails na caixa de entrada",
	},
};

const sendEmail = {
	function: ({ contact, message }) => {
		return `Email enviado para ${contact}: "${message}"`;
	},
	declaration: {
		name: "sendEmail",
		description: "Envia um email para um contato",
		parameters: {
			type: "OBJECT",
			properties: {
				contact: {
					type: "STRING",
					description: "O nome do contato para enviar a mensagem",
				},
				message: {
					type: "STRING",
					description: "A mensagem a ser enviada",
				},
			},
			required: ["contact", "message"],
		},
	},
};

const allFunctions = [getEmails, sendEmail];

export { allFunctions };
