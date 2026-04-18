import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { vk_user_id, source = 'wrapper' } = body;

    if (!vk_user_id) {
      return NextResponse.json({ error: 'Нет VK ID' }, { status: 400 });
    }

    const numericId = Number(vk_user_id);
    const timestamp = new Date().toISOString();

    // Временное решение: выводим в логи Vercel
    console.log(`[VK ID SAVED] ${numericId} | source: ${source} | time: ${timestamp}`);

    // Пока возвращаем успех (даже без реального сохранения)
    return NextResponse.json({ 
      success: true, 
      total: "unknown (логи в Vercel)", 
      saved_id: numericId,
      message: 'ID получен и залогирован'
    });

  } catch (error) {
    console.error('Ошибка в /api/save-vk-id:', error);
    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    }, { status: 500 });
  }
}
