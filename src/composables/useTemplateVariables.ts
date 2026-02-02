import { ref, computed } from 'vue';

export function useTemplateVariables() {
    const commonVariables = ref<Record<string, string>>({
        'user.first_name': 'User\'s first name',
        'user.last_name': 'User\'s last name',
        'user.email': 'User\'s email address',
        'app.name': 'Application name',
        'app.url': 'Application URL',
        'date': 'Current date',
        'year': 'Current year'
    });

    const notificationVariables = ref<Record<string, string>>({
        'title': 'Notification title',
        'content': 'Notification content (HTML)',
        'excerpt': 'Notification excerpt/summary',
        'recipientEmail': 'Recipient email address',
        'sentDate': 'Date sent',
        'unsubscribeUrl': 'Unsubscribe URL'
    });

    const authVariables = ref<Record<string, string>>({
        'code': 'Verification code (2FA)',
        'reset_url': 'Password reset URL',
        'expires_in_minutes': 'Expiration time in minutes',
        'changed_at': 'DateTime when password was changed'
    });

    const getVariablesForPackage = (packageName: string): Record<string, string> => {
        const variables: Record<string, Record<string, string>> = {
            notification: { ...commonVariables.value, ...notificationVariables.value },
            auth: { ...commonVariables.value, ...authVariables.value },
            system: commonVariables.value
        };
        
        return variables[packageName] || commonVariables.value;
    };

    const insertVariable = (variableName: string, editor: any) => {
        const variable = `{{ $${variableName} }}`;
        
        // If editor has an insertText method (like CodeMirror or Monaco)
        if (editor && typeof editor.insertText === 'function') {
            editor.insertText(variable);
        }
        // If editor has a value property (like textarea)
        else if (editor && editor.value !== undefined) {
            const start = editor.selectionStart || 0;
            const end = editor.selectionEnd || 0;
            const text = editor.value;
            editor.value = text.substring(0, start) + variable + text.substring(end);
            editor.selectionStart = editor.selectionEnd = start + variable.length;
            editor.focus();
        }
        
        return variable;
    };

    const parseVariablesFromTemplate = (template: string): string[] => {
        const regex = /\{\{\s*\$?([a-zA-Z_][a-zA-Z0-9_.]*)\s*\}\}/g;
        const matches = new Set<string>();
        let match;
        
        while ((match = regex.exec(template)) !== null) {
            matches.add(match[1]);
        }
        
        return Array.from(matches);
    };

    const validateTemplate = (template: string, requiredVariables: string[]): string[] => {
        const foundVariables = parseVariablesFromTemplate(template);
        const errors: string[] = [];
        
        requiredVariables.forEach(required => {
            if (!foundVariables.includes(required)) {
                errors.push(`Required variable missing: ${required}`);
            }
        });
        
        return errors;
    };

    const formatVariableDocumentation = (variables: Record<string, string>): string => {
        return Object.entries(variables)
            .map(([name, desc]) => `{{ $${name} }} - ${desc}`)
            .join('\n');
    };

    return {
        commonVariables,
        notificationVariables,
        authVariables,
        getVariablesForPackage,
        insertVariable,
        parseVariablesFromTemplate,
        validateTemplate,
        formatVariableDocumentation
    };
}
