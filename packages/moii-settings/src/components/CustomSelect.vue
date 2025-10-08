<template>
    <div class="custom-multiselect-wrapper">
        <multiselect
            :model-value="selectedOption"
            :options="options"
            class="custom-multiselect"
            :searchable="searchable"
            :allow-empty="allowEmpty"
            :placeholder="placeholder"
            :track-by="trackBy || 'value'"
            :label="label || 'label'"
            :disabled="disabled"
            :max-height="300"
            selected-label=""
            select-label=""
            deselect-label=""
            @update:model-value="handleChange"
        >
            <template #noResult>
                <span class="text-white-dark">No options found</span>
            </template>
            <template #noOptions>
                <span class="text-white-dark">No options available</span>
            </template>
        </multiselect>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Multiselect from '@suadelabs/vue3-multiselect';
import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';

interface Props {
    modelValue: any;
    options: any[];
    placeholder?: string;
    searchable?: boolean;
    allowEmpty?: boolean;
    trackBy?: string;
    label?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Select option',
    searchable: false,
    allowEmpty: true,
    trackBy: 'value',
    label: 'label',
    disabled: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

// Handle cases where options are objects with value/label or simple strings
const selectedOption = computed(() => {
    // If modelValue is empty string, try to find the option with empty value
    if (props.modelValue === '') {
        const trackByProp = props.trackBy || 'value';
        const emptyOption = props.options.find(option => 
            (typeof option === 'object' && trackByProp in option && option[trackByProp] === '') ||
            option === ''
        );
        if (emptyOption) return emptyOption;
    }
    
    if (!props.modelValue) return null;
    
    // If options are objects, use the trackBy prop to find the matching option
    if (props.options.length > 0 && typeof props.options[0] === 'object') {
        const trackByProp = props.trackBy || 'value';
        return props.options.find(option => option[trackByProp] === props.modelValue) || null;
    }
    
    // If options are simple strings/values
    return props.modelValue;
});

const handleChange = (selected: any) => {
    if (!selected) {
        emit('update:modelValue', '');
        return;
    }
    
    // If the selected option is an object, extract the value using trackBy prop
    if (typeof selected === 'object') {
        const trackByProp = props.trackBy || 'value';
        if (trackByProp in selected) {
            emit('update:modelValue', selected[trackByProp]);
        } else {
            emit('update:modelValue', selected);
        }
    } else {
        emit('update:modelValue', selected);
    }
};
</script>

<style scoped>
.custom-multiselect-wrapper {
    position: relative;
    z-index: 1;
}

.custom-multiselect-wrapper :deep(.multiselect) {
    z-index: 1;
    position: relative;
}

/* Let the parent component handle dropdown positioning */
</style>
