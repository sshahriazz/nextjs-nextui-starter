import prisma from "@/lib/prisma";
import { generateUsernameFromEmail, hashData } from "@/lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email, password } = body;
  // validate username and password
  if (!email || !password) {
    return NextResponse.json({
      error: "Missing username or password",
    });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string);
  // if invalid, return response
  if (!emailPattern) {
    return NextResponse.json({
      error: "Invalid username",
    });
  }
  // hash password
  const passwordHash = await hashData(password as string);
  // create user in database
  if (!passwordHash) {
    return NextResponse.json({
      error: "Error creating user",
    });
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: email as string,
        hashedPassword: passwordHash,
        role: "USER",
      },
    });
    return NextResponse.json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({
        error: "email already exists",
      });
    }
  }
}
