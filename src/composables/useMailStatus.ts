import type { MailStatus } from '../types';

export function useMailStatus() {
    const getStatusLabel = (status: MailStatus): string => {
        const labels: Record<MailStatus, string> = {
            pending: 'Pending',
            sent: 'Sent',
            delivered: 'Delivered',
            failed: 'Failed',
            bounced: 'Bounced'
        };
        return labels[status] || status;
    };

    const getStatusBadgeClass = (status: MailStatus): string => {
        const classes: Record<MailStatus, string> = {
            pending: 'badge-outline-warning',
            sent: 'badge-outline-info',
            delivered: 'badge-outline-success',
            failed: 'badge-outline-danger',
            bounced: 'badge-outline-danger'
        };
        return `badge ${classes[status] || 'badge-outline-secondary'}`;
    };

    const getStatusIcon = (status: MailStatus): string => {
        const icons: Record<MailStatus, string> = {
            pending: 'clock',
            sent: 'send',
            delivered: 'check-circle',
            failed: 'x-circle',
            bounced: 'alert-triangle'
        };
        return icons[status] || 'mail';
    };

    const getStatusColor = (status: MailStatus): string => {
        const colors: Record<MailStatus, string> = {
            pending: 'warning',
            sent: 'info',
            delivered: 'success',
            failed: 'danger',
            bounced: 'danger'
        };
        return colors[status] || 'secondary';
    };

    return {
        getStatusLabel,
        getStatusBadgeClass,
        getStatusIcon,
        getStatusColor
    };
}
