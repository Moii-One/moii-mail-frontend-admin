# Moii Mail Package - Development Plan

**Version:** 1.0.0  
**Package:** `@moii/mail`  
**Purpose:** Email template management and mail logs monitoring

---

## 📋 Overview

The moii-mail frontend package provides a comprehensive admin interface for managing email templates and monitoring sent emails across all moii packages (notifications, auth, etc.). This package focuses on **template management** rather than sending emails, as email sending is handled by other packages (notifications) and direct code (registration, etc.).

---

## 🎯 Core Objectives

### **Primary Goals:**
1. **Template Management** - Create, edit, delete, and organize email templates
2. **Mail Logs Monitoring** - View sent emails, track delivery status, debug failures
3. **Package Integration** - Manage templates used by notifications, auth, and other packages
4. **Template Testing** - Test templates before deployment
5. **Import/Export** - Backup and deploy templates across environments

### **Non-Goals:**
- ❌ Manual email sending interface (handled by notifications package)
- ❌ Scheduling UI (handled by notifications package)
- ❌ Full email composer (not needed for workflow)

---

## 📁 Package Structure

```
admin/packages/moii-mail/
├── .gitignore
├── config.json                 # Package configuration
├── package.json                # NPM package manifest
├── README.md                   # Package documentation
├── DEVELOPMENT.md             # This file
└── src/
    ├── index.ts               # Package exports
    ├── assets/
    │   └── icon/              # SVG icons
    ├── components/            # Reusable components
    │   ├── icon/             # Icon components
    │   │   ├── icon-mail.vue
    │   │   ├── icon-template.vue
    │   │   ├── icon-envelope.vue
    │   │   └── icon-send.vue
    │   ├── MailHeader.vue
    │   ├── MailTemplateEditor.vue
    │   ├── MailVariablePicker.vue
    │   └── MailPreview.vue
    ├── composables/           # Reusable logic
    │   ├── useMailStatus.ts
    │   └── useTemplateVariables.ts
    ├── router/                # Route definitions
    │   └── index.ts
    ├── stores/                # Pinia state management
    │   ├── mail.ts           # Mail logs store
    │   └── templates.ts      # Templates store
    └── views/                 # Page components
        ├── MailLogs.vue
        ├── MailLogDetail.vue
        ├── Templates.vue
        ├── TemplateForm.vue
        └── TemplateDetail.vue
```

---

## 🔧 Implementation Phases

### **Phase 1: Template Management (Priority 1)** 

**Goal:** Complete template CRUD with package integration

#### **1.1 TypeScript Interfaces**
- [x] Create directory structure
- [x] Package configuration files
- [ ] `MailTemplate` interface
- [ ] `MailLog` interface
- [ ] `TemplateFilters` interface
- [ ] `MailFilters` interface
- [ ] Store response types

#### **1.2 Templates Store**
- [ ] `useTemplatesStore` with Pinia
- [ ] `fetchTemplates(filters)` - List templates with pagination
- [ ] `getTemplate(id)` - Get single template
- [ ] `createTemplate(data)` - Create new template
- [ ] `updateTemplate(id, data)` - Update existing
- [ ] `deleteTemplate(id)` - Delete template
- [ ] `duplicateTemplate(id)` - Duplicate template
- [ ] `previewTemplate(id, data)` - Preview with sample data
- [ ] `getTemplateVariables(slug)` - Get available variables
- [ ] Error handling and loading states

#### **1.3 Templates List View**
**File:** `src/views/Templates.vue`

Features:
- [ ] Datatable with templates list
- [ ] Filter by package (notifications, auth, system)
- [ ] Filter by active/inactive status
- [ ] Search by name/slug
- [ ] Statistics cards (total templates, active, by package)
- [ ] Quick actions (edit, duplicate, preview, test)
- [ ] Package badges showing template usage
- [ ] Usage statistics (emails sent, success rate)
- [ ] "Create Template" button

UI Elements:
- [ ] MailHeader component with filters
- [ ] vue3-datatable for list
- [ ] Status badges (active/inactive)
- [ ] Package tags (notifications, auth, etc.)
- [ ] Action buttons (view, edit, duplicate, delete)

#### **1.4 Template Form (Create/Edit)**
**File:** `src/views/TemplateForm.vue`

