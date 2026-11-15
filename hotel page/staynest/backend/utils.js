export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const bad = (message, status = 400) => Object.assign(new Error(message), { status });
