import { NextRequest, NextResponse } from "next/server";
import { itemSubmissionSchema } from "@/lib/validation/schemas";
import { orchestrator } from "@/lib/ai/orchestrator";
import { serverStore } from "@/lib/storage/request-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = itemSubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const analysis = await orchestrator.analyze(parseResult.data);
    serverStore.saveAnalysis(analysis);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze item",
        message: error?.message || "An unexpected error occurred during analysis.",
      },
      { status: 500 }
    );
  }
}