Features:
- [ ] Form validation (required fields)
- [ ] Name and slug input
- [ ] Subject line with variable support
- [ ] HTML content editor (rich text)
- [ ] Plain text content (optional)
- [ ] From email/name fields
- [ ] Reply-to fields
- [ ] Package tags selector (multi-select)
- [ ] Variable documentation panel
- [ ] Variable picker/inserter
- [ ] Active/inactive toggle
- [ ] Preview button
- [ ] Save button with validation
- [ ] Cancel button

UI Elements:
- [ ] Form with sections
- [ ] Rich text editor (TinyMCE or Quill)
- [ ] Variable picker modal
- [ ] Variable documentation sidebar
- [ ] Validation error messages
- [ ] Preview modal

#### **1.5 Template Detail View**
**File:** `src/views/TemplateDetail.vue`

Features:
- [ ] Template metadata display
- [ ] HTML/Text content display
- [ ] Available variables list
- [ ] Used by packages badge
- [ ] Usage statistics
- [ ] Recent emails sent with this template
- [ ] Preview with sample data
- [ ] Test template button
- [ ] Edit button
- [ ] Duplicate button
- [ ] Delete button (with confirmation)
- [ ] Export button

UI Elements:
- [ ] Template info panel
- [ ] Content preview panel
- [ ] Variables documentation panel
- [ ] Usage statistics panel
- [ ] Recent emails list
- [ ] Action buttons

---

### **Phase 2: Mail Logs & Monitoring (Priority 2)**

#### **2.1 Mail Store**
**File:** `src/stores/mail.ts`

- [ ] `fetchMailLogs(filters)` - List mail logs with pagination
- [ ] `getMailLog(id)` - Get single mail log with details
- [ ] `getStats(filters)` - Get aggregate statistics
- [ ] `retryMail(id)` - Retry failed email (if backend supports)
- [ ] Filtering by status, date, recipient, template, package
- [ ] Error handling and loading states

#### **2.2 Mail Logs List View**
**File:** `src/views/MailLogs.vue`

Features:
- [ ] Datatable with mail logs
- [ ] Filter by status (pending, sent, delivered, failed, bounced)
- [ ] Filter by template
- [ ] Filter by package (notifications, auth, etc.)
- [ ] Filter by date range
- [ ] Search by recipient email
- [ ] Statistics cards (total sent, delivery rate, failed)
- [ ] Status badges with colors
- [ ] Quick view button
- [ ] Pagination

UI Elements:
- [ ] MailHeader component with filters
- [ ] vue3-datatable for logs
- [ ] Date range picker
- [ ] Status filter dropdown
- [ ] Template filter dropdown
- [ ] Package filter dropdown
- [ ] Statistics cards

#### **2.3 Mail Log Detail View**
**File:** `src/views/MailLogDetail.vue`

Features:
- [ ] Email metadata (subject, from, to, cc, bcc)
- [ ] Template used (link to template detail)
- [ ] Status and timestamps
- [ ] Email content preview (HTML)
- [ ] Tracking information (opens, clicks if available)
- [ ] Error message (if failed)
- [ ] Provider information
- [ ] Retry button (if failed)
- [ ] View full headers
- [ ] Related scheduled mail (if any)

UI Elements:
- [ ] Email info panel
- [ ] Content preview iframe
- [ ] Tracking timeline
- [ ] Error display panel
- [ ] Action buttons

---

### **Phase 3: Template Testing & Import/Export (Priority 3)**

#### **3.1 Template Testing**
**File:** Add to `TemplateDetail.vue`

Features:
- [ ] "Test Template" button
- [ ] Test modal with sample data form
- [ ] Fill in template variables
- [ ] Test recipient email input
- [ ] Send test email
- [ ] Success/error feedback
- [ ] View sent test in mail logs

#### **3.2 Template Import/Export**
**Files:** Add to `Templates.vue` and store

Features:
- [ ] Export single template button
- [ ] Export all templates button
- [ ] Import template(s) button
- [ ] Import validation
- [ ] Conflict resolution (overwrite, skip, rename)
- [ ] Import preview before applying
- [ ] Bulk operations support
- [ ] Export formats (JSON, ZIP)

API Endpoints (Backend needs to add):
- [ ] `POST /api/mail/templates/export` - Export templates
- [ ] `POST /api/mail/templates/import` - Import templates

---

### **Phase 4: Analytics & Polish (Priority 4)**

#### **4.1 Tracking Analytics**
**File:** `src/views/TrackingStats.vue` (Future)

Features:
- [ ] Aggregate statistics dashboard
- [ ] Charts for engagement (opens, clicks, bounces)
- [ ] Performance by template
- [ ] Performance by package
- [ ] Time-based trends
- [ ] Export reports

