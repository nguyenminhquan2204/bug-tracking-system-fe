'use server';
import { cookies } from 'next/headers';

export async function setLocale(locale: 'en' | 'vi') {
  const store = await cookies();
  store.set('locale', locale);
}