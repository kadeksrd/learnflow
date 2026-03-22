import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// 1. Helper Admin (Sekarang sudah ada pembukanya)
async function getAdminUser() {
  const s = await createClient(); // Di Next 14 panggil tanpa await
  const {
    data: { user },
  } = await s.auth.getUser();
  return user?.user_metadata?.role === "admin" ? user : null;
}

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// 2. Handler PATCH (Update Module)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const s = await createAdminClient(); // Bypass RLS

    const { data, error } = await (s as any)
      .from("modules")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}

// 3. Handler DELETE (Hapus Module)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  const s = await createAdminClient();
  const { error } = await s.from("modules").delete().eq("id", params.id);

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "Deleted" });
}
