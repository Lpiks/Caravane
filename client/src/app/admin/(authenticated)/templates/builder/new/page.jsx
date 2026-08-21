import AdminTemplateBuilderClient from '../../AdminTemplateBuilderClient';

export const metadata = {
  title: 'Create Layout Template | Kouini Caravane Admin',
  description: 'Create a new 3D layout template',
};

export default function NewTemplatePage() {
  return <AdminTemplateBuilderClient isNew={true} />;
}