#### **4.2 Advanced Features**
- [ ] Template versioning UI
- [ ] Template inheritance visualization
- [ ] Bulk template operations
- [ ] Template approval workflow
- [ ] A/B testing templates
- [ ] Template scheduling

---

## 🎨 UI Components

### **Shared Components**

#### **MailHeader.vue**
Similar to `NotificationsHeader.vue`, provides:
- Title
- Search input
- Filters (package, status, etc.)
- Action buttons (create, export, etc.)
- Statistics display (optional)

#### **MailTemplateEditor.vue**
Rich HTML editor with:
- Syntax highlighting
- Variable insertion
- Live preview
- Validation
- Template suggestions

#### **MailVariablePicker.vue**
Modal for variable selection:
- List available variables for template type
- Click to insert `{{ $variable }}`
- Documentation for each variable
- Search variables

#### **MailPreview.vue**
Email preview component:
- Desktop/mobile views
- HTML rendering
- Variable substitution
- Test data injection

### **Icon Components**
- `icon-mail.vue` - Main mail icon
- `icon-template.vue` - Template icon
- `icon-envelope.vue` - Email envelope
- `icon-send.vue` - Send icon
- `icon-preview.vue` - Preview icon
- `icon-test.vue` - Test icon

---

## 📊 Data Models

### **MailTemplate Interface**
```typescript
interface MailTemplate {
    id: number;
    uuid: string;
    tenant_id?: number;
    app_id?: number;
    name: string;
    slug: string;
    subject: string;
    content_html?: string;
    content_text?: string;
    from_email?: string;
    from_name?: string;
    reply_to_email?: string;
    reply_to_name?: string;
    layout?: string;
    variables?: Record<string, string>; // variable_name => description
    tags?: string[]; // ['notification', 'auth', 'system']
    version: number;
    parent_template_id?: number;
    is_active: boolean;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    
    // Relations
    parent_template?: MailTemplate;
    child_templates?: MailTemplate[];
    
    // Computed/Usage Stats (from API)
    usage_count?: number;
    success_rate?: number;
    last_used_at?: string;
}
```

### **MailLog Interface**
```typescript
interface MailLog {
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
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    type: 'transactional' | 'bulk' | 'marketing' | 'system';
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
```

### **Template Filters**
```typescript
interface TemplateFilters {
    search?: string;
    package?: string; // 'notification', 'auth', 'system'
    active?: boolean;
    tags?: string[];
    page?: number;
    per_page?: number;
}
```

### **Mail Log Filters**
```typescript
interface MailFilters {
    search?: string; // recipient email
    status?: string;
    template_id?: number;
    package?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}
```

---

## 🔌 API Endpoints

### **Templates API**
```typescript
GET    /api/mail/templates              // List templates
GET    /api/mail/templates/{id}         // Get template
POST   /api/mail/templates              // Create template
PUT    /api/mail/templates/{id}         // Update template
DELETE /api/mail/templates/{id}         // Delete template
POST   /api/mail/templates/{id}/duplicate    // Duplicate
POST   /api/mail/templates/{id}/preview      // Preview
POST   /api/mail/templates/{id}/test         // Send test email
GET    /api/mail/templates/{slug}/variables  // Get variables
```

### **Mail Logs API**
```typescript
GET    /api/mail/{id}                   // Get mail log
GET    /api/mail/stats                  // Get statistics
GET    /api/mail/tracking/stats         // Aggregate tracking stats
GET    /api/mail/tracking/stats/{id}    // Mail-specific tracking
```

---

## 🔐 Permissions

Following moii permission patterns:
```typescript
'mail.view'              // View mail logs
'mail.templates.view'    // View templates
'mail.templates.create'  // Create templates
'mail.templates.edit'    // Edit templates
'mail.templates.delete'  // Delete templates
'mail.templates.test'    // Send test emails
'mail.tracking.view'     // View tracking data
```

---

## 🚀 Integration with Admin

### **Sidebar Integration**
Add to `admin/src/components/layout/Sidebar.vue`:

```vue
<li class="menu nav-item" v-if="hasPermission('mail.view')">
    <button type="button" class="nav-link group">
        <div class="flex items-center">
            <icon-mail class="shrink-0 group-hover:!text-primary" />
            <span class="ltr:pl-3 rtl:pr-3">Email Management</span>
        </div>
    </button>
    <ul class="sub-menu">
        <li v-if="hasPermission('mail.templates.view')">
            <router-link to="/mail/templates">Templates</router-link>
        </li>
        <li v-if="hasPermission('mail.view')">
            <router-link to="/mail/logs">Mail Logs</router-link>
        </li>
    </ul>
</li>
```

