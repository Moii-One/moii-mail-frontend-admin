# Moii Mail Package

**Version:** 1.2.0  
**Status:** In Development

A comprehensive email template management and mail logs monitoring package for the moii platform. This package provides admin interfaces for managing email templates used across all moii packages (notifications, auth, etc.) and monitoring sent emails.

---

## 📦 Features

### **Template Management**
- ✅ Create, edit, delete, and view email templates
- ✅ Rich HTML editor with variable support
- ✅ Custom CSS support for email styling
- ✅ Template preview with sample data and variable testing
- ✅ Test templates by sending test emails
- ✅ Template organization by package (notifications, auth, system)
- ✅ Template variables documentation (supports {{ $var }} and {{ $object->property }} syntax)
- ✅ Active/inactive status toggle
- ✅ Template duplication
- ✅ Advanced filtering (search, package, status, tags)
- ✅ Auto-incrementing version tracking
- 🔄 Template import/export (coming soon)

### **Mail Logs & Monitoring**
- ✅ View all sent emails with detailed information
- ✅ Filter by status, template, package, date range
- ✅ Search by recipient email
- ✅ View email content and tracking data
- ✅ Delivery statistics and analytics
- ✅ Error debugging for failed emails
- 🔄 Retry failed emails (backend support needed)

### **Package Integration**
- ✅ Manages templates for notifications package
- ✅ Manages templates for auth package (2FA, password reset)
- ✅ Supports any package that uses moii-mail backend

---

## 🚀 Installation

This package is already part of the moii admin monorepo. No separate installation required.

---

## 📖 Usage

### **Import in Your Application**

```typescript
import { mailRoutes, useTemplatesStore, useMailStore } from '@/packages/moii-mail/src';

// Add routes to your router
const routes = [
    ...mailRoutes,
    // ... other routes
];

// Use stores in components
const templatesStore = useTemplatesStore();
const mailStore = useMailStore();
```

### **Using the Templates Store**

```typescript
import { useTemplatesStore } from '@/packages/moii-mail/src/stores/templates';

const templatesStore = useTemplatesStore();

// Fetch templates
await templatesStore.fetchTemplates({
    package: 'notification',
    active: true
});

// Create a template
const template = await templatesStore.createTemplate({
    name: 'Welcome Email',
    slug: 'welcome-email',
    subject: 'Welcome to {{ $app.name }}!',
    content_html: '<h1>Hello {{ $user.first_name }}!</h1>',
    tags: ['notification', 'onboarding'],
    is_active: true
});

// Update a template
await templatesStore.updateTemplate(template.id, {
    subject: 'Welcome aboard, {{ $user.first_name }}!'
});

// Preview a template
const preview = await templatesStore.previewTemplate(template.id, {
    sample_data: {
        'user.first_name': 'John',
        'app.name': 'My App'
    }
});

// Test a template
await templatesStore.testTemplate(template.id, {
    to_email: 'admin@example.com',
    sample_data: {
        'user.first_name': 'Test User'
    }
});
```

### **Using the Mail Logs Store**

```typescript
import { useMailStore } from '@/packages/moii-mail/src/stores/mail';

const mailStore = useMailStore();

// Fetch mail logs
await mailStore.fetchMailLogs({
    status: 'delivered',
    template_id: 123,
    date_from: '2026-01-01',
    date_to: '2026-01-31'
});

// Get a specific mail log
const mail = await mailStore.getMailLog(456);

// Get statistics
const stats = await mailStore.getStats({
    package: 'notification',
    date_from: '2026-01-01'
});
```

### **Using Composables**

```typescript
import { useMailStatus, useTemplateVariables } from '@/packages/moii-mail/src';

// Mail status helper
const { getStatusLabel, getStatusBadgeClass } = useMailStatus();
const label = getStatusLabel('delivered'); // 'Delivered'
const badgeClass = getStatusBadgeClass('delivered'); // 'badge badge-outline-success'

// Template variables helper
const { getVariablesForPackage, insertVariable } = useTemplateVariables();
const notificationVars = getVariablesForPackage('notification');
// Returns: { 'title': 'Notification title', 'content': '...', ... }
```

---

## 🎨 Components

### **Views**
- `Templates.vue` - List all email templates
- `TemplateForm.vue` - Create/edit email templates
- `TemplateDetail.vue` - View template details and test
- `MailLogs.vue` - List all sent emails
- `MailLogDetail.vue` - View email details and tracking

