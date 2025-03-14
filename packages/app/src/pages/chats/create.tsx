import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../library/input/button';
import { Select } from '../../library/input/select';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { Database } from '../../main';
import { useScanTableModelConnections } from '../../state/database-connection';

export function ChatCreatePage() {
    const navigate = useNavigate();
    const allModels = useScanTableModelConnections();
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (allModels.data) {
            if (allModels.data.length) {
                setSelectedModel(allModels.data[0].id);
            }
        }
    }, [allModels.data]);

    const handleSubmit = async () => {
        if (selectedModel && message) {
            const chatRecord = await Database.table.chat.createWithThread({
                name: 'New Chat',
                type: 'chatModel',
                sourceId: selectedModel,
                description: 'New chat with ' + allModels.data?.find(model => model.id === selectedModel)?.name,
            });
            await Database.table.messageThread.addMessage(chatRecord.threadId, {
                type: 'USER',
                sourceId: 'USER',
                content: message,
            });

            Database.workflows.AskAiToTitleConversation(chatRecord.id);
            Database.workflows.AskAiToRespondToChat(chatRecord.id);
            navigate(`/chats/id/${chatRecord.id}`);
        }
    };

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Chats', url: '/chats' },
        { name: 'New Conversation', url: '/chats/create' },
    ];

    const content = (
        <>
            <div className="text-xl font-bold">Start new chat</div>
            <Select
                label="Choose what to chat with"
                value={selectedModel}
                onChange={setSelectedModel}
                options={allModels.data?.map(model => ({ value: model.id, label: model.name })) || []}
                placeholder="Select a model"
            />
            <textarea
                rows={6}
                className="mt-4 w-full bg-background-transparent border border-background-light rounded px-2 py-1 text-sm focus:outline-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your message here"
            />
            <Button disabled={!selectedModel} onClick={handleSubmit}>
                Start Chat
            </Button>
        </>
    );

    return (
        <PageCrumbed title="New Conversation" breadcrumbs={breadcrumbs}>
            {content}
        </PageCrumbed>
    );
}
