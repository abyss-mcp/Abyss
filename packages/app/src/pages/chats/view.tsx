import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { useChatWithModel } from '../../state/hooks/useChat';
import { ChatMessageSection } from '../../library/content/chat-section';
import { Button } from '../../library/input/button';
import { Database } from '../../main';
import { BotIcon } from 'lucide-react';
import { InputArea } from '../../library/input/input';
import { WithSidebar } from '../../library/layout/sidebar';

export function ChatViewPage() {
    const { id } = useParams();
    const chat = useChatWithModel(id || '');
    const [message, setMessage] = useState('');

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Chats', url: '/chats' },
        { name: id || '', url: `/chats/id/${id}` },
    ];

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    const onAskAiToRespond = async () => {
        try {
            if (chat.chat && chat.chat.id) {
                Database.workflows.askAIToRespondToChat(chat.chat.id);
            }
        } catch (error) {}
    };

    const onSendMessage = async () => {
        try {
            if (chat.chat && chat.chat.id && chat.thread && chat.thread.id && message.trim()) {
                await Database.table.messageThread.addMessage(chat.thread.id, {
                    role: 'USER',
                    source: 'USER',
                    content: message,
                });
                setMessage('');
                await Database.workflows.askAIToRespondToChat(chat.chat.id);
            }
        } catch (error) {}
    };

    const content =
        chat.loading || !chat.chat || !chat.messages || !chat.thread || !chat.model ? (
            <div className="text-text-base">Loading chat data...</div>
        ) : (
            <>
                {chat.messages.map(m => (
                    <ChatMessageSection message={m} key={m.id} />
                ))}
                {chat.thread.status === 'responding' && (
                    <div className="flex justify-center my-4">
                        <div className="animate-bounce text-text-dark">
                            <BotIcon />
                        </div>
                    </div>
                )}
                {chat.thread.status !== 'responding' && (
                    <>
                        <br />
                        <br />
                        <InputArea
                            value={message}
                            onChange={setMessage}
                            label="Respond"
                            placeholder="Type your message here..."
                            onKeyDown={handleKeyPress}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button onClick={onAskAiToRespond}>Ask AI to respond again</Button>
                            <Button onClick={onSendMessage}>Send your message</Button>
                        </div>
                    </>
                )}
            </>
        );

    return (
        <PageCrumbed title={chat.chat?.name || 'Loading...'} subtitle={chat.chat?.description || undefined} breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
