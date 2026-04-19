const mockEvents = {
	"2025-05-01": [
		{ title: "Reunião com orientador", time: "10:00", attendees: ["Prof. Carlos"] },
		{ title: "Entrega de relatório", time: "14:00", attendees: [] },
	],
	"2025-05-02": [
		{ title: "Defesa de TCC", time: "09:00", attendees: ["Prof. Ana", "Prof. João"] },
	],
};

const getTodayDate = {
	function: () => {
		return "2025-05-01";
	},
	declaration: {
		name: "getTodayDate",
		description: "Retorna a data de hoje no formato yyyy-mm-dd",
	},
};

const getEvents = {
	function: ({ date }) => {
		const events = mockEvents[date] ?? [];
		if (events.length === 0) return `Nenhum evento encontrado para ${date}.`;
		return events
			.map((e) => `- ${e.title} às ${e.time}${e.attendees.length ? ` com ${e.attendees.join(", ")}` : ""}`)
			.join("\n");
	},
	declaration: {
		name: "getEvents",
		description: "Retorna os eventos do calendário para um determinado dia",
		parameters: {
			type: "OBJECT",
			properties: {
				date: {
					type: "STRING",
					description:
						"A data para a qual queremos retornar os eventos, no formato yyyy-mm-dd",
				},
			},
			required: ["date"],
		},
	},
};

const scheduleEvent = {
	function: ({ title, date, time, attendees = [] }) => {
		if (!mockEvents[date]) mockEvents[date] = [];
		mockEvents[date].push({ title, time, attendees });
		return `Evento "${title}" marcado para ${date} às ${time}${attendees.length ? ` com ${attendees.join(", ")}` : ""}.`;
	},
	declaration: {
		name: "scheduleEvent",
		description: "Marca um novo evento na agenda",
		parameters: {
			type: "OBJECT",
			properties: {
				title: {
					type: "STRING",
					description: "O título do evento",
				},
				date: {
					type: "STRING",
					description: "A data do evento, no formato yyyy-mm-dd",
				},
				time: {
					type: "STRING",
					description: "O horário do evento, no formato HH:MM",
				},
				attendees: {
					type: "ARRAY",
					items: { type: "STRING" },
					description: "Lista de nomes de convidados para o evento",
				},
			},
			required: ["title", "date", "time"],
		},
	},
};

const rescheduleEvent = {
	function: ({ title, date, newTime }) => {
		const events = mockEvents[date] ?? [];
		const event = events.find((e) => e.title === title);
		if (!event) return `Evento "${title}" não encontrado em ${date}.`;
		event.time = newTime;
		return `Evento "${title}" do dia ${date} remarcado para às ${newTime}.`;
	},
	declaration: {
		name: "rescheduleEvent",
		description: "Remarca um novo evento na agenda para um novo horário.",
		parameters: {
			type: "OBJECT",
			properties: {
				title: {
					type: "STRING",
					description: "O título do evento para remarcar",
				},
				date: {
					type: "STRING",
					description: "A data do evento, no formato yyyy-mm-dd",
				},
				newTime: {
					type: "STRING",
					description: "A nova hora do evento, no formato HH:MM",
				},
			},
			required: ["title", "date", "newTime"],
		},
	},
};

const allFunctions = [getTodayDate, getEvents, scheduleEvent, rescheduleEvent];

export { allFunctions };
