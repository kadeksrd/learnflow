import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// 1. Fungsi Helper untuk Cek Admin
async function getAdminUser() {
  const s = await createClient();
  const {
    data: { user },
  } = await s.auth.getUser();
  return user?.user_metadata?.role === "admin" ? user : null;
}

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// 2. Handler untuk Update Module (PATCH)
export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Module ID is required" },
        { status: 400 },
      );
    }

    const s = await createAdminClient(); // Admin client untuk bypass RLS
    const { data, error } = await (s as any)
      .from("modules")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid Request Body" },
      { status: 400 },
    );
  }
}

// 3. Handler untuk Tambah Module (POST)
export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const s = await createAdminClient();

    const { data, error } = await (s as any)
      .from("modules")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error Detail:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid Request Body" },
      { status: 400 },
    );
  }
}
