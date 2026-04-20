
import { notFound } from 'next/navigation';

/**
 * Rota desativada para aumentar a segurança. 
 * O acesso administrativo agora é exclusivo via /portaldochefe.
 */
export default function AdminPage() {
  notFound();
}
