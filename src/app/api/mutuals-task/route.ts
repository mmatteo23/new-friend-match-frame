import { NextRequest, NextResponse } from "next/server";
import { createNewMutualsTask } from "@/lib/qstash-write";

export const POST = async (req: NextRequest) => {
  const secret = req.headers.get("x-secret");
  if (secret !== process.env.SECRET) {
    return NextResponse.json({
      success: false,
      message: "Invalid secret",
    });
  }
  const body = await req.json();
  const { username, id } = body;
  console.log("Creating task...", {
    username,
    id,
  });
  if (!username || !id) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required body parameters",
      },
      {
        status: 400,
      }
    );
  }

  await createNewMutualsTask(id, username);

  return NextResponse.json({ success: true });
};
