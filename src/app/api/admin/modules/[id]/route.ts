import { NextRequest, NextResponse } from "next/server";
import {
  getAdminUser,
  unauthorized,
  dbError,
  createAdminClient,
} from "@/lib/api-helpers";

// Handler PATCH (Update Module)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getAdminUser())) return unauthorized();

  try {
    const body = await req.json();
    const s = await createAdminClient(); // Bypass RLS

    const { data, error } = await (s as any)
      .from("modules")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return dbError(error);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
}

// Handler DELETE (Hapus Module)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getAdminUser())) return unauthorized();

  const s = await createAdminClient();
  const { error } = await s.from("modules").delete().eq("id", id);

  if (error) return dbError(error);
  return NextResponse.json({ message: "Deleted" });
}
