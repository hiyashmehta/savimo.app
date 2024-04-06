export function createTransaction({ data }: { data: any }) {
	return new Promise((resolve, reject) => {
		fetch("/api/transactions", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log(data);
				resolve(data);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}
export function getTransactions() {
	return new Promise((resolve, reject) => {
		fetch("/api/transactions")
			.then((res) => res.json())
			.then((json) => {
				if (json.status === "success") {
					resolve(json.result);
				}
				if (json.status === "error") {
					reject(json);
				}
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}

export function updateTransaction({ data }: { data: any }) {
	return new Promise((resolve, reject) => {
		fetch("/api/transactions", {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log(data);
				resolve(data);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}
export function deleteTransaction({ data }: { data: any }) {
	return new Promise((resolve, reject) => {
		fetch("/api/transactions", {
			method: "DELETE",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log(data);
				resolve(data);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
}
