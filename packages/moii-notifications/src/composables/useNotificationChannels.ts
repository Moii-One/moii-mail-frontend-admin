import { ref, computed } from 'vue';

export interface NotificationChannel {
    value: string;
    label: string;
    icon: string;
    color: string;
    enabled: boolean;
}

const channels = ref<NotificationChannel[]>([
    {
        value: 'email',
        label: 'Email',
        icon: 'mail',
        color: 'primary',
        enabled: true,
    },
    {
        value: 'sms',
        label: 'SMS',
        icon: 'message',
        color: 'success',
        enabled: true,
    },
    {
        value: 'push',
        label: 'Push Notification',
        icon: 'bell',
        color: 'warning',
        enabled: true,
    },
]);

const enabledChannels = computed(() => channels.value.filter(channel => channel.enabled));

const getChannelByValue = (value: string) => {
    return channels.value.find(channel => channel.value === value);
};

const getChannelIcon = (value: string) => {
    const channel = getChannelByValue(value);
    return channel?.icon || 'bell';
};

const getChannelColor = (value: string) => {
    const channel = getChannelByValue(value);
    return channel?.color || 'secondary';
};

const getChannelLabel = (value: string) => {
    const channel = getChannelByValue(value);
    return channel?.label || value;
};

export default function useNotificationChannels() {
    return {
        channels,
        enabledChannels,
        getChannelByValue,
        getChannelIcon,
        getChannelColor,
        getChannelLabel,
    };
}
