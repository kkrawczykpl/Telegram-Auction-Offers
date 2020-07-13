class Task {
    private chatId: number | undefined;
    private service: string | undefined;
    private url: string | undefined;
    private auctions: string[] | undefined;

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