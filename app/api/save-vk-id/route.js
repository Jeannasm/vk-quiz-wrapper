import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'vk-ids.json');

// Создаём папку и файл при первом запуске
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { vk_user_id, source = 'wrapper' } = body;

    if (!vk_user_id) {
      return NextResponse.json({ error: 'Нет VK ID' }, { status: 400 });
    }

    let ids = [];
    try {
      ids = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {}

    const numericId = Number(vk_user_id);
    const exists = ids.some(item => item.vk_user_id === numericId);

    if (!exists) {
      ids.push({
        vk_user_id: numericId,
        date: new Date().toISOString(),
        source
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(ids, null, 2));

    return NextResponse.json({ 
      success: true, 
      total: ids.length 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
