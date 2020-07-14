class Task {
    public chatId: number | undefined;
    public service: string | undefined;
    public url: string | undefined;
    public auctions: string[] | undefined;

    setChatId(chatId: number) {
        this.chatId = chatId;
        return this;
    }

    setService(service: string) {
        this.service = service;
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    setAuctions(auctions: string[]) {
        this.auctions = auctions;
        return this;
    }
}

export { Task };