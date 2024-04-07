export function getPaymentMethods() {
  return new Promise((resolve, reject) => {
    fetch("/api/payment-method")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
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
export function createPaymentMethod() {}
export function updatePaymentMethod() {}
export function deletePaymentMethod() {}
export function getPaymentMethod() {}
