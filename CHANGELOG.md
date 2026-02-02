# Changelog

All notable changes to the moii-mail frontend package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-02-02

### Added
- **Mail Logs Server-Side Pagination** - Full implementation with Vue3 DataTable
- **Statistics Cards** - Visual dashboard showing total, delivered, sent, pending, and failed counts
- **MailLogsHeader Component** - Collapsible filter panel with search, status, and date filters
- **Status Filter** - Filter logs by pending, sent, delivered, failed, or bounced status
- **Date Range Filter** - Filter logs by date from/to
- **Search** - Search across recipient email, sender email, and subject
- **Icon Components** - Added mail, check-circle, send, clock, x-circle icons

### Changed
- **MailLogs.vue** - Complete redesign with server-side pagination support
- **Store** - Updated mail store to handle new pagination response format
- **Default per_page** - Changed from 15 to 10 items per page
- **API endpoint** - Now uses `/api/mail/logs` for fetching mail logs

### Technical Details
- Implemented `isServerMode="true"` for Vue3 DataTable
- Added `handleChange` event processing for pagination
- Status badges with appropriate color coding
- Responsive statistics cards with gradient backgrounds

## [1.2.0] - 2024-01-02

### Added
- **Complete Template Management UI** - Full admin interface for email template management
- **CSS Field Support** - Ability to add custom CSS styles to email templates
- **Advanced Filtering** - Filter templates by search, package, status, and tags
- **Live Preview Modal** - Preview templates with variable testing and CSS rendering
- **Variable Testing** - Test template variables with custom JSON input, supports `{{ $var }}` and `{{ $object->property }}` syntax
- **Template Duplication** - Clone existing templates with one click
- **Version Display** - Auto-incrementing version tracking for templates
- **Toast Notifications** - Success and error notifications for all CRUD operations
- **Delete Confirmation** - SweetAlert2 modal for safe template deletion
- **CustomSelect Components** - Enhanced dropdown filters with select2-style UI
- **Templates Header** - Collapsible filter section with 4 filter options
- **Responsive Design** - Mobile-friendly template management interface

### Changed
- Updated template form to include CSS textarea field
- Enhanced preview modal to inject CSS styles into template preview
- Improved variable replacement to support Laravel Blade syntax
- Updated stores to handle nested API response data structure

### Fixed
- API configuration path issues (updated from `apiEndpoint` to `api_url`)
- Permission checking using proper composables
- Filter functionality to send proper array parameters to backend
- CustomSelect dropdown visibility with select2 CSS styles
- Form submission prevention on Enter key for tag input
- Vue template parsing errors with double curly braces in display text

## [1.0.0] - 2023-12-15

### Added
- Initial release of moii-mail frontend package
- Basic template listing and forms
- Mail logs monitoring interface
- Pinia stores for state management
- Route configuration and sidebar integration
- Permission-based access control
- TypeScript types and interfaces
