<template>
    <div class="mb-6">
        <ReviewsHeader
            title="Reviews Management"
            v-model="filters"
            @update:modelValue="handleFiltersUpdate"
        />

        <!-- Reviews Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <icon-message class="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ reviewsStore.totalReviews }}</h3>
                        <p class="text-white-dark text-sm">Total Reviews</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <icon-clock class="w-6 h-6 text-warning" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ reviewsStore.pendingReviews.length }}</h3>
                        <p class="text-white-dark text-sm">Pending Reviews</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <icon-thumbs-up class="w-6 h-6 text-success" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ reviewsStore.approvedReviews.length }}</h3>
                        <p class="text-white-dark text-sm">Approved Reviews</p>
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <div class="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                            <icon-thumbs-down class="w-6 h-6 text-danger" />
                        </div>
                    </div>
                    <div class="ltr:ml-3 rtl:mr-3">
                        <h3 class="text-xl font-semibold">{{ reviewsStore.rejectedReviews.length }}</h3>
                        <p class="text-white-dark text-sm">Rejected Reviews</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel p-0 border-0 overflow-hidden">
            <div class="datatable" v-if="filteredReviews.length > 0 || reviewsStore.loading">
                <vue3-datatable
                    :rows="filteredReviews"
                    :columns="cols"
                    :totalRows="reviewsStore.pagination.total"
                    :search="filters.search"
                    :loading="reviewsStore.loading"
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #user_name="data">
                        <div class="flex items-center">
                            <div class="shrink-0">
                                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span class="text-sm font-semibold text-primary">{{ getInitials(data.value.user_name) || data.value.user_email?.charAt(0).toUpperCase() || '' }}</span>
                                </div>
                            </div>
                            <div class="ltr:ml-3 rtl:mr-3">
                                <div class="font-semibold">{{ data.value.user_name }}</div>
                                <div class="text-xs text-white-dark">{{ data.value.user_email }}</div>
                            </div>
                        </div>
                    </template>
                    <template #reviewable_name="data">
                        <div v-if="data.value.reviewable_name !== 'N/A'">
                            <div class="font-semibold">{{ data.value.reviewable_name }}</div>
                            <div class="text-xs text-white-dark">{{ data.value.reviewable_type }}</div>
                        </div>
                        <div v-else class="text-white-dark">N/A</div>
                    </template>
                    <template #rating="data">
                        <div class="flex items-center">
                            <div class="flex">
                                <icon-star v-for="i in 5" :key="i" :class="i <= data.value.rating ? 'text-warning' : 'text-white-dark'" class="w-4 h-4" />
                            </div>
                            <span class="ltr:ml-2 rtl:mr-2">{{ data.value.rating }}/5</span>
                        </div>
                    </template>
                    <template #status="data">
                        <span :class="getStatusClass(data.value.status)" class="badge">
                            {{ data.value.status }}
                        </span>
                    </template>
                    <template #comment="data">
                        <div class="max-w-xs truncate" :title="data.value.comment">
                            {{ data.value.comment }}
                        </div>
                    </template>
                    <template #created_at="data">
                        <div class="text-sm">{{ formatDate(data.value.created_at) }}</div>
                        <div class="text-xs text-white-dark">{{ getTimeAgo(data.value.created_at) }}</div>
                    </template>
                    <template #actions="data">
                        <div class="flex items-center gap-2">
                            <button
                                v-if="data.value.status === 'pending'"
                                type="button"
                                class="btn btn-sm btn-success"
                                @click="approveReview(data.value.id)"
                                :disabled="reviewsStore.loading"
                            >
                                <icon-check class="w-4 h-4" />
                            </button>
                            <button
                                v-if="data.value.status === 'pending'"
                                type="button"
                                class="btn btn-sm btn-danger"
                                @click="rejectReview(data.value.id)"
                                :disabled="reviewsStore.loading"
                            >
                                <icon-x class="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                @click="editReview(data.value.id)"
                                :disabled="reviewsStore.loading"
                            >
                                <icon-edit class="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                @click="deleteReview(data.value.id)"
                                :disabled="reviewsStore.loading"
                            >
                                <icon-trash class="w-4 h-4" />
                            </button>
                        </div>
                    </template>
                </vue3-datatable>
            </div>
            <div v-else class="p-8 text-center text-gray-500">
                No reviews found
            </div>
        </div>

        <!-- Review Modal -->
        <ReviewModal
            :show="showModal"
            :review="selectedReview"
            :loading="reviewsStore.loading"
            @close="closeModal"
            @save="handleSaveReview"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useReviewsStore } from '../stores/reviews';
