class ServiceResponse {
    private success: boolean | undefined;
    private message: string | undefined;
    private name: string | undefined;

    constructor() {

    }

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

    get successResult(): boolean | undefined {
        return this.success;
    }

    get messageResult(): string | undefined {
        return this.message;
    }

    get nameResult(): string | undefined {
        return this.name;
    }
}

export { ServiceResponse };