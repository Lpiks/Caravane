import AdminStudioInboxClient from "./AdminStudioInboxClient";

export const metadata = {
  title: 'Studio Inbox | Kouini Caravane Admin',
};

export default function AdminStudioPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">3D Studio Inbox</h1>
          <p className="text-slate-400">Review custom 3D layouts submitted by potential clients.</p>
        </div>
      </div>

      <AdminStudioInboxClient />
    </div>
  );
}
