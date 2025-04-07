import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  
  return (
    <div className="min-h-screen bg-dark-800">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <AdminHeader user={session.user} />
          
          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-dark-700 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}