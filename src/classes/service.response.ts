class ServiceResponse {
    private success: boolean | undefined;
    private message: string | undefined;
    private name: string | undefined;

    setSuccess(success: boolean) {
        this.success = success;
        return this;
    }

    setMessage(message: string) {
        this.message = message;
        return this;
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    get successResult() {
        return this.success;
    }

    get messageResult() {
        return this.message;
    }

    get nameResult() {
        return this.name;
    }
}

export { ServiceResponse };