### **Composables**
- `useMailStatus` - Mail status helpers (labels, badges, icons)
- `useTemplateVariables` - Template variable management

---

## 🔌 API Endpoints

### **Templates**
```
GET    /api/mail/templates              - List templates
GET    /api/mail/templates/{id}         - Get template
POST   /api/mail/templates              - Create template
PUT    /api/mail/templates/{id}         - Update template
DELETE /api/mail/templates/{id}         - Delete template
POST   /api/mail/templates/{id}/duplicate    - Duplicate template
POST   /api/mail/templates/{id}/preview      - Preview with data
POST   /api/mail/templates/{id}/test         - Send test email
GET    /api/mail/templates/{slug}/variables  - Get available variables
```

### **Mail Logs**
```
GET    /api/mail                        - List mail logs
GET    /api/mail/{id}                   - Get mail log
GET    /api/mail/stats                  - Get statistics
GET    /api/mail/tracking/stats         - Get tracking stats
```

---

## 🔐 Permissions

The package uses the following permissions:

- `mail.view` - View mail logs
- `mail.templates.view` - View templates
- `mail.templates.create` - Create templates
- `mail.templates.edit` - Edit templates
- `mail.templates.delete` - Delete templates
- `mail.templates.test` - Send test emails
- `mail.tracking.view` - View tracking data

---

## 📊 Data Models

### **MailTemplate**
```typescript
interface MailTemplate {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    subject: string;
    content_html?: string;
    content_text?: string;
    from_email?: string;
    from_name?: string;
    variables?: Record<string, string>;
    tags?: string[];
    is_active: boolean;
    // ... more fields
}
```

### **MailLog**
```typescript
interface MailLog {
    id: number;
    uuid: string;
    subject: string;
    from_email: string;
    to_email: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    template_id?: number;
    sent_at?: string;
    // ... more fields
}
```

See [src/types.ts](src/types.ts) for complete type definitions.

---

## 🧪 Development

### **Setup**
```bash
cd admin/packages/moii-mail
npm install
```

### **Development Server**
```bash
npm run dev
```

### **Build**
```bash
npm run build
```

---

## 📝 Development Plan

See [DEVELOPMENT.md](DEVELOPMENT.md) for the complete implementation plan, including:
- Detailed feature breakdown
- Implementation phases
- UI component specifications
- API integration details
- Future enhancements

---

## 🔗 Integration

### **Add to Admin Sidebar**

Edit `admin/src/components/layout/Sidebar.vue`:

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

### **Add Routes to Router**

Edit `admin/src/router/index.ts`:

```typescript
import { mailRoutes } from '@/packages/moii-mail/src/router';

const routes = [
    ...mailRoutes,
    // ... other routes
];
```

---

## 📚 Related Packages

- **Backend:** `api/packages/moii-mail` - Email sending and template management
- **moii-notifications:** Uses mail templates for notification emails
- **moii-auth:** Uses mail templates for auth emails (2FA, password reset)

---

## 🐛 Known Issues

### **Backend Dependencies**
Some features require backend endpoints that may not exist yet:
- [ ] `POST /api/mail/templates/{id}/test` - Send test email
- [ ] `POST /api/mail/templates/export` - Export templates
- [ ] `POST /api/mail/templates/import` - Import templates
- [ ] `POST /api/mail/{id}/retry` - Retry failed email

### **UI Dependencies**
- Rich text editor needs to be selected and integrated
- Charts library for analytics (Phase 4)

---

## 🚀 Roadmap

### **Phase 1 - Template Management** ✅ (Current)
- Template CRUD operations
- Template list and detail views
- Template form with validation

### **Phase 2 - Mail Logs** (In Progress)
- Mail logs list view
- Mail log detail view
- Filtering and search

### **Phase 3 - Testing & Import/Export**
- Template testing feature
- Import/export functionality

### **Phase 4 - Analytics**
- Tracking analytics dashboard
- Charts and visualizations
- Performance metrics

---

## 👥 Contributing

This is an internal moii package. For contributions or issues, contact the development team.

---

## 📄 License

MIT License - Internal moii project

---

## 📞 Support

- **Documentation:** See [DEVELOPMENT.md](DEVELOPMENT.md)
- **Backend API:** See `api/packages/moii-mail/README.md`
- **Issues:** Contact the development team

---

*Last Updated: January 13, 2026*  
*Package Version: 1.0.0*  
*Status: In Development - Phase 1*