import ReviewsHeader, { ReviewFilterModel } from '../components/ReviewsHeader.vue';
import ReviewModal from '../components/ReviewModal.vue';
import IconMessage from '../components/icon/icon-message.vue';
import IconClock from '../components/icon/icon-clock.vue';
import IconThumbsUp from '../components/icon/icon-thumbs-up.vue';
import IconThumbsDown from '../components/icon/icon-thumbs-down.vue';
import IconStar from '../components/icon/icon-star.vue';
import IconCheck from '../components/icon/icon-check.vue';
import IconX from '../components/icon/icon-x.vue';
import IconEdit from '../components/icon/icon-edit.vue';
import IconTrash from '../components/icon/icon-trash.vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';

const reviewsStore = useReviewsStore();

const filters = ref<ReviewFilterModel>({
    search: '',
    status: '',
    rating: ''
});

const showModal = ref(false);
const selectedReview = ref<any>(null);

const filteredReviews = computed(() => {
    return reviewsStore.reviews.map(review => {
        return {
            id: review.id,
            user_name: review.user.name || 'Unknown User',
            user_email: review.user.email,
            reviewable_name: review.reviewable?.name || 'N/A',
            reviewable_type: review.reviewable?.type || '',
            rating: review.rating,
            comment: review.comment,
            status: review.status,
            created_at: review.created_at,
            actions: review, // for actions
        };
    });
});

const cols = ref([
    { field: 'user_name', title: 'User' },
    { field: 'reviewable_name', title: 'Reviewable' },
    { field: 'rating', title: 'Rating' },
    { field: 'comment', title: 'Comment' },
    { field: 'status', title: 'Status' },
    { field: 'created_at', title: 'Created' },
    { field: 'actions', title: 'Actions', isUnique: true, sort: false }
]);

const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'approved':
            return 'badge-outline-success';
        case 'rejected':
            return 'badge-outline-danger';
        case 'pending':
            return 'badge-outline-warning';
        default:
            return 'badge-outline-secondary';
    }
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        return 'Invalid Date';
    }
};

const getTimeAgo = (dateString: string): string => {
    try {
        const now = new Date();
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const handleFiltersUpdate = async (newFilters: ReviewFilterModel) => {
    filters.value = newFilters;
    await reviewsStore.fetchReviews({
        search: newFilters.search,
        status: newFilters.status,
        rating: newFilters.rating
    });
};

const approveReview = async (id: number) => {
    const result = await Swal.fire({
        title: 'Approve Review?',
        text: 'Are you sure you want to approve this review?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await reviewsStore.approveReview(id);
            showMessage('Review approved successfully.');
        } catch (error: any) {
            console.error('Error approving review:', error);
            showMessage(error?.message || 'Failed to approve review.', 'error');
        }
    }
};

const rejectReview = async (id: number) => {
    const result = await Swal.fire({
        title: 'Reject Review?',
        text: 'Are you sure you want to reject this review?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reject',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await reviewsStore.rejectReview(id);
            showMessage('Review rejected successfully.');
        } catch (error: any) {
            console.error('Error rejecting review:', error);
            showMessage(error?.message || 'Failed to reject review.', 'error');
        }
    }
};

const editReview = async (id: number) => {
    const review = reviewsStore.reviews.find(r => r.id === id);
    if (review) {
        selectedReview.value = review;
        showModal.value = true;
    }
};

const deleteReview = async (id: number) => {
    const result = await Swal.fire({
        title: 'Delete Review?',
        text: 'Are you sure you want to delete this review? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await reviewsStore.deleteReview(id);
            showMessage('Review deleted successfully.');
        } catch (error: any) {
            console.error('Error deleting review:', error);
            showMessage(error?.message || 'Failed to delete review.', 'error');
        }
    }
};

const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    toast.fire({
        icon: type,
        title: message,
    });
};

const closeModal = () => {
    showModal.value = false;
    selectedReview.value = null;
};

const handleSaveReview = async (reviewData: { rating: number; comment: string; status: 'pending' | 'approved' | 'rejected' }) => {
    try {
        if (selectedReview.value) {
            await reviewsStore.updateReview(selectedReview.value.id, reviewData);
            showMessage('Review updated successfully.');
            closeModal();
            // Refresh the reviews data after successful update
            await reviewsStore.fetchReviews({
                search: filters.value.search,
                status: filters.value.status,
                rating: filters.value.rating
            });
        }
    } catch (error: any) {
        console.error('Error saving review:', error);
        showMessage(error?.message || 'Failed to save review.', 'error');
    }
};

onMounted(async () => {
    await reviewsStore.fetchReviews();
});
</script>

<style>
.datatable .bh-pagination {
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>
