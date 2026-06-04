export type Poll = {
    question: { text: string },
    answers: PollAnswer[],
    duration?: number,
    allow_multiselect?: boolean
}

export type PollAnswer = { poll_media: { text: string, emoji?: Partial<{ name: string, id: string }> } }