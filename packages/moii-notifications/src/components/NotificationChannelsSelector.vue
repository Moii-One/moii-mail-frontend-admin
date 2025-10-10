<template>
    <div class="space-y-4 relative z-0 isolate">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notification Channels <span class="text-red-500">*</span>
        </label>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                v-for="channel in enabledChannels"
                :key="channel.value"
                class="relative"
            >
                <label
                    :for="`channel-${channel.value}`"
                    class="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    :class="{
                        'border-primary bg-primary/5': selectedChannels.includes(channel.value),
                        'opacity-50': !channel.enabled,
                    }"
                >
                    <input
                        :id="`channel-${channel.value}`"
                        v-model="selectedChannels"
                        :value="channel.value"
                        type="checkbox"
                        class="sr-only"
                        :disabled="!channel.enabled"
                        @change="handleChannelChange"
                    />

                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-lg flex items-center justify-center"
                            :class="`bg-${channel.color}/10`"
                        >
                            <component
                                :is="getChannelIcon(channel.icon)"
                                :class="`w-5 h-5 text-${channel.color}`"
                            />
                        </div>

                        <div>
                            <h3 class="font-medium text-gray-900 dark:text-white">
                                {{ channel.label }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Send via {{ channel.label.toLowerCase() }}
                            </p>
                        </div>
                    </div>

                    <div
                        v-if="selectedChannels.includes(channel.value)"
                        class="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                        <icon-check class="w-3 h-3 text-white" />
                    </div>
                </label>
            </div>
        </div>

        <div v-if="selectedChannels.length === 0" class="text-sm text-red-600 dark:text-red-400">
            Please select at least one notification channel.
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import useNotificationChannels from '../composables/useNotificationChannels';
import IconCheck from './icon/icon-check.vue';
import IconMail from './icon/icon-mail.vue';
import IconMessage from './icon/icon-message.vue';
import IconBell from './icon/icon-bell.vue';

interface Props {
    modelValue: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:modelValue': [value: string[]];
}>();

const { enabledChannels } = useNotificationChannels();
const selectedChannels = ref<string[]>([...props.modelValue]);

const getChannelIcon = (iconName: string) => {
    const icons = {
        mail: IconMail,
        message: IconMessage,
        bell: IconBell,
    };
    return icons[iconName as keyof typeof icons] || IconBell;
};

const handleChannelChange = () => {
    emit('update:modelValue', selectedChannels.value);
};

watch(() => props.modelValue, (newValue) => {
    selectedChannels.value = [...newValue];
});
</script>
