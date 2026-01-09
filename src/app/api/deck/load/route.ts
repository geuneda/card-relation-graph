import { NextRequest, NextResponse } from 'next/server';
import { supabase, hashPassword } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'DB가 설정되지 않았습니다.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { slotName, password } = body;

    if (!slotName || !password) {
      return NextResponse.json(
        { error: '슬롯 이름과 비밀번호가 필요합니다.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Find the slot
    const { data: existing, error } = await supabase
      .from('deck_saves')
      .select('*')
      .eq('slot_name', slotName)
      .single();

    if (error || !existing) {
      return NextResponse.json(
        { error: '저장된 덱을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Verify password
    if (existing.password_hash !== passwordHash) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: existing.data,
      updatedAt: existing.updated_at || existing.created_at,
    });
  } catch (error) {
    console.error('Load error:', error);
    return NextResponse.json(
      { error: '불러오기 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
