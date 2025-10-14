export const socketResponse = <T>(message: string, data: T) => {
    return { message, data };
};