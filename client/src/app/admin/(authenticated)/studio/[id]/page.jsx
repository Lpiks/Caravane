import AdminStudioViewerClient from './AdminStudioViewerClient';

export const metadata = {
  title: '3D Design Viewer | Kouini Caravane Admin',
};

export default async function AdminStudioViewerPage({ params }) {
  const resolvedParams = await params;
  return (
    <AdminStudioViewerClient id={resolvedParams.id} />
  );
}
