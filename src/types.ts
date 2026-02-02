// Mail Template Interfaces
export interface MailTemplate {
    id: number;
    uuid: string;
    tenant_id?: number;
    app_id?: number;
    name: string;
    slug: string;
    subject: string;
    content_html?: string;
    content_text?: string;
    css?: string;
    from_email?: string;
    from_name?: string;
    reply_to_email?: string;
    reply_to_name?: string;
    layout?: string;
    variables?: Record<string, string>; // variable_name => description
    tags?: string[];
    version: number;
    parent_template_id?: number;
    is_active: boolean;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    
    // Relations
    parent_template?: MailTemplate;
    child_templates?: MailTemplate[];
    
    // Computed/Usage Stats
    usage_count?: number;
    success_rate?: number;
    last_used_at?: string;
}

export interface CreateTemplateData {
    name: string;
    slug: string;
    subject: string;
    content_html?: string;
    content_text?: string;
    css?: string;
    from_email?: string;
    from_name?: string;
    reply_to_email?: string;
    reply_to_name?: string;
    layout?: string;
    variables?: Record<string, string>;
    tags?: string[];
    parent_template_id?: number;
    is_active?: boolean;
    metadata?: Record<string, any>;
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {}

export interface TemplateFilters {
    search?: string;
    package?: string;
    active?: boolean;
    tags?: string[];
    page?: number;
    per_page?: number;
}

// Mail Log Interfaces
export interface MailLog {
    id: number;
    uuid: string;
    tenant_id?: number;
    app_id?: number;
    template_id?: number;
    scheduled_mail_id?: number;
    subject: string;
    from_email: string;
    from_name: string;
    to_email: string;
    to_name: string;
    cc_emails?: string[];
    bcc_emails?: string[];
    reply_to_email?: string;
    reply_to_name?: string;
    content_html?: string;
    content_text?: string;
    data?: Record<string, any>;
    status: MailStatus;
    priority: MailPriority;
    type: MailType;
    provider?: string;
    provider_id?: string;
    error_message?: string;
    attempts: number;
    sent_at?: string;
    delivered_at?: string;
    failed_at?: string;
    tracking_id: string;
    tags?: string[];
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    
    // Relations
    template?: MailTemplate;
    tracking?: MailTracking[];
}

export interface MailTracking {
    id: number;
    mail_log_id: number;
    event_type: TrackingEventType;
    event_data?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export interface MailFilters {
    search?: string;
    status?: MailStatus;
    template_id?: number;
    package?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

export interface MailStatistics {
    total: number;
    sent: number;
    delivered: number;
    failed: number;
    bounced: number;
    pending: number;
    delivery_rate: number;
    by_template: Record<string, number>;
    by_package: Record<string, number>;
}

// Enums
export type MailStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
export type MailPriority = 'low' | 'normal' | 'high' | 'urgent';
export type MailType = 'transactional' | 'bulk' | 'marketing' | 'system';
export type TrackingEventType = 'open' | 'click' | 'bounce' | 'unsubscribe' | 'spam';

// API Response Interfaces
export interface TemplatesResponse {
    success: boolean;
    message?: string;
    message_code?: string;
    data?: MailTemplate | MailTemplate[];
    pagination?: PaginationData;
}

export interface MailLogsResponse {
    success: boolean;
    message: string;
    message_code: string;
    data?: MailLog[];
    mail?: MailLog;
    pagination?: PaginationData;
}

export interface MailStatsResponse {
    success: boolean;
    message: string;
    message_code: string;
    data?: MailStatistics;
}

export interface PaginationData {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

// Test Template Data
export interface TestTemplateData {
    to_email: string;
    sample_data: Record<string, any>;
}

// Template Preview Data
export interface PreviewTemplateData {
    sample_data: Record<string, any>;
}
