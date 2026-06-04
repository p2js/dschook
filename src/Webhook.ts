type Config = {}

class Webhook {
    #url: string;
    #config: Config;
    constructor(url: string, config: Config = {}) {
        this.#url = url;
        this.#config = config;
    }

    send_raw(body: object) {
        fetch(this.#url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...this.#config, ...body })
        });
    }

    send_text(content: string) {
        this.send_raw({ content });
    }
}
