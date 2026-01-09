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
    const { slotName, password, data } = body;

    if (!slotName || !password || !data) {
      return NextResponse.json(
        { error: '슬롯 이름, 비밀번호, 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    if (slotName.length < 2 || slotName.length > 20) {
      return NextResponse.json(
        { error: '슬롯 이름은 2-20자여야 합니다.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: '비밀번호는 4자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Check if slot exists
    const { data: existing } = await supabase
      .from('deck_saves')
      .select('id, password_hash')
      .eq('slot_name', slotName)
      .single();

    if (existing) {
      // Verify password for update
      if (existing.password_hash !== passwordHash) {
        return NextResponse.json(
          { error: '비밀번호가 일치하지 않습니다.' },
          { status: 403 }
        );
      }

      // Update existing
      const { error } = await supabase
        .from('deck_saves')
        .update({
          data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;

      return NextResponse.json({ success: true, message: '덱이 업데이트되었습니다.' });
    } else {
      // Create new
      const { error } = await supabase.from('deck_saves').insert({
        slot_name: slotName,
        password_hash: passwordHash,
        data,
      });

      if (error) throw error;

      return NextResponse.json({ success: true, message: '덱이 저장되었습니다.' });
    }
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: '저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
