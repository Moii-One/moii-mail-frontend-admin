<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="$emit('close')" class="relative z-[51]">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button
                                type="button"
                                class="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                @click="$emit('close')"
                            >
                                <icon-x />
                            </button>
                            <div class="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                Edit Review
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="handleSubmit">
                                    <div class="mb-5">
                                        <label for="rating">Rating *</label>
                                        <select id="rating" v-model="form.rating" class="form-select" required>
                                            <option value="1">1 Star</option>
                                            <option value="2">2 Stars</option>
                                            <option value="3">3 Stars</option>
                                            <option value="4">4 Stars</option>
                                            <option value="5">5 Stars</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-5">
                                        <label for="comment">Comment *</label>
                                        <textarea 
                                            id="comment"
                                            v-model="form.comment" 
                                            class="form-textarea" 
                                            rows="4" 
                                            required
                                            placeholder="Enter review comment"
                                        ></textarea>
                                    </div>

                                    <div class="mb-5">
                                        <label for="status">Status *</label>
                                        <select id="status" v-model="form.status" class="form-select" required>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>

                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" class="btn btn-outline-danger" @click="$emit('close')" :disabled="loading">Cancel</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4" :disabled="loading">
                                            Update Review
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
import IconX from './icon/icon-x.vue';

interface Props {
    show: boolean;
    review: any;
    loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    close: [];
    save: [data: { rating: number; comment: string; status: 'pending' | 'approved' | 'rejected' }];
}>();

const form = ref({
    rating: 1,
    comment: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
});

watch(() => props.review, (newReview) => {
    if (newReview) {
        form.value.rating = newReview.rating;
        form.value.comment = newReview.comment;
        form.value.status = newReview.status;
    }
}, { immediate: true });

const handleSubmit = () => {
    emit('save', { ...form.value });
};
</script>

<style scoped>
/* Modal styles are handled by Headless UI components */
</style>