### **Router Integration**
Add to `admin/src/router/index.ts`:

```typescript
import { routes as mailRoutes } from '@/packages/moii-mail/src/router';

const routes = [
    // ... existing routes
    ...mailRoutes,
];
```

---

## 📦 Dependencies

Already available in admin:
- `vue` ^3.3.0
- `vue-router` ^4.2.0
- `pinia` ^2.1.0
- `axios` ^1.5.0
- `vue3-datatable` (for tables)
- Date manipulation library (date-fns or moment)

May need to add:
- Rich text editor (TinyMCE, Quill, or similar)
- Code syntax highlighter (for template code view)
- Chart library (ApexCharts for analytics phase)

---

## 🧪 Testing Strategy

### **Unit Tests**
- [ ] Store actions (CRUD operations)
- [ ] Composables (useMailStatus, useTemplateVariables)
- [ ] Component props and emits
- [ ] Data transformations

### **Integration Tests**
- [ ] API calls with mock responses
- [ ] Navigation between views
- [ ] Form validation
- [ ] Error handling

### **E2E Tests**
- [ ] Create template flow
- [ ] Edit template flow
- [ ] View mail logs flow
- [ ] Filter and search functionality
- [ ] Template test flow

---

## 📝 Documentation

### **README.md** - Package overview
- Installation instructions
- Quick start guide
- API reference
- Examples

### **Inline Documentation**
- JSDoc comments for functions
- TypeScript types for all data
- Component prop documentation
- Store action documentation

---

## 🔄 Future Enhancements

### **Phase 5+**
- [ ] Template marketplace (share templates)
- [ ] AI-powered template suggestions
- [ ] Email deliverability score
- [ ] Advanced analytics dashboard
- [ ] Template performance comparison
- [ ] Automated A/B testing
- [ ] Template approval workflow
- [ ] Multi-language template support
- [ ] Template scheduling (publish at date)
- [ ] Template gallery with screenshots
- [ ] Drag-and-drop email builder

---

## 🐛 Known Issues & Limitations

### **Current Limitations**
- No manual email sending (by design - use notifications package)
- No scheduling UI (by design - use notifications package)
- Template import/export needs backend support
- Rich text editor needs selection

### **Backend Dependencies**
The following backend endpoints may need to be added:
- [ ] Template test endpoint (`POST /api/mail/templates/{id}/test`)
- [ ] Template export endpoint (`POST /api/mail/templates/export`)
- [ ] Template import endpoint (`POST /api/mail/templates/import`)
- [ ] Usage statistics endpoint (enhancement)

---

## 📅 Development Timeline

### **Week 1-2: Phase 1 - Template Management**
- Days 1-2: Setup, stores, interfaces
- Days 3-5: Templates list view
- Days 6-8: Template form (create/edit)
- Days 9-10: Template detail view, polish

### **Week 3: Phase 2 - Mail Logs**
- Days 1-3: Mail logs list view
- Days 4-5: Mail log detail view
- Days 6-7: Testing and bug fixes

### **Week 4: Phase 3 - Testing & Import/Export**
- Days 1-3: Template testing feature
- Days 4-6: Import/export functionality
- Day 7: Documentation and polish

**Total: 3-4 weeks for core functionality**

---

## 🎯 Success Criteria

### **MVP Ready When:**
- ✅ Can create, edit, delete email templates
- ✅ Can view all templates with filtering
- ✅ Can see which package uses which template
- ✅ Can preview templates with sample data
- ✅ Can view mail logs with filtering
- ✅ Can see email delivery status
- ✅ Can test templates by sending test emails
- ✅ All CRUD operations work correctly
- ✅ Proper error handling throughout
- ✅ Mobile-responsive UI
- ✅ Integrated with admin sidebar
- ✅ Permissions working correctly

---

## 📞 Support & Resources

- **Backend Package:** `api/packages/moii-mail`
- **Related Packages:** `moii-notifications`, `moii-auth`
- **UI Reference:** `moii-notifications`, `moii-logs`
- **Documentation:** See README.md and inline comments

---

*Last Updated: January 13, 2026*
*Version: 1.0.0*
*Status: In Development - Phase 1*
