/**
 * A custom logger
 */
export default {
    info: (...rest) => {
        console.info(...rest);
    },
    error: (...rest) => {
        console.error(...rest);
    },
    debug: (...rest) => {
        console.debug(...rest);
    }
}