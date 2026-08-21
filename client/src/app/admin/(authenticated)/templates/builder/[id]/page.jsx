import AdminTemplateBuilderClient from '../../AdminTemplateBuilderClient';

export const metadata = {
  title: 'Edit Layout Template | Kouini Caravane Admin',
  description: 'Edit a 3D layout template',
};

export default async function EditTemplatePage({ params }) {
  const { id } = await params;
  return <AdminTemplateBuilderClient isNew={false} templateId={id} />;
}
