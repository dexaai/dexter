import ky from 'ky';
export const createSpladeClient = () => ({
    async createSparseVector(params, serviceUrl) {
        try {
            const sparseValues = await ky
                .post(serviceUrl, {
                timeout: 1000 * 60,
                json: { text: params.input },
            })
                .json();
            return sparseValues;
        }
        catch (e) {
            // @ts-ignore: TODO: add custom Error class that handles this
            throw new Error('Failed to create splade vector', { cause: e });
        }
    },
});
//# sourceMappingURL=splade.js.map