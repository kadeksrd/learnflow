import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// 1. Fungsi Helper Admin
async function getAdminUser() {
  const s = await createClient();
  const {
    data: { user },
  } = await s.auth.getUser();
  return user?.user_metadata?.role === "admin" ? user : null;
}

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// 2. Handler PATCH untuk Update Course
export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();

    // TRIK SAKTI: Kita keluarkan 'id' untuk pencarian,
    // dan kita keluarkan 'course_id' supaya TIDAK ikut di-update ke tabel 'courses'
    const { id, course_id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Course ID (id) is required" },
        { status: 400 },
      );
    }

    const s = await createAdminClient();

    // Kita hanya memasukkan 'updateData' yang sudah bersih dari 'course_id'
    const { data, error } = await (s as any)
      .from("courses")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // Log ini buat kita intip di terminal kalau masih ada kolom yang aneh
      console.error("Supabase Error Detail:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

// 3. Handler GET
export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  const s = await createAdminClient();
  const { data, error } = await s
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}
