import { Attachment } from "./attachment.js";
import { colors } from "./color.js";
import { Component, components, IS_COMPONENTS_V2 } from "./components.js";
import { Embed } from "./embed.js";
import { Poll, PollAnswer } from "./poll.js";

export class Webhook {
    static components = components;
    static colors = colors;

    #url: string;
    #tts?: boolean = undefined;
    #as_user: User = {};
    #in_thread: Thread = {};

    constructor(url: string) {
        this.#url = url;
    }

    as_user(username: string, avatar_url?: string) {
        this.#as_user.username = username;
        if (avatar_url) this.#as_user.avatar_url = avatar_url;
        return this;
    }

    in_thread(thread_name: string, applied_tags?: string[]) {
        this.#in_thread.thread_name = thread_name;
        if (applied_tags) this.#in_thread.applied_tags = applied_tags;
        return this;
    }

    with_tts(tts: boolean = true) {
        this.#tts = tts;
        return this;
    }

    #send_raw(body: WebhookBody) {
        // If the message contains components send it as such
        let url = this.#url;
        if (body.components) {
            url += "?with_components=true";
            body.flags ||= IS_COMPONENTS_V2;
        }
        if (typeof this.#tts == "boolean") body.tts = this.#tts;
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...this.#as_user,
                ...this.#in_thread,
                ...body
            })
        }).then(async response => {
            if (response.status > 399) console.warn(
                "[DiscordWebhook] Webhook execution returned error code",
                response.status, await response.json()
            );
        });
        // Reset temporary modifiers
        this.#as_user = this.#in_thread = {};
        this.#tts = undefined;
    }

    send(contents: WebhookContents) { this.#send_raw(contents) }
    send_text(content: string) { this.#send_raw({ content }) }
    send_embed(...embeds: Embed[]) { this.#send_raw({ embeds }) }
    send_components(...components: Component[]) { this.#send_raw({ components }) }
    send_poll(
        question: string,
        answers: (string | { text: string, emoji_id?: string, emoji_name?: string })[],
        duration_hours?: number,
        allow_multiselect?: boolean,
    ) {
        let poll_answers: PollAnswer[] = answers.map((answer, i) => {
            if (typeof answer == "string") return { poll_media: { text: answer } };
            let ans: PollAnswer = { poll_media: { text: answer.text } };
            if (answer.emoji_name) ans.poll_media.emoji = { name: answer.emoji_name };
            if (answer.emoji_id) ans.poll_media.emoji = { id: answer.emoji_id };
            return ans;
        })

        let poll: Poll = { question: { text: question }, answers: poll_answers };
        if (typeof duration_hours == "number") poll.duration = duration_hours;
        if (typeof allow_multiselect == "boolean") poll.allow_multiselect = allow_multiselect;

        this.#send_raw({ poll });
    }
}

type User = { username?: string, avatar_url?: string }
type Thread = { thread_name?: string, applied_tags?: string[] }

export { Component, Embed, Poll, PollAnswer };
export type WebhookBody = WebhookContents & {
    username?: string,
    avatar_url?: string,
    tts?: boolean,
    allowed_mentions?: {},
    payload_json?: string,
    attachments?: Attachment[],
    flags?: number,
    thread_name?: string,
    applied_tags?: string[]
}
export type WebhookContents = Partial<{
    content: string,
    embeds: Embed[],
    files: File[],
    poll: Poll,
    components: Component[]
}>
