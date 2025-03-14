import { useDatabaseTableSubscription } from '../database-connection';

export function useChatWithModel(chatId: string) {
    // The chat record
    const chat = useDatabaseTableSubscription(
        'Chat',
        async database => {
            const chat = await database.table.chat.findById(chatId);
            return chat;
        },
        [chatId]
    );

    // The thread record for the chat
    const thread = useDatabaseTableSubscription(
        'MessageThread',
        async database => {
            if (chat.data?.threadId) {
                const thread = await database.table.messageThread.findById(chat.data?.threadId || '');
                return thread;
            }
        },
        [chat.data?.threadId]
    );

    // The messages for the thread
    const messages = useDatabaseTableSubscription(
        'Message',
        async database => {
            if (thread.data?.id) {
                const messages = await database.table.message.findByThreadId(thread.data?.id || '');
                return messages;
            }
        },
        [thread.data?.id]
    );

    // The model for the chat
    const model = useDatabaseTableSubscription(
        'ModelConnections',
        async database => {
            const model = await database.table.modelConnections.findById(chat.data?.sourceId || '');
            return model;
        },
        [chat.data?.sourceId]
    );

    if (chat.loading || thread.loading || messages.loading || model.loading) {
        return {
            loading: true,
        };
    }

    return {
        loading: false,
        chat: chat.data,
        thread: thread.data,
        messages: messages.data,
        model: model.data,
    };
}
