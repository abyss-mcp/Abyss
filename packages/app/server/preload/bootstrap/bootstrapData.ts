import { ToolController } from '../controllers/tool';
import { UserSettingsController } from '../controllers/user-settings';

export const PrismaBoostrapper = {
    bootstrapDB: async () => {
        await ToolController.create({
            name: 'Propose NodeJs Action',
            description: 'Allow the AI to write a new NodeJS script, save it to disk, and register it as an action.',
            type: 'SYSTEM',
            schema: {
                source: 'Raw Nodejs Source code as common js format',
            },
        });
        await UserSettingsController.updateFirst({ bootstrapped: true });
    },
};
